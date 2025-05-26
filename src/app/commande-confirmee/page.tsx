'use client';

import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CommandeConfirmee() {
  const { clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Vider le panier après la confirmation
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Commande confirmée !
        </h1>
        <p className="text-gray-700 mb-6">
          Merci pour votre commande. Vous recevrez bientôt un email de confirmation
          avec tous les détails.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Retourner à la boutique
        </button>
      </div>
    </div>
  );
} 