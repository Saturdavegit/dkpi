import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';

// Assurez-vous que c'est votre clé publique Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentFormContent = ({ clientSecret, onSuccess, onError }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Une erreur est survenue lors du paiement.');
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      onError('Une erreur inattendue est survenue.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <PaymentElement />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Traitement en cours...
          </div>
        ) : 'Payer maintenant'}
      </motion.button>
    </form>
  );
};

export const PaymentForm = ({ clientSecret, onSuccess, onError }: PaymentFormProps) => {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormContent
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}; 