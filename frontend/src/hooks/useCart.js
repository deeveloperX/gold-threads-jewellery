import { useEffect, useState } from 'react';
import { PRODUCTS } from '../data/products';

const CART_STORAGE_KEY = 'gold-threads-cart';

function readCart() {
  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) return [];

    const parsedCart = JSON.parse(storedCart);
    if (!Array.isArray(parsedCart)) {
      console.error('Saved shopping bag data is invalid and was ignored.');
      return [];
    }

    return parsedCart.flatMap((entry) => {
      if (!entry || !Number.isInteger(entry.productId) || !Number.isInteger(entry.quantity) || entry.quantity < 1) {
        return [];
      }

      const product = PRODUCTS.find((item) => item.id === entry.productId);
      return product ? [{ ...product, quantity: entry.quantity }] : [];
    });
  } catch (error) {
    console.error('Unable to load the shopping bag from localStorage.', error);
    return [];
  }
}

export default function useCart() {
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    try {
      const savedCart = cart.map(({ id, quantity }) => ({
        productId: id,
        quantity,
      }));
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(savedCart));
    } catch (error) {
      console.error('Unable to save the shopping bag to localStorage.', error);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) => (
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((currentCart) => currentCart.flatMap((item) => {
      if (item.id !== id) return [item];
      const quantity = item.quantity + delta;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  };

  const removeFromCart = (id) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return { cart, itemCount, addToCart, updateQuantity, removeFromCart };
}
