import { allProducts, categories } from "./data";

// Validación de categorías basada en los conteos declarados en categories[].productCount
export const validateProductCategories = () => {
  const categoryIds = categories.map((cat) => cat.id);
  const declaredCounts: Record<string, number> = Object.fromEntries(
    categories.map((c) => [c.id, Number(c.productCount || 0)])
  );

  const categoryCounts: Record<string, number> = {};
  const invalidProducts: string[] = [];

  // Contar productos por categoría y encontrar categorías inválidas
  allProducts.forEach((product) => {
    if (!categoryIds.includes(product.category)) {
      invalidProducts.push(
        `${product.id}: categoría "${product.category}" no existe`,
      );
    } else {
      categoryCounts[product.category] =
        (categoryCounts[product.category] || 0) + 1;
    }
  });

  // Comparar con los conteos declarados en categories
  const countDiscrepancies: string[] = [];
  Object.entries(declaredCounts).forEach(([categoryId, expectedCount]) => {
    const actualCount = categoryCounts[categoryId] || 0;
    if (expectedCount && actualCount !== expectedCount) {
      countDiscrepancies.push(
        `${categoryId}: declarado ${expectedCount}, actual ${actualCount}`,
      );
    }
  });

  return {
    invalidProducts,
    countDiscrepancies,
    categoryCounts,
    declaredCounts,
    totalProducts: allProducts.length,
    isValid: invalidProducts.length === 0 && countDiscrepancies.length === 0,
  };
};

// Verificación simple de imágenes (placeholder/default vacías)
export const validateProductImages = () => {
  const productsWithPotentiallyBrokenImages: string[] = [];

  allProducts.forEach((product) => {
    if (
      !product.image ||
      product.image.includes("placeholder") ||
      product.image.includes("default") ||
      product.image === ""
    ) {
      productsWithPotentiallyBrokenImages.push(
        `${product.id}: imagen potencialmente problemática - ${product.image}`,
      );
    }
  });

  return {
    productsWithPotentiallyBrokenImages,
    totalChecked: allProducts.length,
  };
};

// Función principal de validación (para usar en consola o tests)
export const runFullValidation = () => {
  const categoryValidation = validateProductCategories();
  const imageValidation = validateProductImages();

  return {
    categoryValidation,
    imageValidation,
    overallValid:
      categoryValidation.isValid &&
      imageValidation.productsWithPotentiallyBrokenImages.length === 0,
  };
};

export default runFullValidation;
