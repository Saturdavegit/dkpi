export interface CartItem {
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface DeliveryAddress {
  address: string;
  city: string;
  zipCode: string;
}

export interface DeliverySlot {
  date: Date;
  timeSlot: '10h-12h' | '14h-16h' | '16h-18h';
}

export interface CartContextType {
  cart: Cart;
  addToCart: (product: any, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isMaxQuantityReached: (productId: string, size: string) => boolean;
} 