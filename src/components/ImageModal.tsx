'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getProductImageUrl } from '@/lib/utils';

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  name: string;
};

export default function ImageModal({ isOpen, onClose, image, name }: ImageModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl aspect-square"
            onClick={onClose}
          >
            <Image
              src={getProductImageUrl(image)}
              alt={name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 