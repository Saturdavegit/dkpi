import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('La clé secrète Stripe n\'est pas configurée');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { total, metadata } = body;

    // Création de l'intention de paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Conversion en centimes
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'intention de paiement' }, 
      { status: 500 }
    );
  }
} 