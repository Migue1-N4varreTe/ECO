import { describe, it, expect } from 'vitest';
import {
  isWeightBasedProduct,
  getWeightCalculation,
  formatWeight,
  calculateWeightPrice,
  validateWeightQuantity,
  getWeightQuantityOptions,
  convertWeight,
  checkWeightStock,
} from './weight-utils';
import type { Product } from './data';

// Mock products for testing
const mockWeightProduct: Product = {
  id: 'test-kg-product',
  name: 'Manzanas Rojas',
  price: 45,
  category: 'frutas-verduras',
  image: '/test.jpg',
  description: 'Test product',
  inStock: true,
  stock: 10,
  tags: [],
  rating: 4.5,
  reviewCount: 100,
  deliveryTime: '15-20 min',
  unit: 'kg',
  sellByWeight: true,
};

const mockPieceProduct: Product = {
  id: 'test-piece-product',
  name: 'Coco',
  price: 35,
  category: 'frutas-verduras',
  image: '/test.jpg',
  description: 'Test product',
  inStock: true,
  stock: 20,
  tags: [],
  rating: 4.5,
  reviewCount: 50,
  deliveryTime: '15-20 min',
  unit: 'pieza',
  sellByWeight: false,
};

const mockGramProduct: Product = {
  id: 'test-gram-product',
  name: 'Especias',
  price: 2,
  category: 'condimentos',
  image: '/test.jpg',
  description: 'Test product',
  inStock: true,
  stock: 500,
  tags: [],
  rating: 4.0,
  reviewCount: 25,
  deliveryTime: '15-20 min',
  unit: 'gramo',
  sellByWeight: true,
};

const mockLiterProduct: Product = {
  id: 'test-liter-product',
  name: 'Leche',
  price: 25,
  category: 'lacteos',
  image: '/test.jpg',
  description: 'Test product',
  inStock: true,
  stock: 50,
  tags: [],
  rating: 4.8,
  reviewCount: 200,
  deliveryTime: '15-20 min',
  unit: 'litro',
  sellByWeight: true,
};

