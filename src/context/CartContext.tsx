'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CartItem, CartContextType, DeliveryAddress, DeliverySlot, ContactInfo } from '@/types/cart';
import products from '@/data/products.json';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState<'atelier' | 'bureau' | 'domicile' | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const isInitialMount = useRef(true);

  // Calcul du total
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => {
      const product = products.products.find(p => p.id === item.id);
      const variant = product?.variants.find(v => v.id === item.variantId);
      return sum + (variant?.price || 0) * item.quantity;
    }, 0);
    setTotal(newTotal);
  }, [items]);

  // Sauvegarde dans le localStorage
  useEffect(() => {
    if (!isInitialMount.current) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  // Chargement depuis le localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedItems = JSON.parse(savedCart);
        setItems(parsedItems);
      } catch (error) {
        console.error('Erreur lors de la lecture du panier:', error);
      }
    }
    isInitialMount.current = false;
  }, []);

  const addToCart = (productId: string, variantId: string) => {
    const product = products.products.find(p => p.id === productId);
    const variant = product?.variants.find(v => v.id === variantId);
    
    if (!product || !variant) return;

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId && item.variantId === variantId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === productId && item.variantId === variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { 
        id: productId, 
        variantId, 
        quantity: 1,
        name: product.name,
        size: variant.size,
        price: variant.price
      }];
    });
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.id === productId && item.variantId === variantId
      );

      if (!existingItem) return currentItems;

      if (existingItem.quantity === 1) {
        return currentItems.filter(
          item => !(item.id === productId && item.variantId === variantId)
        );
      }

      return currentItems.map(item =>
        item.id === productId && item.variantId === variantId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const getProductQuantity = (productId: string, variantId: string) => {
    return items.find(
      item => item.id === productId && item.variantId === variantId
    )?.quantity || 0;
  };

  const clearCart = () => {
    setItems([]);
    setTotal(0);
    setDeliveryMethod(null);
    setDeliveryDate(null);
    setDeliveryAddress(null);
    setContactInfo(null);
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      total,
      addToCart, 
      removeFromCart, 
      getProductQuantity,
      clearCart,
      deliveryMethod,
      setDeliveryMethod,
      deliveryDate,
      setDeliveryDate,
      deliveryAddress,
      setDeliveryAddress,
      contactInfo,
      setContactInfo
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 