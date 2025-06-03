'use client';

import { Order } from '@/types/cart';

interface AdminOrderNotificationEmailProps {
  order: Order;
}

export function AdminOrderNotificationEmail({ order }: AdminOrderNotificationEmailProps) {
  const {
    contactInfo,
    deliveryOption,
    deliveryAddress,
    deliveryDate,
    paymentMethod,
    total,
    items
  } = order;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouvelle commande reçue ! 🎉</h1>

      <div className="space-y-6">
        {/* Informations client */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Informations client</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Nom :</strong> {contactInfo.firstName} {contactInfo.lastName}</p>
            <p><strong>Email :</strong> {contactInfo.email}</p>
            <p><strong>Téléphone :</strong> {contactInfo.phone}</p>
          </div>
        </section>

        {/* Détails de la commande */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Détails de la commande</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Mode de livraison :</strong> {deliveryOption}</p>
            <p><strong>Date souhaitée :</strong> {deliveryDate}</p>
            {deliveryOption === 'domicile' && deliveryAddress && (
              <>
                <p><strong>Adresse :</strong> {deliveryAddress.address}</p>
                <p><strong>Ville :</strong> {deliveryAddress.city}</p>
                <p><strong>Code postal :</strong> {deliveryAddress.zipCode}</p>
              </>
            )}
            <p><strong>Mode de paiement :</strong> {paymentMethod}</p>
          </div>
        </section>

        {/* Articles commandés */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Articles commandés</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            {items.map((item: { name: string; quantity: number; price: number }, index: number) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                <span>{item.name} x{item.quantity}</span>
                <span>{item.price.toFixed(2)}€</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-4 pt-4 border-t border-gray-300">
              <span>Total</span>
              <span>{total.toFixed(2)}€</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 