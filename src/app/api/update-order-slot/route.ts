import { NextResponse } from 'next/server';
import { OrderSummary } from '@/types';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const orderData: OrderSummary = await request.json();

    // Envoyer l'email de confirmation
    await sendOrderConfirmationEmail(orderData, orderData.totalPrice);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du créneau:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du créneau' },
      { status: 500 }
    );
  }
} 