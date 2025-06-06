import { OrderFormData } from '@/types';
import products from '@/data/products.json';
import { transporter } from './email-config';

export async function sendOrderConfirmationEmail(orderData: OrderFormData, totalPrice: number) {
  const product = products.products.find(p => p.id === orderData.productId);
  const variant = product?.variants.find(v => v.size === orderData.variantSize);

  if (!product || !variant) {
    throw new Error('Produit non trouvé');
  }

  const deliveryMethod = {
    delivery: 'Livraison à domicile',
    pickup_levallois: 'Retrait à Levallois',
    pickup_paris: 'Retrait à Paris',
  }[orderData.deliveryMethod];

  const paymentMethod = {
    card: 'Carte bancaire',
    cash: 'Espèces à la livraison',
  }[orderData.paymentMethod];

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #4A5568;">
      <div style="background-color: #F7FAFC; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #2D3748; font-size: 24px; margin-bottom: 20px; text-align: center;">Confirmation de commande</h1>
        <h2 style="color: #4A5568; font-size: 18px; margin-bottom: 15px; text-align: center;">Du kéfir pour Inès</h2>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Bonjour ${orderData.name},</p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Nous avons bien reçu votre commande. Voici le récapitulatif :</p>
    
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #2D3748; font-size: 18px; margin-bottom: 15px;">Détails de la commande</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #E2E8F0;">
              <strong style="color: #4A5568;">Produit :</strong> ${product.name}
            </li>
            <li style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #E2E8F0;">
              <strong style="color: #4A5568;">Format :</strong> ${variant.size}
            </li>
            <li style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #E2E8F0;">
              <strong style="color: #4A5568;">Quantité :</strong> ${orderData.quantity}
            </li>
            <li style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #E2E8F0;">
              <strong style="color: #4A5568;">Prix unitaire :</strong> ${variant.price.toFixed(2)} €
            </li>
            <li style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #E2E8F0;">
              <strong style="color: #4A5568;">Mode de retrait :</strong> ${deliveryMethod}
            </li>
            <li style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #E2E8F0;">
              <strong style="color: #4A5568;">Mode de paiement :</strong> ${paymentMethod}
            </li>
            ${orderData.deliveryMethod === 'delivery' ? `
            <li style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #E2E8F0;">
              <strong style="color: #4A5568;">Adresse de livraison :</strong> ${orderData.address}
            </li>` : ''}
            <li style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #E2E8F0;">
              <strong style="color: #4A5568;">Total :</strong> ${totalPrice.toFixed(2)} €
            </li>
    </ul>
        </div>

        ${orderData.timeSlot ? `
        <div style="background-color: #EBF8FF; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #2C5282;">
            <strong>Créneau horaire choisi :</strong> ${orderData.timeSlot}
          </p>
        </div>` : ''}

        <div style="background-color: #F0FFF4; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #2F855A;">
            Pour toute question, n'hésitez pas à nous contacter à 
            <a href="mailto:${process.env.COMPANY_EMAIL}" style="color: #2F855A; text-decoration: underline;">
              ${process.env.COMPANY_EMAIL}
            </a>
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">Merci de votre confiance !</p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0; color: #4A5568;">
          Claire de "Du kéfir pour Inès"
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.COMPANY_EMAIL,
    to: orderData.email,
    subject: 'Confirmation de votre commande - Du kéfir pour Inès',
    html: emailContent,
  });
} 