import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import products from '@/data/products.json';
import { OrderFormData } from '@/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const body: OrderFormData = await request.json();
    const product = products.products.find(p => p.id === body.productId);
    const variant = product?.variants.find(v => v.size === body.variantSize);

    if (!product || !variant) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    const unitPrice = variant.price;
    const quantity = body.quantity || 1;
    const deliveryFee = body.deliveryMethod === 'delivery' ? 1000 : 0; // 10€ en centimes
    const totalAmount = (unitPrice * 100 * quantity) + deliveryFee; // Conversion en centimes pour Stripe

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${product.name} - ${variant.size}`,
              description: product.description,
            },
            unit_amount: unitPrice * 100, // Prix en centimes
          },
          quantity: quantity,
        },
        body.deliveryMethod === 'delivery' ? {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Frais de livraison',
            },
            unit_amount: 1000, // 10€ en centimes
          },
          quantity: 1,
        } : null,
      ].filter(Boolean),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?product=${body.productId}&size=${body.variantSize}`,
      metadata: {
        productId: body.productId,
        variantSize: body.variantSize,
        quantity: body.quantity?.toString(),
        deliveryMethod: body.deliveryMethod,
        name: body.name,
        email: body.email,
        address: body.address,
      },
    });

    return NextResponse.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la session de paiement' }, { status: 500 });
  }
} 