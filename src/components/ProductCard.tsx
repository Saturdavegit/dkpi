'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getProductImageUrl } from '@/lib/utils';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import ImageModal from './ImageModal';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, removeFromCart, getProductQuantity } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-square cursor-pointer group" onClick={() => setIsModalOpen(true)}>
        <Image
          src={getProductImageUrl(product.image)}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

        <div className="space-y-4">
          {product.variants.map((variant) => {
            const quantity = getProductQuantity(product.id, variant.id);
            return (
              <div key={variant.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {variant.size} - <span className="text-blue-600">{variant.price.toFixed(2)} €</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeFromCart(product.id, variant.id)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors duration-200 font-medium disabled:opacity-30"
                      disabled={quantity === 0}
                    >
                      -
                    </motion.button>
                    <span className="px-3 text-gray-700 text-sm font-medium min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(product.id, variant.id)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors duration-200 font-medium disabled:opacity-30"
                      disabled={quantity >= 3}
                    >
                      +
                    </motion.button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        image={product.image}
        name={product.name}
      />
    </div>
  );
} 