describe('Weight Utils', () => {
  describe('isWeightBasedProduct', () => {
    it('should identify weight-based products correctly', () => {
      expect(isWeightBasedProduct(mockWeightProduct)).toBe(true);
      expect(isWeightBasedProduct(mockGramProduct)).toBe(true);
      expect(isWeightBasedProduct(mockLiterProduct)).toBe(true);
      expect(isWeightBasedProduct(mockPieceProduct)).toBe(false);
    });

    it('should handle sellByWeight flag', () => {
      const customProduct = { ...mockPieceProduct, sellByWeight: true };
      expect(isWeightBasedProduct(customProduct)).toBe(true);
    });
  });

  describe('getWeightCalculation', () => {
    it('should return correct calculation for kg products', () => {
      const calc = getWeightCalculation(mockWeightProduct);
      expect(calc.isWeightBased).toBe(true);
      expect(calc.minWeightStep).toBe(0.1);
      expect(calc.baseUnit).toBe('kg');
      expect(calc.displayUnit).toBe('kg');
    });

    it('should return correct calculation for gram products', () => {
      const calc = getWeightCalculation(mockGramProduct);
      expect(calc.isWeightBased).toBe(true);
      expect(calc.minWeightStep).toBe(100);
      expect(calc.baseUnit).toBe('gramo');
      expect(calc.displayUnit).toBe('g');
    });

    it('should return correct calculation for liter products', () => {
      const calc = getWeightCalculation(mockLiterProduct);
      expect(calc.isWeightBased).toBe(true);
      expect(calc.minWeightStep).toBe(0.1);
      expect(calc.baseUnit).toBe('litro');
    });

    it('should return correct calculation for piece products', () => {
      const calc = getWeightCalculation(mockPieceProduct);
      expect(calc.isWeightBased).toBe(false);
      expect(calc.minWeightStep).toBe(1);
    });
  });

  describe('formatWeight', () => {
    it('should format kg weights correctly', () => {
      expect(formatWeight(0.5, 'kg')).toBe('500g');
      expect(formatWeight(1, 'kg')).toBe('1kg');
      expect(formatWeight(1.5, 'kg')).toBe('1.5kg');
      expect(formatWeight(0.1, 'kg')).toBe('100g');
    });

    it('should format gram weights correctly', () => {
      expect(formatWeight(500, 'gramo')).toBe('500g');
      expect(formatWeight(1000, 'gramo')).toBe('1.0kg');
      expect(formatWeight(1500, 'gramo')).toBe('1.5kg');
      expect(formatWeight(100, 'g')).toBe('100g');
    });

    it('should format liter weights correctly', () => {
      expect(formatWeight(0.5, 'litro')).toBe('500ml');
      expect(formatWeight(1, 'litro')).toBe('1L');
      expect(formatWeight(1.5, 'litro')).toBe('1.5L');
      expect(formatWeight(0.25, 'litro')).toBe('250ml');
    });

    it('should handle other units', () => {
      expect(formatWeight(2, 'pieza')).toBe('2 pieza');
      expect(formatWeight(1, 'paquete')).toBe('1 paquete');
    });
  });

  describe('calculateWeightPrice', () => {
    it('should calculate price for weight-based products', () => {
      expect(calculateWeightPrice(45, 0.5, 'kg')).toBe(22.5);
      expect(calculateWeightPrice(45, 1, 'kg')).toBe(45);
      expect(calculateWeightPrice(45, 2, 'kg')).toBe(90);
    });

    it('should calculate price for gram products', () => {
      expect(calculateWeightPrice(2, 100, 'gramo')).toBe(200);
      expect(calculateWeightPrice(2, 500, 'gramo')).toBe(1000);
    });

    it('should calculate price for liter products', () => {
      expect(calculateWeightPrice(25, 0.5, 'litro')).toBe(12.5);
      expect(calculateWeightPrice(25, 2, 'litro')).toBe(50);
    });
  });

  describe('validateWeightQuantity', () => {
    it('should validate kg quantities correctly', () => {
      const validation1 = validateWeightQuantity(0.1, mockWeightProduct);
      expect(validation1.isValid).toBe(true);

      const validation2 = validateWeightQuantity(0.05, mockWeightProduct);
      expect(validation2.isValid).toBe(false);
      expect(validation2.adjustedQuantity).toBe(0.1);
      
      const validation3 = validateWeightQuantity(0.15, mockWeightProduct);
      expect(validation3.isValid).toBe(false);
      expect(validation3.adjustedQuantity).toBe(0.1);
    });

    it('should validate piece quantities correctly', () => {
      const validation1 = validateWeightQuantity(1, mockPieceProduct);
      expect(validation1.isValid).toBe(true);

      const validation2 = validateWeightQuantity(1.5, mockPieceProduct);
      expect(validation2.isValid).toBe(false);
      expect(validation2.adjustedQuantity).toBe(1);
    });

    it('should validate gram quantities correctly', () => {
      const validation1 = validateWeightQuantity(100, mockGramProduct);
      expect(validation1.isValid).toBe(true);

      const validation2 = validateWeightQuantity(50, mockGramProduct);
      expect(validation2.isValid).toBe(false);
      expect(validation2.adjustedQuantity).toBe(100);
    });
  });

  describe('getWeightQuantityOptions', () => {
    it('should generate correct options for kg products', () => {
      const options = getWeightQuantityOptions(mockWeightProduct);
      expect(options).toHaveLength(20);
      expect(options[0]).toEqual({ value: 0.1, label: '100g' });
      expect(options[1]).toEqual({ value: 0.2, label: '200g' });
      expect(options[9]).toEqual({ value: 1, label: '1kg' });
    });

    it('should generate correct options for piece products', () => {
      const options = getWeightQuantityOptions(mockPieceProduct);
      expect(options).toHaveLength(10);
      expect(options[0]).toEqual({ value: 1, label: '1 pieza' });
      expect(options[1]).toEqual({ value: 2, label: '2 piezas' });
    });

    it('should generate correct options for gram products', () => {
      const options = getWeightQuantityOptions(mockGramProduct);
      expect(options).toHaveLength(20);
      expect(options[0]).toEqual({ value: 100, label: '100g' });
      expect(options[9]).toEqual({ value: 1000, label: '1.0kg' });
    });
  });

  describe('convertWeight', () => {
    it('should convert between kg and grams', () => {
      expect(convertWeight(1, 'kg', 'gramo')).toBe(1000);
      expect(convertWeight(500, 'gramo', 'kg')).toBe(0.5);
    });

    it('should convert between liters and grams (assuming 1:1 ratio)', () => {
      expect(convertWeight(1, 'litro', 'gramo')).toBe(1000);
      expect(convertWeight(1000, 'gramo', 'litro')).toBe(1);
    });

    it('should return original value for unknown units', () => {
      expect(convertWeight(5, 'pieza', 'kg')).toBe(5);
      expect(convertWeight(10, 'unknown', 'kg')).toBe(10);
    });
  });

  describe('checkWeightStock', () => {
    it('should check stock correctly for weight products', () => {
      const check1 = checkWeightStock(mockWeightProduct, 5, 0);
      expect(check1.hasStock).toBe(true);
      expect(check1.availableQuantity).toBe(10);

      const check2 = checkWeightStock(mockWeightProduct, 15, 0);
      expect(check2.hasStock).toBe(false);
      expect(check2.availableQuantity).toBe(10);
      expect(check2.errorMessage).toContain('Stock insuficiente');
    });

    it('should consider current cart quantity', () => {
      const check1 = checkWeightStock(mockWeightProduct, 5, 3);
      expect(check1.hasStock).toBe(true);

      const check2 = checkWeightStock(mockWeightProduct, 8, 3);
      expect(check2.hasStock).toBe(false);
      expect(check2.availableQuantity).toBe(7); // 10 - 3
    });

    it('should handle out of stock products', () => {
      const outOfStockProduct = { ...mockWeightProduct, inStock: false };
      const check = checkWeightStock(outOfStockProduct, 1, 0);
      expect(check.hasStock).toBe(false);
      expect(check.errorMessage).toBe('Producto agotado');
    });

    it('should handle zero stock products', () => {
      const zeroStockProduct = { ...mockWeightProduct, stock: 0 };
      const check = checkWeightStock(zeroStockProduct, 1, 0);
      expect(check.hasStock).toBe(false);
      expect(check.availableQuantity).toBe(0);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle negative quantities', () => {
      const validation = validateWeightQuantity(-1, mockWeightProduct);
      expect(validation.isValid).toBe(false);
    });

    it('should handle zero quantities', () => {
      const validation = validateWeightQuantity(0, mockWeightProduct);
      expect(validation.isValid).toBe(false);
      expect(validation.adjustedQuantity).toBe(0.1);
    });

    it('should handle very large quantities', () => {
      // Large quantities should be limited by max weight (10kg from constants)
      const validation = validateWeightQuantity(1000, mockWeightProduct);
      expect(validation.isValid).toBe(false);
      expect(validation.adjustedQuantity).toBe(10); // Max weight from constants
    });

    it('should handle missing product properties', () => {
      const incompleteProduct = {
        ...mockWeightProduct,
        unit: undefined as any,
        sellByWeight: undefined as any,
      };
      
      const calc = getWeightCalculation(incompleteProduct);
      expect(calc.isWeightBased).toBe(false);
    });
  });

  describe('Performance and precision', () => {
    it('should handle floating point precision correctly', () => {
      const validation = validateWeightQuantity(0.1000000001, mockWeightProduct);
      expect(validation.isValid).toBe(true);
    });

    it('should format very small weights correctly', () => {
      expect(formatWeight(0.001, 'kg')).toBe('1g');
      expect(formatWeight(0.01, 'kg')).toBe('10g');
    });

    it('should calculate prices with proper precision', () => {
      const price = calculateWeightPrice(45.99, 0.1, 'kg');
      expect(price).toBeCloseTo(4.599, 3);
    });
  });
});
