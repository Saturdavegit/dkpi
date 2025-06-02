import React from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/cart';
import { useRouter } from 'next/navigation';
import { getProductImageUrl } from '@/lib/utils';

export const Cart: React.FC = () => {
  const { items, total, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-700">Votre panier est vide</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Votre Panier</h2>
      <div className="space-y-6">
        {items.map((item: CartItem) => (
          <div key={`${item.id}-${item.size}`} className="flex items-center border-b border-gray-200 pb-6">
            <div className="relative w-24 h-24 mr-6">
              <Image
                src={getProductImageUrl(item.image)}
                alt={item.name}
                fill
                className="object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-gray-700 mb-2">{item.size}</p>
              <p className="text-gray-900 font-medium mb-3">{item.price.toFixed(2)}€</p>
              <div className="flex items-center">
                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                  <button
                    onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-l-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-medium border-x border-gray-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, Math.min(3, item.quantity + 1))}
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-r-lg transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                    disabled={item.quantity >= 3}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end ml-6">
              <p className="font-semibold text-gray-900 mb-3">{(item.price * item.quantity).toFixed(2)}€</p>
              <button
                onClick={() => removeItem(item.id, item.size)}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <span className="text-xl font-bold text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">{total.toFixed(2)}€</span>
        </div>
        <div className="mt-6">
          <button
            onClick={() => router.push('/validation-panier')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
          >
            Valider mon panier
          </button>
        </div>
      </div>
    </div>
  );
}; 