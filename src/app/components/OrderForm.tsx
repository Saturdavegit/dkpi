'use client';

import { useState } from 'react';
import { Product, OrderFormData, DeliveryMethod, PaymentMethod } from '@/types';
import { useRouter } from 'next/navigation';

interface OrderFormProps {
  product: Product;
  selectedSize: string;
}

export default function OrderForm({ product, selectedSize }: OrderFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<OrderFormData>>({
    productId: product.id,
    variantSize: selectedSize,
    quantity: 1,
  });
  const [error, setError] = useState<string>('');

  const variant = product.variants.find(v => v.size === selectedSize);
  const basePrice = variant?.price || 0;
  const deliveryFee = formData.deliveryMethod === 'delivery' ? 10 : 0;
  const totalPrice = (basePrice * (formData.quantity || 1)) + deliveryFee;

  const handleQuantityChange = (value: number) => {
    if (value > 5) {
      setError('Vous ne pouvez pas commander plus de 5 unités');
      return;
    }
    setError('');
    setFormData({ ...formData, quantity: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.deliveryMethod || !formData.paymentMethod) {
      setError('Veilles à bien remplir tous les champs');
      return;
    }

    if (formData.deliveryMethod === 'delivery' && !formData.address) {
      setError('Ton adresse est requise pour la livraison');
      return;
    }

    if (formData.paymentMethod === 'card') {
      // Redirection vers Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, totalPrice }),
      });
      const { sessionUrl } = await response.json();
      window.location.href = sessionUrl;
    } else {
      // Paiement en espèces
      router.push(`/success?order=${encodeURIComponent(JSON.stringify({ ...formData, totalPrice, deliveryFee }))}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Informations personnelles</h3>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantité
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  min="1"
                  max="5"
                  value={formData.quantity || 1}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Mode de retrait</h3>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="space-y-4">
                {(['delivery', 'pickup_levallois', 'pickup_paris'] as DeliveryMethod[]).map((method) => (
                  <div key={method} className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      id={method}
                      value={method}
                      checked={formData.deliveryMethod === method}
                      onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value as DeliveryMethod })}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor={method} className="ml-3 block text-sm font-medium text-gray-700">
                      {method === 'delivery' ? 'Livraison à domicile (+10€)' :
                       method === 'pickup_levallois' ? 'Retrait à Levallois' : 'Retrait à Paris'}
                    </label>
                  </div>
                ))}
              </div>

              {formData.deliveryMethod === 'delivery' && (
                <div className="mt-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Adresse de livraison
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Mode de paiement</h3>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="space-y-4">
                {(['card', 'cash'] as PaymentMethod[]).map((method) => (
                  <div key={method} className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      id={method}
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor={method} className="ml-3 block text-sm font-medium text-gray-700">
                      {method === 'card' ? 'Carte bancaire' : 'Espèces à la livraison'}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Total</h3>
            <div className="text-2xl font-bold">{totalPrice.toFixed(2)} €</div>
          </div>
          {deliveryFee > 0 && (
            <p className="mt-1 text-sm text-gray-500">Dont frais de livraison : {deliveryFee.toFixed(2)} €</p>
          )}
        </div>

        {error && (
          <div className="mt-4 text-red-600 text-sm">{error}</div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {formData.paymentMethod === 'card' ? 'Payer par carte' : 'Confirmer la commande'}
          </button>
        </div>
      </div>
    </form>
  );
} 