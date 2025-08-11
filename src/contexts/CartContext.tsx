import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, allProducts } from "@/lib/data";
import { validateWeightQuantity, checkWeightStock } from "@/lib/weight-utils";
import { CART_CONFIG } from "@/lib/constants";

export interface CartItem {
  id: string;
  quantity: number;
  addedAt: Date;
}

export interface CartItemWithProduct extends Omit<Product, "id"> {
  id: string;
  quantity: number;
  addedAt: Date;
}

interface CartContextType {
  cartItems: CartItem[];
  cartProducts: CartItemWithProduct[];
  cartCount: number;
  cartTotal: number;
  cartSubtotal: number;
  totalItems: number;
  addToCart: (productId: string, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => boolean;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_CONFIG.STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Convert addedAt strings back to Date objects
        const cartWithDates = parsedCart.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        setCartItems(cartWithDates);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        localStorage.removeItem(CART_CONFIG.STORAGE_KEY);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_CONFIG.STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Get product details for cart items
  const cartProducts: CartItemWithProduct[] = cartItems
    .map((item) => {
      const product = allProducts.find((p) => p.id === item.id);
      return product
        ? { ...product, quantity: item.quantity, addedAt: item.addedAt }
        : null;
    })
    .filter(Boolean) as CartItemWithProduct[];

  // Calculate cart metrics
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalItems = cartItems.length; // Number of different products
  const cartSubtotal = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cartTotal = cartSubtotal; // Can add taxes, delivery, etc. later

  const addToCart = (productId: string, quantity: number = 1): boolean => {
    // Find the product to validate stock
    const product = allProducts.find((p) => p.id === productId);

    if (!product) {
      console.error(`Product with id ${productId} not found`);
      return false;
    }

    if (!product.inStock) {
      console.error(`Product ${productId} is out of stock`);
      return false;
    }

    // Validate quantity for weight-based products
    const quantityValidation = validateWeightQuantity(quantity, product);
    if (!quantityValidation.isValid) {
      console.error(`Invalid quantity for ${productId}: ${quantityValidation.errorMessage}`);
      return false;
    }

    const existingItem = cartItems.find((item) => item.id === productId);
    const currentCartQuantity = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentCartQuantity + quantity;

    // Check stock availability
    const stockCheck = checkWeightStock(product, quantity, currentCartQuantity);
    if (!stockCheck.hasStock) {
      console.error(`Stock check failed for ${productId}: ${stockCheck.errorMessage}`);
      return false;
    }

    let success = false;
    setCartItems((prev) => {
      if (existingItem) {
        // Update quantity of existing item
        success = true;
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: newTotalQuantity } : item,
        );
      } else {
        // Add new item to cart
        success = true;
        return [
          ...prev,
          {
            id: productId,
            quantity,
            addedAt: new Date(),
          },
        ];
      }
    });

    return success;
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number): boolean => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return true;
    }

    const product = allProducts.find((p) => p.id === productId);
    if (!product) {
      console.error(`Product with id ${productId} not found`);
      return false;
    }

    // Validate quantity for weight-based products
    const quantityValidation = validateWeightQuantity(quantity, product);
    if (!quantityValidation.isValid) {
      console.error(`Invalid quantity for ${productId}: ${quantityValidation.errorMessage}`);
      return false;
    }

    // Check stock availability
    const stockCheck = checkWeightStock(product, quantity, 0);
    if (!stockCheck.hasStock) {
      console.error(`Stock check failed for ${productId}: ${stockCheck.errorMessage}`);
      return false;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );

    return true;
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (productId: string) => {
    return cartItems.some((item) => item.id === productId);
  };

  const getItemQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    cartItems,
    cartProducts,
    cartCount,
    cartTotal,
    cartSubtotal,
    totalItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
