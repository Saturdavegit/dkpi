import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { CartItem } from '@/types/cart';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

function formatCartItems(items: CartItem[]): string {
  return items.map(item => `
    - ${item.name} (${item.size})
    Quantité : ${item.quantity}
    Prix unitaire : ${item.price.toFixed(2)}€
    Sous-total : ${(item.price * item.quantity).toFixed(2)}€
  `).join('\n');
}

export async function POST(request: Request) {
  try {
    const { cart, customization } = await request.json();

    // Email pour l'administrateur
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'Nouvelle commande - Du kéfir pour Inès',
      text: `
Nouvelle commande reçue !

Détails de la commande :
${formatCartItems(cart.items)}

Total : ${cart.total.toFixed(2)}€

Message de personnalisation :
${customization || 'Aucun message de personnalisation'}
      `,
    });

    // Email de confirmation pour le client
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: cart.customerEmail, // Assurez-vous d'avoir l'email du client dans le panier
      subject: 'Confirmation de votre commande - Du kéfir pour Inès',
      text: `
Merci pour votre commande !

Voici le récapitulatif de votre commande :
${formatCartItems(cart.items)}

Total : ${cart.total.toFixed(2)}€

Votre message de personnalisation :
${customization || 'Aucun message de personnalisation'}

Nous vous contacterons prochainement pour organiser la livraison.

À bientôt !
L'équipe Du kéfir pour Inès
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'envoi des emails:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la commande' },
      { status: 500 }
    );
  }
} 