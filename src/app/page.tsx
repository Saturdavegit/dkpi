'use client';

import { ProductCard } from '@/components/ProductCard';
import products from '@/data/products.json';
import { motion } from 'framer-motion';
import CartButton from '@/components/CartButton';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      {/* Bouton panier sticky */}
      <div className="fixed bottom-6 right-6 z-50">
        <CartButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvres mes kéfirs fait maison, préparés avec passion et des ingrédients de qualité.
            Une boisson vivante, pleine de bienfaits et PAS que pour Inès !
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
