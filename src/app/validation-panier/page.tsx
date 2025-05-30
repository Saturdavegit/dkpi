'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import ScrollIndicator from '@/components/ScrollIndicator';

export default function ValidationPanier() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const router = useRouter();

  const handleQuantityUpdate = (itemId: string, size: string, newQuantity: number) => {
    const oldQuantity = items.find(item => item.id === itemId && item.size === size)?.quantity || 0;
    updateQuantity(itemId, size, newQuantity);
    
    if (newQuantity > oldQuantity) {
      toast.success('Quantité mise à jour', {
        duration: 2000,
        position: 'top-center',
        className: '!bg-blue-600 !text-white !z-50',
        style: {
          padding: '16px',
          borderRadius: '10px',
          background: '#2563eb',
          color: '#fff',
          zIndex: 50,
        },
      });
    }
  };

  const handleRemoveFromCart = (itemId: string, size: string) => {
    removeItem(itemId, size);
    toast.error('Produit supprimé', {
      duration: 2000,
      position: 'top-center',
      className: '!bg-red-600 !text-white !z-50',
      style: {
        padding: '16px',
        borderRadius: '10px',
        background: '#dc2626',
        color: '#fff',
        zIndex: 50,
      },
    });
  };

  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            Retourner à la boutique
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24 sm:pb-12">
      <ScrollIndicator />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="py-8 sm:py-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="text-blue-700 hover:text-blue-800 font-medium flex items-center text-sm sm:text-base mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Retour aux produits</span>
            <span className="sm:hidden">Retour</span>
          </motion.button>

          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8"
          >
            Validation de votre commande
          </motion.h1>

          {/* Récapitulatif du panier */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border-2 border-gray-200"
          >
            <div className="p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Récapitulatif de votre panier</h2>
              <AnimatePresence>
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center py-4 border-b-2 border-gray-100 group"
                    >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 mr-3 sm:mr-4 flex-shrink-0 overflow-hidden rounded-lg border-2 border-gray-200">
                        <Image
                          src={`https://kefirpourines.s3.eu-north-1.amazonaws.com/public/img/${item.image}`}
                          alt={item.name}
                          fill
                          className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
                        <p className="text-gray-700 text-sm font-medium">{item.size}</p>
                        <div className="flex items-center mt-2">
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center bg-gray-50 rounded-lg border-2 border-gray-200 shadow-sm"
                          >
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleQuantityUpdate(item.id, item.size, Math.max(1, item.quantity - 1))}
                              className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-l-lg transition-colors duration-200 font-medium"
                            >
                              -
                            </motion.button>
                            <span className="px-3 text-gray-900 text-sm sm:text-base font-medium">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleQuantityUpdate(item.id, item.size, Math.min(3, item.quantity + 1))}
                              className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-r-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity >= 3}
                            >
                              +
                            </motion.button>
                          </motion.div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRemoveFromCart(item.id, item.size)}
                            className="ml-3 text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                          >
                            Supprimer
                          </motion.button>
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <motion.p 
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.1, 1] }}
                          className="font-semibold text-gray-900 text-sm sm:text-base whitespace-nowrap"
                        >
                          {(item.price * item.quantity).toFixed(2)}€
                        </motion.p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-between items-center pt-6 border-t-2 border-gray-100 mt-6"
              >
                <span className="text-lg font-bold text-gray-900">Total</span>
                <motion.span
                  key={total}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  className="text-lg font-bold text-gray-900"
                >
                  {total.toFixed(2)}€
                </motion.span>
              </motion.div>
            </div>
          </motion.div>

          {/* Bouton de validation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/livraison-paiement')}
              className="w-full sm:w-auto px-12 py-4 bg-blue-700 text-white font-semibold rounded-lg shadow-lg
                transition-all duration-200 transform hover:bg-blue-800 hover:shadow-xl active:scale-95"
            >
              Continuer vers la livraison
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

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
        }}
      />
    </div>
  );
} 