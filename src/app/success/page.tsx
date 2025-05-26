'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderFormData, OrderSummary } from '@/types';
import products from '@/data/products.json';
import { addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const orderData = searchParams.get('order');
    if (orderData) {
      try {
        const parsedOrder: OrderFormData & { totalPrice: number; deliveryFee: number } = JSON.parse(decodeURIComponent(orderData));
        const product = products.products.find(p => p.id === parsedOrder.productId);
        if (product) {
          setOrderSummary({
            ...parsedOrder,
            product,
            totalPrice: parsedOrder.totalPrice,
            deliveryFee: parsedOrder.deliveryFee
          });
        }
      } catch (error) {
        console.error('Erreur lors du parsing des données de commande:', error);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  useEffect(() => {
    if (selectedDate) {
      // Générer des créneaux de 15 minutes entre 9h et 18h
      const slots = [];
      for (let hour = 9; hour < 18; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          slots.push(
            format(
              new Date(selectedDate.setHours(hour, minute)),
              'HH:mm',
              { locale: fr }
            )
          );
        }
      }
      setAvailableSlots(slots);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot('');
  };

  const handleSlotSelect = async (slot: string) => {
    if (!orderSummary) return;

    setSelectedSlot(slot);
    const dateTimeSlot = format(
      new Date(selectedDate!.setHours(
        parseInt(slot.split(':')[0]),
        parseInt(slot.split(':')[1])
      )),
      'dd/MM/yyyy HH:mm',
      { locale: fr }
    );

    try {
      // Envoyer le créneau choisi au serveur
      const response = await fetch('/api/update-order-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderSummary,
          timeSlot: dateTimeSlot
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du créneau');
      }

      // Mettre à jour l'affichage
      setOrderSummary(prev => prev ? { ...prev, timeSlot: dateTimeSlot } : null);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la sélection du créneau');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  if (!orderSummary) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl">Commande non trouvée</div>
    </div>;
  }

  const minDate = addDays(new Date(), 3);
  const maxDate = addDays(new Date(), 30);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Merci pour votre commande !
            </h1>

            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Récapitulatif de votre commande</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>Produit : {orderSummary.product.name} - {orderSummary.variantSize}</p>
                <p>Quantité : {orderSummary.quantity}</p>
                <p>Mode de retrait : {
                  orderSummary.deliveryMethod === 'delivery' ? 'Livraison à domicile' :
                  orderSummary.deliveryMethod === 'pickup_levallois' ? 'Retrait à Levallois' :
                  'Retrait à Paris'
                }</p>
                {orderSummary.deliveryMethod === 'delivery' && (
                  <p>Adresse : {orderSummary.address}</p>
                )}
                <p>Mode de paiement : {orderSummary.paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces'}</p>
                <p className="font-semibold mt-2">Total : {orderSummary.totalPrice.toFixed(2)} €</p>
                {orderSummary.deliveryFee > 0 && (
                  <p className="text-sm text-gray-500">Dont frais de livraison : {orderSummary.deliveryFee.toFixed(2)} €</p>
                )}
              </div>
            </div>

            {!orderSummary.timeSlot && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Choisissez votre créneau de retrait/livraison</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date (à partir de J+3)
                    </label>
                    <input
                      type="date"
                      min={format(minDate, 'yyyy-MM-dd')}
                      max={format(maxDate, 'yyyy-MM-dd')}
                      onChange={(e) => handleDateSelect(new Date(e.target.value))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Créneau horaire
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => handleSlotSelect(slot)}
                            className={`p-2 text-sm rounded-md ${
                              selectedSlot === slot
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {orderSummary.timeSlot && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h2 className="text-lg font-medium text-green-900">Créneau confirmé</h2>
                <p className="text-green-700">Votre commande est programmée pour le {orderSummary.timeSlot}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 