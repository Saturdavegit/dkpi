export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  variants: Array<{
    id: string;
    name: string;
    size: string;
    price: number;
  }>;
}; 