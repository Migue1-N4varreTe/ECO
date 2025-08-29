import express from "express";
import { authenticateToken } from "../auth/middleware.js";
import { supabase } from "../config/supabase.js";

const router = express.Router();

async function ensureCart(userId) {
  const { data: existing } = await supabase
    .from("carts")
    .select("id, items")
    .eq("user_id", userId)
    .single();

  if (existing) return existing;

  const { data: created, error } = await supabase
    .from("carts")
    .insert([{ user_id: userId, items: [], updated_at: new Date().toISOString() }])
    .select("id, items")
    .single();
  if (error) throw new Error("No se pudo crear carrito");
  return created;
}

function summarize(items) {
  const subtotal = (items || []).reduce((sum, it) => sum + Number(it.subtotal || 0), 0);
  const total_items = (items || []).reduce((sum, it) => sum + Number(it.quantity || 0), 0);
  return { total_items, subtotal, tax: 0, total: subtotal };
}

// Scan product
router.post("/scan", authenticateToken, async (req, res) => {
  try {
    const { barcode, sku, product_id } = req.body || {};
    if (!barcode && !sku && !product_id) {
      return res.status(400).json({ error: "Se requiere código de barras, SKU o ID del producto" });
    }

    let q = supabase
      .from("products")
      .select(`id, name, description, price, sku, barcode, stock_quantity, unit, categories(name)`) 
      .eq("is_active", true);

    if (barcode) q = q.eq("barcode", barcode);
    else if (sku) q = q.eq("sku", sku);
    else q = q.eq("id", product_id);

    const { data: product, error } = await q.single();
    if (error || !product) return res.status(404).json({ error: "Producto no encontrado" });
    if ((product.stock_quantity ?? 0) <= 0) {
      return res.status(400).json({ error: "Producto sin stock disponible", product });
    }
    res.json({ message: "Producto escaneado exitosamente", product });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Add item
router.post("/add-item", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1, unit_price } = req.body || {};
    if (!product_id) return res.status(400).json({ error: "ID del producto es requerido" });

    const { data: product, error: pErr } = await supabase
      .from("products")
      .select("id, name, price, stock_quantity, sku, unit")
      .eq("id", product_id)
      .eq("is_active", true)
      .single();
    if (pErr || !product) return res.status(404).json({ error: "Producto no encontrado" });

    const cart = await ensureCart(userId);
    const items = Array.isArray(cart.items) ? [...cart.items] : [];
    const idx = items.findIndex((it) => it.product_id === product_id);
    const q = parseInt(quantity);

    if ((product.stock_quantity ?? 0) < q + (idx >= 0 ? Number(items[idx].quantity || 0) : 0)) {
      return res.status(400).json({ error: "Stock insuficiente", available_stock: product.stock_quantity });
    }

    const price = Number(unit_price ?? product.price ?? 0);
    if (idx >= 0) {
      const newQty = Number(items[idx].quantity || 0) + q;
      items[idx] = { ...items[idx], quantity: newQty, unit_price: price, subtotal: newQty * price };
    } else {
      items.push({ id: product_id, product_id, quantity: q, unit_price: price, subtotal: q * price });
    }

    const { data: updated, error: uErr } = await supabase
      .from("carts")
      .update({ items, updated_at: new Date().toISOString() })
      .eq("id", cart.id)
      .select("id, items")
      .single();
    if (uErr) return res.status(500).json({ error: "Error al guardar carrito" });

    // enrich items with product info for response
    const ids = updated.items.map((i) => i.product_id);
    const { data: prods } = await supabase.from("products").select("id, name, sku, unit").in("id", ids);
    const map = new Map((prods || []).map((p) => [p.id, p]));
    const enriched = updated.items.map((i) => ({ ...i, products: map.get(i.product_id) || null }));

    res.status(201).json({ message: "Item agregado al carrito exitosamente", cart: { items: enriched, summary: summarize(enriched) } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Get current cart
router.get("/current", authenticateToken, async (req, res) => {
  try {
    const cart = await ensureCart(req.user.id);
    const items = Array.isArray(cart.items) ? cart.items : [];
    if (items.length === 0) return res.json({ cart: { items: [], summary: summarize([]) } });

    const ids = items.map((i) => i.product_id);
    const { data: prods } = await supabase.from("products").select("id, name, sku, barcode, unit, stock_quantity, categories(name)").in("id", ids);
    const map = new Map((prods || []).map((p) => [p.id, p]));
    const enriched = items.map((i) => ({ ...i, products: map.get(i.product_id) || null }));

    res.json({ cart: { items: enriched, summary: summarize(enriched) } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Update quantity
router.patch("/items/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // product_id as id
    const { quantity } = req.body;
    const q = parseInt(quantity);
    if (!q || q < 1) return res.status(400).json({ error: "Cantidad debe ser mayor a 0" });

    const cart = await ensureCart(req.user.id);
    const items = Array.isArray(cart.items) ? [...cart.items] : [];
    const idx = items.findIndex((it) => it.product_id === id);
    if (idx < 0) return res.status(404).json({ error: "Item del carrito no encontrado" });

    const { data: product } = await supabase
      .from("products")
      .select("id, stock_quantity, price, name, sku, unit")
      .eq("id", id)
      .single();

    if ((product?.stock_quantity ?? 0) < q) return res.status(400).json({ error: "Stock insuficiente", available_stock: product?.stock_quantity ?? 0 });

    const price = Number(items[idx].unit_price ?? product?.price ?? 0);
    items[idx] = { ...items[idx], quantity: q, subtotal: q * price };

    const { data: updated } = await supabase
      .from("carts")
      .update({ items, updated_at: new Date().toISOString() })
      .eq("id", cart.id)
      .select("id, items")
      .single();

    // enrich
    const ids = updated.items.map((i) => i.product_id);
    const { data: prods } = await supabase.from("products").select("id, name, sku, unit").in("id", ids);
    const map = new Map((prods || []).map((p) => [p.id, p]));
    const enriched = updated.items.map((i) => ({ ...i, products: map.get(i.product_id) || null }));

    res.json({ message: "Item actualizado exitosamente", cart: { items: enriched, summary: summarize(enriched) } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Remove item
router.delete("/items/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // product_id
    const cart = await ensureCart(req.user.id);
    const items = (Array.isArray(cart.items) ? cart.items : []).filter((it) => it.product_id !== id);
    await supabase.from("carts").update({ items, updated_at: new Date().toISOString() }).eq("id", cart.id);
    res.json({ message: "Item eliminado del carrito", cart_item_id: id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Clear cart
router.delete("/clear", authenticateToken, async (req, res) => {
  try {
    const cart = await ensureCart(req.user.id);
    await supabase.from("carts").update({ items: [], updated_at: new Date().toISOString() }).eq("id", cart.id);
    res.json({ message: "Carrito limpiado exitosamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
