'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';

export default function CommandeConfirmee() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full mt-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Commande confirmée !
          </h1>

          <p className="text-gray-600 mb-8">
            Merci pour ta commande. Tu vas recevoir un email de confirmation avec tous les détails.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg
              transition-all duration-200 transform hover:bg-blue-600 hover:shadow-xl active:scale-95"
          >
            Retour sur la page produits
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
