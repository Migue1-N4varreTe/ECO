import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { allProducts } from "@/lib/data";
import { formatWeight, getWeightCalculation } from "@/lib/weight-utils";

export const useCartActions = () => {
  const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
  } = useCart();
  const { toast } = useToast();

  const addToCartWithNotification = (
    productId: string,
    quantity: number = 1,
    productName?: string,
  ): boolean => {
    // Find the product to validate before adding
    const product = allProducts.find((p) => p.id === productId);

    if (!product) {
      toast({
        title: "Error",
        description: "Producto no encontrado",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }

    // Try to add to cart with all validations
    const success = addToCart(productId, quantity);

    if (!success) {
      // The cart context already logged the specific error
      // We'll show a generic error message
      const calculation = getWeightCalculation(product);
      const quantityText = calculation.isWeightBased
        ? formatWeight(quantity, product.unit)
        : `${quantity} ${product.unit}${quantity !== 1 ? 's' : ''}`;

      toast({
        title: "No se pudo agregar",
        description: `No se pudo agregar ${quantityText} de ${productName || product.name}`,
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }

    // Success notification
    const calculation = getWeightCalculation(product);
    const quantityText = calculation.isWeightBased
      ? formatWeight(quantity, product.unit)
      : `${quantity} ${product.unit}${quantity !== 1 ? 's' : ''}`;

    toast({
      title: "Producto agregado",
      description: `${quantityText} de ${productName || product.name} se agregó al carrito`,
      duration: 2000,
    });

    return true;
  };

  const removeFromCartWithNotification = (
    productId: string,
    productName?: string,
  ) => {
    removeFromCart(productId);
    toast({
      title: "Producto eliminado",
      description: `${productName || "El producto"} se eliminó del carrito`,
      duration: 2000,
    });
  };

  const clearCartWithConfirmation = () => {
    clearCart();
    toast({
      title: "Carrito vaciado",
      description: "Se eliminaron todos los productos del carrito",
      duration: 3000,
    });
  };

  const updateQuantityWithValidation = (
    productId: string,
    quantity: number,
  ): boolean => {
    if (quantity < 1) {
      removeFromCart(productId);
      return true;
    }

    const product = allProducts.find((p) => p.id === productId);
    if (!product) {
      toast({
        title: "Error",
        description: "Producto no encontrado",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }

    // Try to update quantity with validations
    const success = updateQuantity(productId, quantity);

    if (!success) {
      const calculation = getWeightCalculation(product);
      const quantityText = calculation.isWeightBased
        ? formatWeight(quantity, product.unit)
        : `${quantity} ${product.unit}${quantity !== 1 ? 's' : ''}`;

      toast({
        title: "No se pudo actualizar",
        description: `No se pudo actualizar a ${quantityText}`,
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }

    return true;
  };

  return {
    addToCartWithNotification,
    removeFromCartWithNotification,
    clearCartWithConfirmation,
    updateQuantityWithValidation,
  };
};
