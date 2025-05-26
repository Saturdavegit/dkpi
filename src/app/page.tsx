'use client';

import { Product } from '@/types';
import products from '@/data/products.json';
import { ProductCard } from '@/components/ProductCard';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Du kéfir pour Inès</h1>
              <p className="mt-2 text-gray-600">Des kéfirs artisanaux préparés avec amour par Claire</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
