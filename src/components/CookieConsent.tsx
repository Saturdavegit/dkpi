'use client';

import CookieConsent from 'react-cookie-consent';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CookieConsentBanner() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait son choix
    const consent = document.cookie
      .split('; ')
      .find(row => row.startsWith('cookie-consent='))
      ?.split('=')[1];
    
    if (consent === 'accepted') {
      setHasConsent(true);
    }
  }, []);

  const handleAccept = () => {
    // Sauvegarder le consentement pour Stripe
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `cookie-consent=accepted; expires=${expiryDate.toUTCString()}; path=/`;
    setHasConsent(true);
  };

  const handleDecline = () => {
    // Sauvegarder le refus
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `cookie-consent=declined; expires=${expiryDate.toUTCString()}; path=/`;
    // Ne pas cacher la bannière si l'utilisateur refuse
    setHasConsent(false);
  };

  // Ne pas afficher la bannière si l'utilisateur a accepté
  if (hasConsent) {
    return null;
  }

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accepter"
      declineButtonText="Refuser"
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      style={{ 
        background: '#2B373B',
        padding: '1rem',
        alignItems: 'center'
      }}
      buttonStyle={{
        background: '#4CAF50',
        color: 'white',
        fontSize: '13px',
        padding: '10px 20px',
        borderRadius: '4px',
        margin: '0 10px'
      }}
      declineButtonStyle={{
        background: '#f44336',
        color: 'white',
        fontSize: '13px',
        padding: '10px 20px',
        borderRadius: '4px'
      }}
    >
      Salut&nbsp;! 👋 J&apos;utilise des cookies essentiels et des cookies tiers pour le traitement des paiements par carte.&nbsp;
      Si tu les refuses, le paiement CB ne sera pas disponible.&nbsp;
      Pour plus d&apos;infos, jette un œil à ma{' '}
      <Link href="/privacy-policy" className="text-blue-400 hover:text-blue-300">
        politique de confidentialité
      </Link>.
    </CookieConsent>
  );
} 