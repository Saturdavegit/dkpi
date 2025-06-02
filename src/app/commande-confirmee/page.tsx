'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmationEmail';

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

            <OrderConfirmationEmail />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
