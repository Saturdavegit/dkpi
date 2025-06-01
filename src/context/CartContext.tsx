'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CartContextType } from '@/types/cart';

const MAX_QUANTITY_PER_ITEM = 3;
const INITIAL_CART: CartItem[] = [];

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [total, setTotal] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialisation du panier depuis le localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        } else {
          setItems(INITIAL_CART);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du panier:', error);
      setItems(INITIAL_CART);
    }
    setIsInitialized(true);
  }, []);

  // Sauvegarde du panier dans le localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('cart', JSON.stringify(items));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier:', error);
      }
    }
  }, [items, isInitialized]);

  useEffect(() => {
    // Calcul du total
    const newTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [items]);


  const isMaxQuantityReached = (productId: string, size: string): boolean => {
    const existingItem = items.find(
      item => item.id === productId && item.size === size
    );
    return existingItem ? existingItem.quantity >= MAX_QUANTITY_PER_ITEM : false;
  };

  const addItem = (item: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => 
        i.id === item.id && i.size === item.size
      );

      if (existingItem) {
        return currentItems.map(i =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, MAX_QUANTITY_PER_ITEM) }
            : i
        );
      }

      return [...currentItems, { ...item, quantity: Math.min(item.quantity, MAX_QUANTITY_PER_ITEM) }];
    });
  };

  const removeItem = (itemId: string, size: string) => {
    setItems(currentItems => 
      currentItems.filter(i => !(i.id === itemId && i.size === size))
    );
  };

  const updateQuantity = (itemId: string, size: string, quantity: number) => {
    if (quantity > MAX_QUANTITY_PER_ITEM) return;
    
    setItems(currentItems =>
      currentItems.map(i =>
        i.id === itemId && i.size === size
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems(INITIAL_CART);
  };

  const value = {
    items: items || INITIAL_CART,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isMaxQuantityReached
  };

  return (
    <CartContext.Provider value={value}>
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