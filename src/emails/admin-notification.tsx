import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Order } from '@/types/cart';
import products from '@/data/products.json';

interface AdminNotificationEmailProps {
  order: Order;
}

export default function AdminNotificationEmail({ order }: AdminNotificationEmailProps) {
  const getProductDetails = (productId: string, variantId: string) => {
    const product = products.products.find(p => p.id === productId);
    const variant = product?.variants.find(v => v.id === variantId);
    return { product, variant };
  };

  return (
    <Html>
      <Head />
      <Preview>Nouvelle commande reçue</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Nouvelle commande</Heading>
          
          <Section style={section}>
            <Text style={text}>
              <strong>Client :</strong> {order.contactInfo.firstName} {order.contactInfo.lastName}
            </Text>
            <Text style={text}>
              <strong>Email :</strong> {order.contactInfo.email}
            </Text>
            <Text style={text}>
              <strong>Téléphone :</strong> {order.contactInfo.phone}
            </Text>

            <Section style={orderDetails}>
              <Text style={text}>
                <strong>Détails de la commande :</strong>
              </Text>
              {order.items.map((item, index) => {
                const { product, variant } = getProductDetails(item.id, item.variantId);
                if (!product || !variant) return null;

                return (
                  <Text key={index} style={itemText}>
                    • {product.name} ({variant.size}) - {item.quantity} x {variant.price.toFixed(2)}€
                  </Text>
                );
              })}
            </Section>

            <Text style={text}>
              <strong>Total : {order.total.toFixed(2)}€</strong>
            </Text>

            <Text style={text}>
              <strong>Mode de livraison :</strong> {order.deliveryOption}
            </Text>
            {order.deliveryAddress && (
              <>
                <Text style={text}>
                  <strong>Adresse de livraison :</strong>
                </Text>
                <Text style={text}>
                  {order.deliveryAddress.address}<br />
                  {order.deliveryAddress.zipCode} {order.deliveryAddress.city}
                </Text>
              </>
            )}
            <Text style={text}>
              <strong>Date de livraison :</strong> {order.deliveryDate}
            </Text>
            <Text style={text}>
              <strong>Mode de paiement :</strong> {order.paymentMethod}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const section = {
  padding: '24px',
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const orderDetails = {
  margin: '24px 0',
  padding: '16px',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
};

const itemText = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
}; 