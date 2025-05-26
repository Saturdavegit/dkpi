'use client';

import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import products from '@/data/products.json';
import OrderForm from '../components/OrderForm';
import Link from 'next/link';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const selectedSize = searchParams.get('size');

  const product = products.products.find((p: Product) => p.id === productId);

  if (!product || !selectedSize) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
        <Link
          href="/"
          className="text-indigo-600 hover:text-indigo-500"
        >
          Retourner à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Finaliser votre commande</h1>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Récapitulatif de la commande</h2>
              <div className="mt-4">
                <p className="text-sm text-gray-600">{product.name}</p>
                <p className="text-sm text-gray-600">Format : {selectedSize}</p>
                <p className="text-sm text-gray-600">Prix unitaire : {product.variants.find(v => v.size === selectedSize)?.price.toFixed(2)} €</p>
              </div>
            </div>
          </div>
          <OrderForm product={product} selectedSize={selectedSize} />
        </div>
      </div>
    </div>
  );
} 