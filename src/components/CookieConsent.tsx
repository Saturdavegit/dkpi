'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait son choix
    const consent = document.cookie
      .split('; ')
      .find(row => row.startsWith('cookie-consent='))
      ?.split('=')[1];
    
    // N'afficher la bannière que si aucun choix n'a été fait
    if (!consent) {
      setIsVisible(true);
    }

    // Écouter les changements de cookie
    const handleCookieChange = () => {
      const newConsent = document.cookie
        .split('; ')
        .find(row => row.startsWith('cookie-consent='))
        ?.split('=')[1];
      
      if (!newConsent) {
        setIsVisible(true);
      }
    };

    // Ajouter l'écouteur d'événements
    window.addEventListener('cookieConsentChanged', handleCookieChange);

    // Nettoyer l'écouteur
    return () => {
      window.removeEventListener('cookieConsentChanged', handleCookieChange);
    };
  }, []);

  const handleAccept = () => {
    // Sauvegarder le consentement pour Stripe
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `cookie-consent=accepted; expires=${expiryDate.toUTCString()}; path=/`;
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Sauvegarder le refus
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `cookie-consent=declined; expires=${expiryDate.toUTCString()}; path=/`;
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6"
        >
          <div className="w-[90%] sm:w-[80%] max-w-4xl bg-emerald-50 rounded-2xl shadow-xl border border-emerald-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-bold text-emerald-900 mb-2">
                  🍪 Cookies
                </h3>
                <p className="text-emerald-800 text-sm md:text-base">
                  Salut&nbsp;! 👋 J&apos;utilise des cookies essentiels et des cookies tiers pour le traitement des paiements par carte.&nbsp;
                  Si tu les refuses, le paiement CB ne sera pas disponible.&nbsp;
                  Pour plus d&apos;infos, jette un œil à ma{' '}
                  <Link href="/privacy-policy" className="text-emerald-600 hover:text-emerald-700 underline">
                    politique de confidentialité
                  </Link>.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleDecline}
                  className="w-full sm:w-auto px-6 py-2.5 bg-white text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-colors border border-emerald-200"
                >
                  Refuser
                </button>
                <button
                  onClick={handleAccept}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Accepter
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 