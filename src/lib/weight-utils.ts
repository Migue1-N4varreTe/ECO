import { Product } from "./data";

/**
 * Utility functions for handling weight-based products (gramage)
 */

export interface WeightProductCalculation {
  displayPrice: number;
  displayUnit: string;
  isWeightBased: boolean;
  minWeightStep: number;
  maxWeight?: number;
  baseUnit: "kg" | "gramo" | "litro";
}

/**
 * Determines if a product is sold by weight
 */
export function isWeightBasedProduct(product: Product): boolean {
  return product.sellByWeight || 
         product.unit === "kg" || 
         product.unit === "gramo" || 
         product.unit === "litro";
}

/**
 * Gets the weight calculation details for a product
 */
export function getWeightCalculation(product: Product): WeightProductCalculation {
  const isWeightBased = isWeightBasedProduct(product);
  
  if (!isWeightBased) {
    return {
      displayPrice: product.price,
      displayUnit: product.unit,
      isWeightBased: false,
      minWeightStep: 1,
      baseUnit: "kg"
    };
  }

  let minWeightStep = 0.1; // Default 100g minimum
  let baseUnit: "kg" | "gramo" | "litro" = "kg";
  let displayUnit = product.unit;

  switch (product.unit) {
    case "kg":
      minWeightStep = 0.1; // 100g steps
      baseUnit = "kg";
      break;
    case "gramo":
      minWeightStep = 100; // 100g steps
      baseUnit = "gramo";
      displayUnit = "g";
      break;
    case "litro":
      minWeightStep = 0.1; // 100ml steps
      baseUnit = "litro";
      break;
  }

  return {
    displayPrice: product.price,
    displayUnit,
    isWeightBased: true,
    minWeightStep,
    baseUnit
  };
}

/**
 * Formats weight display text
 */
export function formatWeight(quantity: number, unit: string): string {
  if (unit === "kg") {
    if (quantity < 1) {
      return `${Math.round(quantity * 1000)}g`;
    }
    return `${quantity}kg`;
  }
  
  if (unit === "gramo" || unit === "g") {
    if (quantity >= 1000) {
      return `${(quantity / 1000).toFixed(1)}kg`;
    }
    return `${quantity}g`;
  }
  
  if (unit === "litro") {
    if (quantity < 1) {
      return `${Math.round(quantity * 1000)}ml`;
    }
    return `${quantity}L`;
  }
  
  return `${quantity} ${unit}`;
}

/**
 * Calculates total price for weight-based products
 */
export function calculateWeightPrice(
  basePrice: number, 
  quantity: number, 
  unit: string
): number {
  const calculation = getWeightCalculation({ 
    price: basePrice, 
    unit, 
    sellByWeight: true 
  } as Product);
  
  if (!calculation.isWeightBased) {
    return basePrice * quantity;
  }
  
  // Price is per unit (kg, gramo, litro)
  return basePrice * quantity;
}

/**
 * Validates quantity for weight-based products
 */
export function validateWeightQuantity(
  quantity: number, 
  product: Product
): { isValid: boolean; adjustedQuantity?: number; errorMessage?: string } {
  const calculation = getWeightCalculation(product);
  
  if (!calculation.isWeightBased) {
    // For non-weight products, quantity must be whole number
    if (quantity !== Math.floor(quantity)) {
      return {
        isValid: false,
        adjustedQuantity: Math.floor(quantity),
        errorMessage: "La cantidad debe ser un número entero"
      };
    }
    return { isValid: true };
  }
  
  // For weight-based products
  if (quantity < calculation.minWeightStep) {
    return {
      isValid: false,
      adjustedQuantity: calculation.minWeightStep,
      errorMessage: `Cantidad mínima: ${formatWeight(calculation.minWeightStep, product.unit)}`
    };
  }
  
  // Round to valid step
  const adjustedQuantity = Math.round(quantity / calculation.minWeightStep) * calculation.minWeightStep;
  
  if (Math.abs(quantity - adjustedQuantity) > 0.001) {
    return {
      isValid: false,
      adjustedQuantity,
      errorMessage: `Cantidad ajustada a: ${formatWeight(adjustedQuantity, product.unit)}`
    };
  }
  
  // Check maximum weight if applicable
  if (calculation.maxWeight && quantity > calculation.maxWeight) {
    return {
      isValid: false,
      adjustedQuantity: calculation.maxWeight,
      errorMessage: `Cantidad máxima: ${formatWeight(calculation.maxWeight, product.unit)}`
    };
  }
  
  return { isValid: true };
}

/**
 * Generates quantity options for weight selector
 */
export function getWeightQuantityOptions(product: Product): Array<{ value: number; label: string }> {
  const calculation = getWeightCalculation(product);
  
  if (!calculation.isWeightBased) {
    // For regular products, return 1-10 pieces
    return Array.from({ length: 10 }, (_, i) => ({
      value: i + 1,
      label: `${i + 1} ${product.unit}${i === 0 ? '' : 's'}`
    }));
  }
  
  const options: Array<{ value: number; label: string }> = [];
  const step = calculation.minWeightStep;
  const maxOptions = 20;
  
  for (let i = 1; i <= maxOptions; i++) {
    const value = step * i;
    options.push({
      value,
      label: formatWeight(value, product.unit)
    });
  }
  
  return options;
}

/**
 * Converts between weight units
 */
export function convertWeight(
  quantity: number, 
  fromUnit: string, 
  toUnit: string
): number {
  // Normalize to grams first
  let grams: number;
  
  switch (fromUnit) {
    case "kg":
      grams = quantity * 1000;
      break;
    case "gramo":
    case "g":
      grams = quantity;
      break;
    case "litro":
      grams = quantity * 1000; // Assuming 1L = 1000g for liquids
      break;
    default:
      return quantity; // No conversion
  }
  
  // Convert to target unit
  switch (toUnit) {
    case "kg":
      return grams / 1000;
    case "gramo":
    case "g":
      return grams;
    case "litro":
      return grams / 1000; // Assuming 1000g = 1L for liquids
    default:
      return quantity; // No conversion
  }
}

/**
 * Check if product has stock available for given quantity
 */
export function checkWeightStock(
  product: Product, 
  requestedQuantity: number,
  currentCartQuantity: number = 0
): { hasStock: boolean; availableQuantity: number; errorMessage?: string } {
  if (!product.inStock) {
    return {
      hasStock: false,
      availableQuantity: 0,
      errorMessage: "Producto agotado"
    };
  }
  
  const totalRequested = requestedQuantity + currentCartQuantity;
  const availableStock = product.stock || 0;
  
  if (totalRequested > availableStock) {
    return {
      hasStock: false,
      availableQuantity: Math.max(0, availableStock - currentCartQuantity),
      errorMessage: `Stock insuficiente. Disponible: ${formatWeight(availableStock, product.unit)}`
    };
  }
  
  return {
    hasStock: true,
    availableQuantity: availableStock
  };
}
