import { Stripe } from 'stripe';
import { toast } from 'react-hot-toast';
import { StripeError } from '@stripe/stripe-js';

export const handleStripeError = (error: Error | StripeError) => {
  console.error('Erreur Stripe:', error);

  if (error instanceof Stripe.errors.StripeCardError) {
    toast.error(`Erreur de carte : ${error.message}`);
  } else if (error instanceof Stripe.errors.StripeInvalidRequestError) {
    toast.error(`Erreur de validation : ${error.message}`);
  } else if (error instanceof Stripe.errors.StripeAPIError) {
    toast.error('Erreur de communication avec Stripe. Veuillez réessayer.');
  } else if (error instanceof Stripe.errors.StripeRateLimitError) {
    toast.error('Trop de tentatives. Veuillez réessayer dans quelques instants.');
  } else {
    toast.error('Une erreur est survenue lors du paiement');
  }
};

export const getRedirectUrl = (type: 'success' | 'cancel') => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
    (typeof window !== 'undefined' ? window.location.origin : '');
  return `${baseUrl}/${type === 'success' ? 'commande-confirmee' : 'livraison-paiement'}`;
};

export const formatStripeAmount = (amount: number): number => {
  return Math.round(amount * 100); // Conversion en centimes
}; 