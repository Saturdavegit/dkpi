import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import { CartItem } from '@/types/cart';

// Vérification des variables d'environnement requises
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM', 'ADMIN_EMAIL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Variables d\'environnement manquantes:', missingEnvVars);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
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

function formatDeliveryInfo(data: any): string {
  let deliveryInfo = `Mode de livraison : ${data.deliveryOption === 'atelier' ? 'Retrait à l\'atelier' : 
    data.deliveryOption === 'bureau' ? 'Retrait au bureau de Levallois' : 'Livraison à domicile'}`;

  if (data.deliveryOption === 'domicile') {
    deliveryInfo += `
    Adresse : ${data.deliveryAddress.address}
    Code postal : ${data.deliveryAddress.zipCode}
    Ville : ${data.deliveryAddress.city}
    Date de livraison : ${new Date(data.deliverySlot.date).toLocaleDateString('fr-FR')}
    Créneau horaire : ${data.deliverySlot.timeSlot}`;
  }

  return deliveryInfo;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // En mode développement ou si les variables d'environnement sont manquantes,
    // on simule juste le succès sans envoyer d'emails
    if (process.env.NODE_ENV === 'development' || missingEnvVars.length > 0) {
      console.log('Mode développement ou variables d\'environnement manquantes - Simulation de succès');
      console.log('Données reçues:', data);
      
      return NextResponse.json({ 
        success: true,
        message: 'Commande enregistrée avec succès (mode développement)'
      });
    }

    // En production, on envoie les emails
    try {
      // Email pour l'administrateur
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: 'Nouvelle commande - Du kéfir pour Inès',
        text: `
Nouvelle commande reçue !

Informations client :
Nom : ${data.contactInfo.firstName} ${data.contactInfo.lastName}
Email : ${data.contactInfo.email}
Téléphone : ${data.contactInfo.phone}

${formatDeliveryInfo(data)}

Mode de paiement : ${data.paymentMethod === 'carte' ? 'Carte bancaire' : 'Espèces'}

Détails de la commande :
${formatCartItems(data.cart.items)}

Sous-total : ${data.cart.total.toFixed(2)}€
${data.deliveryOption === 'domicile' ? `Frais de livraison : 10.00€` : ''}
Total : ${data.total.toFixed(2)}€
        `,
      });

      // Email pour le client
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: data.contactInfo.email,
        subject: 'Confirmation de commande - Du kéfir pour Inès',
        text: `
Bonjour ${data.contactInfo.firstName},

Nous avons bien reçu votre commande et nous vous en remercions !

Récapitulatif de votre commande :
${formatCartItems(data.cart.items)}

${formatDeliveryInfo(data)}

Mode de paiement : ${data.paymentMethod === 'carte' ? 'Carte bancaire' : 'Espèces'}

Sous-total : ${data.cart.total.toFixed(2)}€
${data.deliveryOption === 'domicile' ? `Frais de livraison : 10.00€` : ''}
Total : ${data.total.toFixed(2)}€

${data.paymentMethod === 'especes' ? 
  `N'oubliez pas de prévoir le paiement en espèces lors du ${data.deliveryOption === 'domicile' ? 'de la livraison' : 'retrait'}.` : ''}

Pour toute question, n'hésitez pas à nous contacter.

À bientôt !
L'équipe Du kéfir pour Inès
        `,
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi des emails:', emailError);
      throw new Error('Erreur lors de l\'envoi des emails de confirmation');
    }

    return NextResponse.json({ 
      success: true,
      message: 'Commande enregistrée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la soumission de la commande:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement de la commande'
      },
      { status: 500 }
    );
  }
} 