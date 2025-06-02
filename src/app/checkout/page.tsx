'use client';

import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import products from '@/data/products.json';
import OrderForm from '../components/OrderForm';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Suspense } from 'react';
import { getProductImageUrl } from '@/lib/utils';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('product') ?? '';
  const selectedSize = searchParams?.get('size') ?? '';

  const product = products.products.find((p: Product) => p.id === productId);
  const variant = product?.variants.find(v => v.size === selectedSize);

  if (!product || !variant) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Produit non trouvé
          </h1>
          <p className="text-gray-600 mb-6">
            Le produit que vous recherchez n&apos;est pas disponible.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200"
          >
            Retourner au catalogue
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Finaliser votre commande
            </h1>
            <Link
              href="/"
              className="text-blue-700 hover:text-blue-800 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Retour au catalogue</span>
              <span className="sm:hidden">Retour</span>
            </Link>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden border-2 border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Récapitulatif de la commande
              </h2>
              <div className="flex items-start space-x-6">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200">
                  <Image
                    src={getProductImageUrl(product.image)}
                    alt={product.name}
                    fill
                    className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-700">
                      Format : <span className="font-medium">{selectedSize}</span>
                    </p>
                    <p className="text-gray-700">
                      Prix unitaire : <span className="font-medium">{variant.price.toFixed(2)} €</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <OrderForm product={product} selectedSize={selectedSize} />
        </motion.div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
