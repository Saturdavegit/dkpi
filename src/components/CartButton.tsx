'use client';

import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/HeaderContext';

export default function CartButton() {
  const { items } = useCart();
  const router = useRouter();
  const { showTemporaryMessage } = useHeader();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleClick = () => {
    if (itemCount === 0) {
      showTemporaryMessage('Ton panier est vide :(');
      return;
    }
    router.push('/validation-panier');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="gradient-button rounded-full p-4 flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {itemCount > 0 && (
        <span className="bg-white text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          {itemCount}
        </span>
      )}
    </motion.button>
  );
} 