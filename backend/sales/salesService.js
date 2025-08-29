import { supabase } from "../config/supabase.js";

const scanProduct = async (barcode) => {
  try {
    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          aisle
        )
      `,
      )
      .eq("barcode", barcode)
      .eq("is_active", true)
      .single();

    if (error || !product) {
      throw new Error("Producto no encontrado");
    }

    if (product.stock <= 0) {
      throw new Error("Producto sin stock disponible");
    }

    return product;
  } catch (error) {
    throw error;
  }
};

const createSale = async (saleData, user) => {
  try {
    const {
      items,
      payment_method,
      total,
      discount = 0,
      tax = 0,
      customer_id = null,
    } = saleData;

    // Build items list: from request or from user's cart
    let sourceItems = Array.isArray(items) && items.length > 0 ? items : null;
    if (!sourceItems) {
      const { data: cart } = await supabase
        .from("carts")
        .select("items")
        .eq("user_id", user.id)
        .single();
      if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
        throw new Error("Carrito vacío");
      }
      sourceItems = cart.items.map((ci) => ({ product_id: ci.product_id, quantity: ci.quantity }));
    }

    // Validate items and check stock
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of sourceItems) {
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", item.product_id)
        .eq("is_active", true)
        .single();

      if (error || !product) {
        throw new Error(`Producto ${item.product_id} no encontrado`);
      }

      const sellByWeight = product.sell_by_weight === true || product.unit === "kg";
      const qty = sellByWeight ? (Number(item.weight_kg) || Number(item.quantity) || 0) : Number(item.quantity) || 0;

      if (qty <= 0) {
        throw new Error(`Cantidad inválida para ${product.name}`);
      }

      if ((product.stock_quantity ?? 0) < qty) {
        throw new Error(
          `Stock insuficiente para ${product.name}. Disponible: ${product.stock_quantity ?? 0}`,
        );
      }

      const unitPrice = Number(product.price);
      const itemTotal = unitPrice * qty;
      calculatedTotal += itemTotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        product_price: unitPrice,
        quantity: qty,
        unit: product.unit || (sellByWeight ? "kg" : "pieza"),
        subtotal: itemTotal,
      });
    }

    // Apply discount
    const finalTotal = calculatedTotal - discount + tax;

    // If client sent total, verify within tolerance
    if (total !== undefined && Math.abs(finalTotal - total) > 0.01) {
      throw new Error("El total calculado no coincide con el total enviado");
    }

    // Create order
    const orderNumber = `ORD-${Date.now()}`;
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          cashier_id: user.id,
          customer_id,
          status: "completed",
          payment_method,
          subtotal: calculatedTotal,
          tax_amount: tax,
          discount_amount: discount,
          total_amount: finalTotal,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (orderError) {
      throw new Error("Error al crear orden: " + orderError.message);
    }

    // Create order items
    const orderItems = validatedItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.product_price,
      total_price: item.subtotal,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      throw new Error("Error al crear items de venta: " + itemsError.message);
    }

    // Update product stock
    for (const item of validatedItems) {
      const { data: current } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .single();

      const newQty = Math.max(0, Number(current?.stock_quantity ?? 0) - item.quantity);
      await supabase
        .from("products")
        .update({ stock_quantity: newQty, updated_at: new Date().toISOString() })
        .eq("id", item.product_id);
    }

    // Clear cart after successful order
    await supabase.from("carts").update({ items: [], updated_at: new Date().toISOString() }).eq("user_id", user.id);

    // Log sale
    await supabase.from("audit_logs").insert([
      {
        user_id: user.id,
        action: "order_completed",
        table_name: "orders",
        record_id: order.id,
        details: {
          order_id: order.id,
          total: finalTotal,
          items_count: validatedItems.length,
          payment_method,
        },
        created_at: new Date().toISOString(),
      },
    ]);

    return {
      sale: {
        id: order.id,
        sale_number: order.order_number,
        subtotal: order.subtotal,
        discount: order.discount_amount,
        tax: order.tax_amount,
        total: order.total_amount,
        payment_method: order.payment_method,
        status: order.status,
        created_at: order.created_at,
        items: orderItems,
      },
    };
  } catch (error) {
    throw error;
  }
};

const processPayment = async (paymentData, user) => {
  try {
    const { sale_id, payment_method, amount_received } = paymentData;

    // Get sale
    const { data: sale, error: saleError } = await supabase
      .from("sales")
      .select("*")
      .eq("id", sale_id)
      .single();

    if (saleError || !sale) {
      throw new Error("Venta no encontrada");
    }

    if (sale.status !== "pending") {
      throw new Error("Esta venta ya fue procesada");
    }

    if (amount_received < sale.total) {
      throw new Error("Monto recibido insuficiente");
    }

    const change = amount_received - sale.total;

    // Update sale
    const { data: updatedSale, error: updateError } = await supabase
      .from("sales")
      .update({
        payment_method,
        amount_received,
        change_given: change,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", sale_id)
      .select()
      .single();

    if (updateError) {
      throw new Error("Error al procesar pago: " + updateError.message);
    }

    return {
      sale: updatedSale,
      change,
      message: "Pago procesado exitosamente",
    };
  } catch (error) {
    throw error;
  }
};

const generateReceipt = async (saleId) => {
  try {
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          product_id,
          quantity,
          unit_price,
          total_price
        )
      `,
      )
      .eq("id", saleId)
      .single();

    if (orderErr || !order) {
      throw new Error("Orden no encontrada");
    }

    const receipt = {
      sale_id: order.id,
      date: order.created_at,
      items: order.order_items?.map((i) => ({
        product_id: i.product_id,
        product_price: i.unit_price,
        quantity: i.quantity,
        subtotal: i.total_price,
      })) || [],
      subtotal: order.subtotal,
      discount: order.discount_amount,
      tax: order.tax_amount,
      total: order.total_amount,
      payment_method: order.payment_method,
    };

    return receipt;
  } catch (error) {
    throw error;
  }
};

