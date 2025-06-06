import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { transporter, verifyEmailConnection } from '@/lib/email-config';
import { CartItem, ContactInfo, DeliveryAddress, DeliverySlot } from '@/types/cart';
import products from '@/data/products.json';

// Vérification des variables d'environnement requises
const requiredEnvVars = ['SMTP_FROM', 'ADMIN_EMAIL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Variables d\'environnement manquantes:', missingEnvVars);
}

interface OrderData {
  deliveryOption: 'atelier' | 'bureau' | 'domicile';
  deliveryAddress: DeliveryAddress | null;
  deliverySlot: DeliverySlot | null;
  contactInfo: ContactInfo;
  paymentMethod: 'carte' | 'especes';
  cart: {
    items: CartItem[];
    total: number;
  };
  total: number;
  deliveryDate: string;
}

type ValidationError = 'INCOMPLETE_ADDRESS' | 'INVALID_EMAIL' | 'INVALID_PHONE' | 'EMPTY_CART';

function validateOrderData(data: OrderData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validation de l'email
  if (!data.contactInfo.email || !data.contactInfo.email.includes('@')) {
    errors.push('INVALID_EMAIL');
  }

  // Validation du téléphone
  if (!data.contactInfo.phone || data.contactInfo.phone.length < 10) {
    errors.push('INVALID_PHONE');
  }

  // Validation du panier
  if (!data.cart.items || data.cart.items.length === 0) {
    errors.push('EMPTY_CART');
  }

  // Validation de l'adresse pour la livraison à domicile
  if (data.deliveryOption === 'domicile' && (!data.deliveryAddress || 
      !data.deliveryAddress.street || 
      !data.deliveryAddress.postalCode || 
      !data.deliveryAddress.city)) {
    errors.push('INCOMPLETE_ADDRESS');
  }

  return errors;
}

function getProductDetails(productId: string, variantId: string) {
  const product = products.products.find(p => p.id === productId);
  const variant = product?.variants.find(v => v.id === variantId);
  return { product, variant };
}

function formatCartItems(items: CartItem[]): string {
  return items.map(item => {
    const { product, variant } = getProductDetails(item.id, item.variantId);
    if (!product || !variant) return '';
    
    return `
    - ${product.name} (${variant.size})
    Quantité : ${item.quantity}
    Prix unitaire : ${variant.price.toFixed(2)}€
    Sous-total : ${(variant.price * item.quantity).toFixed(2)}€
  `;
  }).join('\n');
}

function formatDeliveryInfo(data: OrderData): string {
  let deliveryInfo = `Mode de livraison : ${data.deliveryOption === 'atelier' ? 'Retrait à l\'atelier' : 
    data.deliveryOption === 'bureau' ? 'Retrait au bureau de Levallois' : 'Livraison à domicile'}`;

  deliveryInfo += `
    Date souhaitée : ${data.deliveryDate}`;

  if (data.deliveryOption === 'domicile' && data.deliveryAddress) {
    deliveryInfo += `
    Adresse de livraison :
    ${data.deliveryAddress.street}
    ${data.deliveryAddress.postalCode} ${data.deliveryAddress.city}`;
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
      return NextResponse.json({ 
        success: false,
        message: 'Structure de données invalide: cart.items doit être un tableau'
      }, { status: 400 });
    }

    // Validation des données
    const validationErrors = validateOrderData(data);
    if (validationErrors.length > 0) {
      // Si le paiement est en espèces, on bloque sur toutes les erreurs
      if (data.paymentMethod === 'especes') {
        return NextResponse.json({ 
          success: false,
          message: 'Erreur de validation',
          errors: validationErrors
        }, { status: 400 });
      }
      
      // Pour le paiement par carte, on ne bloque que sur les erreurs critiques
      const criticalErrors = validationErrors.filter((error: ValidationError) => error !== 'INCOMPLETE_ADDRESS');
      if (criticalErrors.length > 0) {
        return NextResponse.json({ 
          success: false,
          message: 'Erreur de validation',
          errors: criticalErrors
        }, { status: 400 });
      }
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
      return NextResponse.json({ 
        success: false,
        message: 'Impossible de se connecter au serveur SMTP'
      }, { status: 500 });
    }

    try {
      // Email pour l'administrateur
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: 'Nouvelle commande - Du kéfir by Claire',
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
        subject: 'Ta commande est confirmée ! 🎉',
        text: `
Hello ${data.contactInfo.firstName},

J'ai bien reçu ta commande et je suis ravie de préparer ton kéfir.

Petit recap :
${formatCartItems(data.cart.items)}

${formatDeliveryInfo(data)}

Mode de paiement : ${data.paymentMethod === 'carte' ? 'Carte bancaire' : 'Espèces'}
Sous-total : ${data.cart.total.toFixed(2)}€
${data.deliveryOption === 'domicile' ? `Frais de livraison : 10.00€` : ''}
Total : ${data.total.toFixed(2)}€

${data.paymentMethod === 'especes' ? 
  `N'oublie pas de prévoir le paiement en espèces lors du ${data.deliveryOption === 'domicile' ? 'de la livraison' : 'retrait'}.` : ''}

Si tu as la moindre question, n'hésite pas à me contacter.

À très vite !
Claire 🌱
        `,
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi des emails:', emailError);
      return NextResponse.json({ 
        success: false,
        message: 'Erreur lors de l\'envoi des emails de confirmation'
      }, { status: 500 });
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