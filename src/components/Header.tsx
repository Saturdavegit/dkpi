'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useHeader } from '@/context/HeaderContext';

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { temporaryMessage } = useHeader();

  const handleClick = () => {
    if (pathname === '/livraison') {
      router.push('/validation-panier');
    } else if (pathname === '/informations') {
      router.push('/livraison');
    } else if (pathname === '/paiement') {
      router.push('/informations');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="sticky top-0 z-40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClick}
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-full shadow-lg cursor-pointer"
        >
          <div className="relative bg-black/10 backdrop-blur-sm rounded-full">
            <div className="px-6 py-3">
              <AnimatePresence mode="wait">
                {temporaryMessage ? (
                  <motion.h1
                    key="temporary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xl sm:text-2xl font-bold text-white text-center drop-shadow-lg"
                  >
                    {temporaryMessage}
                  </motion.h1>
                ) : (
                  <motion.h1
                    key="default"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xl sm:text-2xl font-bold text-white text-center drop-shadow-lg"
                  >
                    {title || 'Du kéfir pour Inès(By Claire)'}
                  </motion.h1>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 