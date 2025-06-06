'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fr } from 'date-fns/locale';
import { useCart } from '@/context/CartContext';

export default function Livraison() {
  const router = useRouter();
  const { 
    setDeliveryMethod, 
    setDeliveryDate, 
    setDeliveryAddress,
    deliveryMethod,
    deliveryDate,
    deliveryAddress
  } = useCart();
  const [selectedDelivery, setSelectedDelivery] = useState<'atelier' | 'bureau' | 'domicile' | null>(deliveryMethod);
  const [selectedDate, setSelectedDate] = useState<Date | null>(deliveryDate);
  const [address, setAddress] = useState(deliveryAddress?.street || '');
  const [city, setCity] = useState(deliveryAddress?.city || '');
  const [postalCode, setPostalCode] = useState(deliveryAddress?.postalCode || '');
  const addressFormRef = useRef<HTMLDivElement>(null);

  // Scroll vers le formulaire d'adresse quand la livraison à domicile est sélectionnée
  useEffect(() => {
    if (selectedDelivery === 'domicile' && addressFormRef.current) {
      setTimeout(() => {
        addressFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [selectedDelivery]);

  const deliveryOptions = [
    {
      id: 'atelier' as const,
      title: 'Récupère ta commande chez moi à l\'atelier',
      price: 0
    },
    {
      id: 'bureau' as const,
      title: 'Ou au bureau à Levallois',
      price: 0
    },
    {
      id: 'domicile' as const,
      title: 'Ou directement chez toi pour un petit supplément!',
      price: 10
    }
  ];

  const handleContinue = () => {
    if (selectedDelivery && selectedDate) {
      setDeliveryMethod(selectedDelivery);
      setDeliveryDate(selectedDate);
      if (selectedDelivery === 'domicile') {
        setDeliveryAddress({
          street: address,
          city: city,
          postalCode: postalCode
        });
      }
      router.push('/informations');
    }
  };

  const isFormValid = () => {
    if (!selectedDelivery || !selectedDate) return false;
    if (selectedDelivery === 'domicile') {
      return address.trim() !== '' && city.trim() !== '' && postalCode.trim() !== '';
    }
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen bg-gray-50"
    >
      <Header title="Quand et où?" />
      <div className="max-w-3xl mx-auto px-4 py-12 pb-32">
        <div className="space-y-6">
          {/* Date de livraison en premier */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quand souhaites-tu récupérer tes élixirs ?</h3>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              locale={fr}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Options de livraison */}
          <div className="space-y-4">
            {deliveryOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDelivery(option.id)}
                className={`p-6 bg-white rounded-lg shadow-lg cursor-pointer border-2 transition-colors ${
                  selectedDelivery === option.id ? 'border-purple-500' : 'border-transparent'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{option.title}</h3>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{option.price.toFixed(2)}€</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Adresse de livraison en dernier */}
          {selectedDelivery === 'domicile' && (
            <motion.div
              ref={addressFormRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white rounded-lg shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Adresse de livraison</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bouton sticky en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            disabled={!isFormValid()}
            className={`w-full gradient-button px-8 py-3 rounded-lg ${
              !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Continuer
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
} 