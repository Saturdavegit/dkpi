'use client';

import { CartProvider } from '@/context/CartContext';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster
        containerStyle={{
          top: 20,
          left: 20,
          bottom: 20,
          right: 20,
          zIndex: 9999,
        }}
        toastOptions={{
          className: '!z-50',
          style: {
            zIndex: 50,
            background: '#fff',
            color: '#000',
            padding: '16px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          duration: 2000,
          position: 'top-center',
          id: 'toast',
        }}
        gutter={8}
      />
    </CartProvider>
  );
} 