const processSaleRefund = async (refundData, user) => {
  try {
    const { sale_id, items, reason, refund_amount } = refundData;

    // Get original sale
    const { data: sale, error: saleError } = await supabase
      .from("sales")
      .select("*")
      .eq("id", sale_id)
      .single();

    if (saleError || !sale) {
      throw new Error("Venta no encontrada");
    }

    // Create refund record
    const { data: refund, error: refundError } = await supabase
      .from("refunds")
      .insert([
        {
          original_sale_id: sale_id,
          processed_by: user.id,
          reason,
          refund_amount,
          status: "completed",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (refundError) {
      throw new Error("Error al crear devolución: " + refundError.message);
    }

    // Create refund items and restore stock
    for (const item of items) {
      await supabase.from("refund_items").insert([
        {
          refund_id: refund.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.quantity * item.unit_price,
        },
      ]);

      // Restore stock
      await supabase
        .from("products")
        .update({
          stock: supabase.raw(`stock + ${item.quantity}`),
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.product_id);
    }

    // Log refund
    await supabase.from("audit_logs").insert([
      {
        user_id: user.id,
        action: "refund_processed",
        details: {
          refund_id: refund.id,
          original_sale_id: sale_id,
          refund_amount,
          items_count: items.length,
          reason,
        },
        created_at: new Date().toISOString(),
      },
    ]);

    return refund;
  } catch (error) {
    throw error;
  }
};

const getSaleById = async (saleId) => {
  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          product_id,
          quantity,
          unit_price,
          total_price
        )
      `,
      )
      .eq("id", saleId)
      .single();

    if (error || !order) {
      throw new Error("Orden no encontrada");
    }

    return order;
  } catch (error) {
    throw error;
  }
};

const getSales = async (filters = {}) => {
  try {
    let query = supabase
      .from("orders")
      .select(
        `
        *
      `,
      )
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters.store_id) {
      query = query.eq("store_id", filters.store_id);
    }

    if (filters.cashier_id) {
      query = query.eq("cashier_id", filters.cashier_id);
    }

    if (filters.from_date) {
      query = query.gte("created_at", filters.from_date);
    }

    if (filters.to_date) {
      query = query.lte("created_at", filters.to_date);
    }

    // Pagination
    const offset = (filters.page - 1) * filters.limit;
    query = query.range(offset, offset + filters.limit - 1);

    const { data: orders, error, count } = await query;

    if (error) {
      throw new Error("Error al obtener ventas: " + error.message);
    }

    const mapped = (orders || []).map((o) => ({
      id: o.id,
      order_number: o.order_number,
      subtotal: o.subtotal,
      discount: o.discount_amount,
      tax: o.tax_amount,
      total: o.total_amount,
      payment_method: o.payment_method,
      status: o.status,
      created_at: o.created_at,
    }));

    return {
      sales: mapped,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: count,
        pages: Math.ceil((count ?? mapped.length) / filters.limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

const getSalesReport = async (filters = {}) => {
  try {
    let query = supabase.from("orders").select("*").eq("status", "completed");

    if (filters.store_id) {
      query = query.eq("store_id", filters.store_id);
    }

    if (filters.cashier_id) {
      query = query.eq("cashier_id", filters.cashier_id);
    }

    if (filters.from_date) {
      query = query.gte("created_at", filters.from_date);
    }

    if (filters.to_date) {
      query = query.lte("created_at", filters.to_date);
    }

    const { data: sales, error } = await query;

    if (error) {
      throw new Error("Error al generar reporte: " + error.message);
    }

    // Calculate metrics
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0);
    const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Group by payment method
    const paymentMethods = sales.reduce((acc, sale) => {
      acc[sale.payment_method] = (acc[sale.payment_method] || 0) + 1;
      return acc;
    }, {});

    // Group by hour
    const hourlyBreakdown = sales.reduce((acc, sale) => {
      const hour = new Date(sale.created_at).getHours();
      acc[hour] = (acc[hour] || 0) + Number(sale.total_amount || 0);
      return acc;
    }, {});

    return {
      period: {
        from: filters.from_date,
        to: filters.to_date,
      },
      metrics: {
        total_sales: totalSales,
        total_revenue: totalRevenue,
        average_ticket: averageTicket,
      },
      breakdown: {
        payment_methods: paymentMethods,
        hourly: hourlyBreakdown,
      },
    };
  } catch (error) {
    throw error;
  }
};

export {
  scanProduct,
  createSale,
  processPayment,
  generateReceipt,
  processSaleRefund,
  getSaleById,
  getSales,
  getSalesReport,
};
