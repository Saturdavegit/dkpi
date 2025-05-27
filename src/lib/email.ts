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
    <h1>Confirmation de commande - Du kéfir pour Inès</h1>
    <p>Bonjour ${orderData.name},</p>
    <p>Nous avons bien reçu votre commande. Voici le récapitulatif :</p>
    
    <h2>Détails de la commande</h2>
    <ul>
      <li>Produit : ${product.name}</li>
      <li>Format : ${variant.size}</li>
      <li>Quantité : ${orderData.quantity}</li>
      <li>Prix unitaire : ${variant.price.toFixed(2)} €</li>
      <li>Mode de retrait : ${deliveryMethod}</li>
      <li>Mode de paiement : ${paymentMethod}</li>
      ${orderData.deliveryMethod === 'delivery' ? `<li>Adresse de livraison : ${orderData.address}</li>` : ''}
      <li>Total : ${totalPrice.toFixed(2)} €</li>
    </ul>

    ${orderData.timeSlot ? `<p>Créneau horaire choisi : ${orderData.timeSlot}</p>` : ''}

    <p>Pour toute question, n'hésitez pas à nous contacter à ${process.env.COMPANY_EMAIL}</p>

    <p>Merci de votre confiance !</p>
    <p>Claire de "Du kéfir pour Inès"</p>
  `;

  await transporter.sendMail({
    from: process.env.COMPANY_EMAIL,
    to: orderData.email,
    subject: 'Confirmation de votre commande - Du kéfir pour Inès',
    html: emailContent,
  });
} 