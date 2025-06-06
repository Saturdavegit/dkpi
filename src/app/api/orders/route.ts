import { NextResponse } from 'next/server';
import { Order } from '@/types/cart';
import { Resend } from 'resend';
import OrderConfirmationEmail from '@/emails/order-confirmation';
import AdminNotificationEmail from '@/emails/admin-notification';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const order: Order = await request.json();

    // Validation des données
    if (!order.items || order.items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      );
    }

    if (!order.contactInfo || !order.contactInfo.email) {
      return NextResponse.json(
        { error: 'Les informations de contact sont manquantes' },
        { status: 400 }
      );
    }

    // Envoi de l'email de confirmation au client
    await resend.emails.send({
      from: 'DKPI <contact@dkpi.fr>',
      to: order.contactInfo.email,
      subject: 'Confirmation de votre commande',
      react: OrderConfirmationEmail({ order }),
    });

    // Envoi de la notification à l'administrateur
    await resend.emails.send({
      from: 'DKPI <contact@dkpi.fr>',
      to: 'contact@dkpi.fr',
      subject: 'Nouvelle commande reçue',
      react: AdminNotificationEmail({ order }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
} 