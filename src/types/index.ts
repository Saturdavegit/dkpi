export interface ProductVariant {
  size: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  variants: ProductVariant[];
  image: string;
}

export type DeliveryMethod = 'delivery' | 'pickup_levallois' | 'pickup_paris';
export type PaymentMethod = 'cash' | 'card';

export interface OrderFormData {
  name: string;
  email: string;
  address: string;
  productId: string;
  variantSize: string;
  quantity: number;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  timeSlot?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface OrderSummary extends OrderFormData {
  product: Product;
  totalPrice: number;
  deliveryFee: number;
} 