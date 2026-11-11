import { PRODUCTS } from '../data/products';

export const initialProducts = PRODUCTS.map((product) => ({
  ...product,
  isActive: true,
}));

export const initialCategories = [...new Set(PRODUCTS.map((product) => product.category))].map(
  (name, index) => {
    const product = PRODUCTS.find((item) => item.category === name);
    return {
      id: `category-${index + 1}`,
      name,
      slug: name.toLowerCase().replaceAll(' ', '-'),
      imagePath: product.image,
      showPopular: index < 3,
      isActive: true,
      displayOrder: index + 1,
    };
  },
);

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(price);
