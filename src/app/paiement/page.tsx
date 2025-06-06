'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

// Vérification de la clé publique Stripe
if (!process.env.NEXT_PUBLIC_STRIPE_KEY) {
  console.error('La clé publique Stripe n\'est pas configurée');
}

// Initialisation de Stripe avec vérification
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
  : null;

export default function Paiement() {
  const router = useRouter();
  const { 
    items, 
    total, 
    deliveryMethod, 
    deliveryDate, 
    deliveryAddress,
    contactInfo,
    clearCart 
  } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentOptions = [
    {
      id: 'cash',
      title: 'Paiement en espèces',
      description: 'Vous paierez lors de la livraison'
    },
    {
      id: 'card',
      title: 'Paiement par carte',
      description: 'Paiement sécurisé par carte bancaire'
    }
  ];

  const handleValidate = async () => {
    if (!contactInfo) {
      toast.error('Veuillez d\'abord remplir vos informations de contact');
      router.push('/informations');
      return;
    }

    if (paymentMethod === 'cash') {
      try {
        setIsSubmitting(true);
        const response = await fetch('/api/submit-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cart: {
              items,
              total
            },
            contactInfo,
            deliveryOption: deliveryMethod,
            deliveryDate: deliveryDate?.toLocaleDateString('fr-FR'),
            deliveryAddress,
            paymentMethod: 'especes',
            total,
          }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la soumission de la commande');
        }

        clearCart();
        router.push('/commande-confirmee');
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Une erreur est survenue lors du traitement de votre commande.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      try {
        setIsSubmitting(true);
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cart: {
              items,
              total
            },
            contactInfo,
            deliveryOption: deliveryMethod,
            deliveryDate: deliveryDate?.toLocaleDateString('fr-FR'),
            deliveryAddress,
          }),
        });

        const { sessionId } = await response.json();
        
        if (!sessionId) {
          throw new Error('Erreur lors de la création de la session de paiement');
        }

        // Redirection vers la page de paiement Stripe
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            throw error;
          }
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Une erreur est survenue lors de l\'initialisation du paiement.');
        setPaymentMethod('cash');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen bg-gray-50"
    >
      <Header title="Comment règles-tu ?" />
      <div className="max-w-3xl mx-auto px-4 py-12 pb-32">
        <div className="space-y-6">
          {paymentOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod(option.id)}
              className={`p-6 bg-white rounded-lg shadow-lg cursor-pointer border-2 transition-colors ${
                paymentMethod === option.id ? 'border-purple-500' : 'border-transparent'
              }`}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{option.title}</h3>
                <p className="text-gray-600 mt-1">{option.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bouton sticky en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleValidate}
            disabled={isSubmitting}
            className={`w-full gradient-button px-8 py-3 rounded-lg ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Traitement en cours...' : 'Valider le paiement'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
} 