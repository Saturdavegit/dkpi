'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { ContactInfo, DeliveryAddress, DeliverySlot } from '@/types/cart';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale';
import { addDays } from 'date-fns';
import ScrollIndicator from '@/components/ScrollIndicator';
import { PaymentForm } from '@/components/PaymentForm';
import { handleStripeError, formatStripeAmount } from '@/lib/stripe-utils';

registerLocale('fr', fr);

// Vérification de la clé publique Stripe
if (!process.env.NEXT_PUBLIC_STRIPE_KEY) {
  console.error('La clé publique Stripe n\'est pas configurée');
}

type DeliveryOption = 'atelier' | 'bureau' | 'domicile';
type PaymentMethod = 'carte' | 'especes';

const DELIVERY_FEE = 10;
const TIME_SLOTS = ['10h-12h', '14h-16h', '16h-18h'] as const;

// Constantes pour les messages d'erreur
const ERROR_MESSAGES = {
  CONTACT_FIELDS: 'Remplis bien tous les champs de contact',
  INVALID_EMAIL: 'Ton adresse email est invalide',
  INCOMPLETE_ADDRESS: 'Ton adresse est incomplète',
  MISSING_DELIVERY_SLOT: 'Il faut que tu sélectionnes un créneau de livraison',
  ORDER_VALIDATION: 'Impossible de valider ta commande, vérifie tes infos',
  GENERIC_ERROR: 'Oups ! Une erreur est survenue, réessaie dans quelques instants',
  PAYMENT_FAILED: 'Le paiement a échoué, vérifie les infos de ta carte'
} as const;

// Constantes pour les options de livraison
const DELIVERY_OPTIONS = {
  ATELIER: 'atelier',
  BUREAU: 'bureau',
  DOMICILE: 'domicile'
} as const;

// Constantes pour les modes de paiement
const PAYMENT_METHODS = {
  ESPECES: 'especes',
  CARTE: 'carte'
} as const;

