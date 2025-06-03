'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Order } from '@/types/cart';

interface OrderConfirmationEmailProps {
  order: Order;
}

export function OrderConfirmationEmail({ order }: OrderConfirmationEmailProps) {
  const router = useRouter();

  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
      >
        Super, ta commande est validée&nbsp;! 🎉
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-50 p-6 rounded-lg mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Détails de ta commande</h2>
        <div className="space-y-2">
          <p><strong>Mode de retrait :</strong> {
            order.deliveryOption === 'atelier' ? 'Retrait à l\'atelier' :
            order.deliveryOption === 'bureau' ? 'Retrait au bureau de Levallois' :
            'Livraison à domicile'
          }</p>
          <p><strong>Date souhaitée :</strong> {order.deliveryDate}</p>
          {order.deliveryOption === 'domicile' && order.deliveryAddress && (
            <>
              <p><strong>Adresse :</strong> {order.deliveryAddress.address}</p>
              <p><strong>Ville :</strong> {order.deliveryAddress.city}</p>
              <p><strong>Code postal :</strong> {order.deliveryAddress.zipCode}</p>
            </>
          )}
          <p><strong>Mode de paiement :</strong> {
            order.paymentMethod === 'carte' ? 'Carte bancaire' : 'Espèces'
          }</p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-700 text-lg mb-8"
      >
        Merci d&apos;avoir commandé chez moi ! 🌱
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push('/')}
        className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-lg
          transition-all duration-200 transform hover:bg-blue-800 hover:shadow-xl"
      >
        Retour au catalogue
      </motion.button>
    </>
  );
} 