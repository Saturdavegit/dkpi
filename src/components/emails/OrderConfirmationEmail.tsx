'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function OrderConfirmationEmail() {
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

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-700 text-lg mb-2"
      >
        Tu vas recevoir un mail de confirmation dans ta boîte mail
      </motion.p>

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