'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useCart } from '@/context/CartContext';

export default function Informations() {
  const router = useRouter();
  const { setContactInfo, contactInfo } = useCart();
  const [formData, setFormData] = useState({
    firstName: contactInfo?.firstName || '',
    lastName: contactInfo?.lastName || '',
    email: contactInfo?.email || '',
    phone: contactInfo?.phone || '',
  });

  const isFormValid = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== ''
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      phone: value || ''
    }));
  };

  const handleContinue = () => {
    if (isFormValid()) {
      setContactInfo(formData);
      router.push('/paiement');
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
      <Header title="Tes informations" />
      <div className="max-w-3xl mx-auto px-4 py-12 pb-32">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <PhoneInput
                international
                defaultCountry="FR"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="w-full"
              />
            </div>
          </div>
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