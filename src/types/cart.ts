export interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
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
  timeSlot: string;
}

export interface CartContextType {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string, size: string) => void;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isMaxQuantityReached: (productId: string, size: string) => boolean;
} 