export default function LivraisonPaiement() {
  const { items, total: cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>(DELIVERY_OPTIONS.ATELIER);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS.ESPECES);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    address: '',
    city: '',
    zipCode: ''
  });
  const [deliverySlot, setDeliverySlot] = useState<DeliverySlot>({
    date: addDays(new Date(), 4),
    timeSlot: TIME_SLOTS[0]
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const total = deliveryOption === DELIVERY_OPTIONS.DOMICILE ? cartTotal + DELIVERY_FEE : cartTotal;

  const minDate = addDays(new Date(), 4);
  const maxDate = addDays(new Date(), 30);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total: formatStripeAmount(total),
          metadata: {
            deliveryOption,
            customerName: `${contactInfo.firstName} ${contactInfo.lastName}`,
            customerEmail: contactInfo.email,
            customerPhone: contactInfo.phone,
            deliveryAddress: deliveryOption === DELIVERY_OPTIONS.DOMICILE ? JSON.stringify(deliveryAddress) : '',
            deliverySlot: deliveryOption === DELIVERY_OPTIONS.DOMICILE ? JSON.stringify(deliverySlot) : '',
          },
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setClientSecret(data.clientSecret);
    } catch (error) {
      handleStripeError(error as Error);
      // En cas d'erreur, revenir au paiement en espèces
      setPaymentMethod(PAYMENT_METHODS.ESPECES);
    }
  };

  const validateContactInfo = () => {
    if (!contactInfo.firstName.trim() || !contactInfo.lastName.trim() || 
        !contactInfo.email.trim() || !contactInfo.phone.trim()) {
      toast.error(ERROR_MESSAGES.CONTACT_FIELDS);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      toast.error(ERROR_MESSAGES.INVALID_EMAIL);
      return false;
    }

    return true;
  };

  const validateDeliveryInfo = () => {
    if (deliveryOption === DELIVERY_OPTIONS.DOMICILE) {
      if (!deliveryAddress.address.trim() || !deliveryAddress.city.trim() || !deliveryAddress.zipCode.trim()) {
        toast.error(ERROR_MESSAGES.INCOMPLETE_ADDRESS);
        return false;
      }

      if (!deliverySlot.date || !deliverySlot.timeSlot) {
        toast.error(ERROR_MESSAGES.MISSING_DELIVERY_SLOT);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateContactInfo() || !validateDeliveryInfo()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod === PAYMENT_METHODS.CARTE) {
        await createPaymentIntent();
      } else {
        const response = await fetch('/api/submit-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cart: {
              items,
              total: cartTotal
            },
            contactInfo,
            deliveryOption,
            deliveryAddress: deliveryOption === DELIVERY_OPTIONS.DOMICILE ? deliveryAddress : null,
            deliverySlot: deliveryOption === DELIVERY_OPTIONS.DOMICILE ? deliverySlot : null,
            paymentMethod,
            total,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || ERROR_MESSAGES.ORDER_VALIDATION);
        }

        clearCart();
        router.push('/commande-confirmee');
      }
    } catch (error) {
      console.error('Erreur:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(ERROR_MESSAGES.GENERIC_ERROR);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    router.push('/commande-confirmee');
  };

  const handlePaymentError = (error: string) => {
    toast.error(ERROR_MESSAGES.PAYMENT_FAILED);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24 sm:pb-12">
      <ScrollIndicator />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="py-8 sm:py-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/validation-panier')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm sm:text-base mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Retour au panier</span>
            <span className="sm:hidden">Retour</span>
          </motion.button>

          {/* Informations personnelles */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border-2 border-gray-200"
          >
            <div className="p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Tes infos :</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={contactInfo.firstName}
                      onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 text-gray-900"
                      placeholder="prénom"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={contactInfo.lastName}
                      onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 text-gray-900"
                      placeholder="nom"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 text-gray-900"
                    placeholder="ton@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="FR"
                    value={contactInfo.phone}
                    onChange={(value) => setContactInfo({ ...contactInfo, phone: value || '' })}
                    className="w-full bg-white"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Options de livraison */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border-2 border-gray-200"
          >
            <div className="p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Où récupérer ta commande ?              </h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="delivery"
                    value="atelier"
                    checked={deliveryOption === DELIVERY_OPTIONS.ATELIER}
                    onChange={(e) => setDeliveryOption(e.target.value as DeliveryOption)}
                    className="h-4 w-4 text-blue-700 border-2 border-gray-300 focus:ring-blue-700"
                  />
        <div className="ml-4">
          <div className="font-medium text-gray-900">Retrait à l&apos;atelier</div>
          <div className="text-gray-700 text-sm">Gratuit - Retrait à l&apos;atelier de Claire</div>
        </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="delivery"
                    value="bureau"
                    checked={deliveryOption === DELIVERY_OPTIONS.BUREAU}
                    onChange={(e) => setDeliveryOption(e.target.value as DeliveryOption)}
                    className="h-4 w-4 text-blue-700 border-2 border-gray-300 focus:ring-blue-700"
                  />
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">Retrait au bureau</div>
                    <div className="text-gray-700 text-sm">Gratuit - Retrait au bureau de Levallois</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="delivery"
                    value="domicile"
                    checked={deliveryOption === DELIVERY_OPTIONS.DOMICILE}
                    onChange={(e) => setDeliveryOption(e.target.value as DeliveryOption)}
                    className="h-4 w-4 text-blue-700 border-2 border-gray-300 focus:ring-blue-700"
                  />
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">Livraison à domicile</div>
                    <div className="text-gray-700 text-sm">10€ - Livraison à l&apos;adresse de ton choix</div>
                    </div>
                </label>

                {deliveryOption === DELIVERY_OPTIONS.DOMICILE && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse
                      </label>
                      <input
                        type="text"
                        id="address"
                        value={deliveryAddress.address}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 text-gray-900"
                        placeholder="42 rue de la Paix"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          Code postal
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          value={deliveryAddress.zipCode}
                          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 text-gray-900"
                          placeholder="75001"
                        />
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          Ville
                        </label>
                        <input
                          type="text"
                          id="city"
                          value={deliveryAddress.city}
                          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 text-gray-900"
                          placeholder="Paris"
                        />
                      </div>
                    </div>

                    {/* Sélection du créneau de livraison */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Créneau de livraison</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date de livraison
                          </label>
                          <DatePicker
                            selected={deliverySlot.date}
                            onChange={(date) => setDeliverySlot({ ...deliverySlot, date: date || addDays(new Date(), 4) })}
                            minDate={minDate}
                            maxDate={maxDate}
                            locale="fr"
                            dateFormat="dd/MM/yyyy"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Créneau horaire
                          </label>
                          <select
                            value={deliverySlot.timeSlot}
                            onChange={(e) => setDeliverySlot({ ...deliverySlot, timeSlot: e.target.value as typeof TIME_SLOTS[number] })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                          >
                            {TIME_SLOTS.map((slot) => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Mode de paiement */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border-2 border-gray-200"
          >
            <div className="p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Mode de paiement</h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="especes"
                    checked={paymentMethod === PAYMENT_METHODS.ESPECES}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value as PaymentMethod);
                      setClientSecret(null);
                    }}
                    className="h-4 w-4 text-blue-700 border-2 border-gray-300 focus:ring-blue-700"
                  />
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">Espèces</div>
                    <div className="text-gray-700 text-sm">
                      {deliveryOption === DELIVERY_OPTIONS.DOMICILE 
                        ? 'Paiement en espèces à la livraison'
                        : 'Paiement en espèces lors du retrait'}
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="carte"
                    checked={paymentMethod === PAYMENT_METHODS.CARTE}
                    onChange={async (e) => {
                      setPaymentMethod(e.target.value as PaymentMethod);
                      setClientSecret(null);
                      if (e.target.value === PAYMENT_METHODS.CARTE) {
                        await createPaymentIntent();
                      }
                    }}
                    className="h-4 w-4 text-blue-700 border-2 border-gray-300 focus:ring-blue-700"
                  />
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">Carte bancaire</div>
                    <div className="text-gray-700 text-sm">Paiement sécurisé par Stripe</div>
                  </div>
                </label>

                {paymentMethod === PAYMENT_METHODS.CARTE && clientSecret && (
                  <div className="mt-6">
                    <PaymentForm
                      clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Récapitulatif */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border-2 border-gray-200"
          >
            <div className="p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Récapitulatif</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-700 font-medium">
                  <span>Sous-total</span>
                  <span>{cartTotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 font-medium">
                  <span>Frais de livraison</span>
                  <span>{deliveryOption === DELIVERY_OPTIONS.DOMICILE ? `${DELIVERY_FEE.toFixed(2)}€` : 'Gratuit'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t-2 border-gray-100">
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bouton de validation */}
          {!(paymentMethod === PAYMENT_METHODS.CARTE && clientSecret) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-12 py-4 bg-blue-700 text-white font-semibold rounded-lg shadow-lg
                  transition-all duration-200 transform
                  ${isSubmitting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-blue-800 hover:shadow-xl active:scale-95'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validation en cours...
                  </span>
                ) : 'Valider ma commande'}
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>

      <Toaster
        containerStyle={{
          top: 20,
          left: 20,
          bottom: 20,
          right: 20,
          zIndex: 9999,
        }}
        toastOptions={{
          className: '!z-50',
          style: {
            zIndex: 50,
            background: '#fff',
            color: '#000',
            padding: '16px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        }}
      />
    </div>
  );
} 