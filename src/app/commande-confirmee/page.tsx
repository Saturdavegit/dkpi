'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CommandeConfirmee() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-white shadow-lg rounded-lg overflow-hidden border-2 border-gray-200"
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
            >
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
            >
              Commande validée&nbsp;!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-700 text-lg mb-2"
            >
              Vous allez recevoir un mail de confirmation
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-700 text-lg mb-8"
            >
              Merci d&apos;avoir commandé chez nous, gros bolos
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
          </div>
        </div>
      </motion.div>
    </div>
  );
}
