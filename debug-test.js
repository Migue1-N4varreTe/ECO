// Debug test to understand the gram validation issue
import { validateWeightQuantity, getWeightCalculation } from './src/lib/weight-utils.ts';

const mockGramProduct = {
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

console.log('Product:', mockGramProduct);
console.log('Calculation:', getWeightCalculation(mockGramProduct));
console.log('Validation for 100g:', validateWeightQuantity(100, mockGramProduct));
console.log('Validation for 50g:', validateWeightQuantity(50, mockGramProduct));
