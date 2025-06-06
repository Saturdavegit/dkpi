export type CartItem = {
  id: string;
  variantId: string;
  quantity: number;
  name: string;
  size: string;
  price: number;
};

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  postalCode: string;
}

export interface DeliverySlot {
  date: Date;
  timeSlot: string;
}

export type CartContextType = {
  items: CartItem[];
  total: number;
  addToCart: (productId: string, variantId: string) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  getProductQuantity: (productId: string, variantId: string) => number;
  clearCart: () => void;
  deliveryMethod: 'atelier' | 'bureau' | 'domicile' | null;
  setDeliveryMethod: (method: 'atelier' | 'bureau' | 'domicile' | null) => void;
  deliveryDate: Date | null;
  setDeliveryDate: (date: Date | null) => void;
  deliveryAddress: DeliveryAddress | null;
  setDeliveryAddress: (address: DeliveryAddress | null) => void;
  contactInfo: ContactInfo | null;
  setContactInfo: (info: ContactInfo | null) => void;
};

export interface Order {
  contactInfo: ContactInfo;
  deliveryOption: 'atelier' | 'bureau' | 'domicile';
  deliveryAddress: DeliveryAddress | null;
  deliveryDate: string;
  paymentMethod: 'carte' | 'especes';
  total: number;
  items: Array<{
    id: string;
    variantId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
} 