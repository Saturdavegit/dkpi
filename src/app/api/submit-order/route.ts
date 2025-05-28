import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { transporter, verifyEmailConnection } from '@/lib/email-config';
import { CartItem } from '@/types/cart';

// Vérification des variables d'environnement requises
const requiredEnvVars = ['SMTP_FROM', 'ADMIN_EMAIL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Variables d\'environnement manquantes:', missingEnvVars);
}

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
    
    // Log des données reçues pour le débogage
    console.log('Données reçues:', JSON.stringify(data, null, 2));
    
    // Vérification de la structure des données
    if (!data.cart || !Array.isArray(data.cart.items)) {
      console.error('Structure de données invalide:', {
        hasCart: !!data.cart,
        cartType: data.cart ? typeof data.cart : 'undefined',
        hasItems: data.cart ? !!data.cart.items : false,
        itemsType: data.cart && data.cart.items ? typeof data.cart.items : 'undefined'
      });
      throw new Error('Structure de données invalide: cart.items doit être un tableau');
    }

    // Si les variables d'environnement sont manquantes, on ne peut pas envoyer d'emails
    if (missingEnvVars.length > 0) {
      console.error('Variables d\'environnement manquantes - Impossible d\'envoyer des emails');
      console.log('Variables manquantes:', missingEnvVars);
      console.log('Données reçues:', data);
      
      return NextResponse.json({ 
        success: false,
        message: 'Configuration email incomplète. Veuillez configurer les variables d\'environnement.'
      }, { status: 500 });
    }

    // Vérifier la connexion SMTP avant d'envoyer les emails
    const isEmailConnected = await verifyEmailConnection();
    if (!isEmailConnected) {
      throw new Error('Impossible de se connecter au serveur SMTP');
    }

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