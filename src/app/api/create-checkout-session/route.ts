import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/types/cart';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('La clé secrète Stripe n\'est pas configurée');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cart, contactInfo, deliveryOption } = body;

    // Création des line items à partir du panier
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item: CartItem) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${item.name} - ${item.size}`,
        },
        unit_amount: Math.round(item.price * 100), // Conversion en centimes
      },
      quantity: item.quantity,
    }));

    // Ajout des frais de livraison si nécessaire
    if (deliveryOption === 'domicile') {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Frais de livraison',
          },
          unit_amount: 1000, // 10€ en centimes
        },
        quantity: 1,
      });
    }

    // Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/commande-confirmee`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/livraison-paiement`,
      customer_email: contactInfo.email,
      metadata: {
        deliveryOption,
        customerName: `${contactInfo.firstName} ${contactInfo.lastName}`,
        customerPhone: contactInfo.phone,
      },
    });

    return NextResponse.json({ 
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
} 