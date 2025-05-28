import { useEffect, useState } from 'react';

export function useStripeConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = document.cookie
      .split('; ')
      .find(row => row.startsWith('cookie-consent='))
      ?.split('=')[1];
    
    setHasConsent(consent === 'accepted');
  }, []);

  return hasConsent;
} 