'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';

export default function ValidationPanier() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();

  const handleContinue = () => {
    router.push('/livraison');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen bg-gray-50"
    >
      <Header title="Ton panier" />
      <div className="max-w-3xl mx-auto px-4 py-12 pb-32">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.size}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{item.price.toFixed(2)}€</div>
                  <div className="text-sm text-gray-500">Quantité: {item.quantity}</div>
                </div>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <div className="font-medium text-gray-900">Total</div>
                <div className="font-medium text-gray-900">{total.toFixed(2)}€</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton sticky en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            className="w-full gradient-button px-8 py-3 rounded-lg"
          >
            Continuer
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
} 