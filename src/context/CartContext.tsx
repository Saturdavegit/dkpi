import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartContextType, CartItem } from '../types/cart';

const MAX_QUANTITY_PER_ITEM = 3;
const INITIAL_CART: Cart = { items: [], total: 0 };

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(INITIAL_CART);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialisation du panier depuis le localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsInitialized(true);
  }, []);

  // Sauvegarde du panier dans le localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const isMaxQuantityReached = (productId: string, size: string): boolean => {
    const existingItem = cart.items.find(
      item => item.productId === productId && item.size === size
    );
    return existingItem ? existingItem.quantity >= MAX_QUANTITY_PER_ITEM : false;
  };

  const addToCart = (product: any, size: string, quantity: number) => {
    setCart(currentCart => {
      const existingItemIndex = currentCart.items.findIndex(
        item => item.productId === product.id && item.size === size
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        newItems = [...currentCart.items];
        const newQuantity = Math.min(
          newItems[existingItemIndex].quantity + quantity,
          MAX_QUANTITY_PER_ITEM
        );
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQuantity
        };
      } else {
        const variant = product.variants.find((v: any) => v.size === size);
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          size: size,
          price: variant.price,
          quantity: Math.min(quantity, MAX_QUANTITY_PER_ITEM),
          image: product.image
        };
        newItems = [...currentCart.items, newItem];
      }

      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(currentCart => {
      const newItems = currentCart.items.filter(
        item => !(item.productId === productId && item.size === size)
      );
      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    });
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity > MAX_QUANTITY_PER_ITEM) return;
    
    setCart(currentCart => {
      const newItems = currentCart.items.map(item => {
        if (item.productId === productId && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      });
      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    });
  };

  const clearCart = () => {
    setCart(INITIAL_CART);
  };

  // Ne pas rendre le contenu tant que l'initialisation n'est pas terminée
  if (!isInitialized) {
    return null;
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isMaxQuantityReached
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 