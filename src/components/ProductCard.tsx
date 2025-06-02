import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { toast, Toaster } from 'react-hot-toast';
import { getProductImageUrl } from '@/lib/utils';

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    description: string;
    image: string;
    variants: Array<{
      size: string;
      price: number;
    }>;
  };
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.variants[0].size);
  const [quantity, setQuantity] = useState(1);
  const { addItem, isMaxQuantityReached } = useCart();

  const selectedVariant = product.variants.find(v => v.size === selectedSize);
  const maxQuantityReached = isMaxQuantityReached(product.id, selectedSize);

  const handleAddToCart = () => {
    if (selectedVariant && !maxQuantityReached) {
      const cartItem = {
        id: product.id,
        name: product.name,
        size: selectedSize,
        price: selectedVariant.price,
        quantity: quantity,
        image: product.image
      };
      
      addItem(cartItem);
      setQuantity(1);
      toast.success(
        <div className="flex items-center gap-2">
          <span className="font-medium">{quantity > 1 ? `${quantity} ${product.name} ajoutés` : `${product.name} ajouté`}</span>
        </div>,
        {
          duration: 2000,
          position: 'top-center',
          className: '!bg-blue-600 !text-white !z-50',
          style: {
            padding: '16px',
            borderRadius: '10px',
            background: '#2563eb',
            color: '#fff',
            zIndex: 50,
          },
        }
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="relative h-56">
        <Image
          src={getProductImageUrl(product.image)}
          alt={product.name}
          fill
          className="object-cover transform transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            console.error('Image loading error:', e);
            console.log('Attempted URL:', getProductImageUrl(product.image));
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-700 text-sm mb-6 min-h-[3rem]">{product.description}</p>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-4">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%234B5563\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              {product.variants.map(variant => (
                <option key={variant.size} value={variant.size} className="py-2">
                  {variant.size} - {variant.price.toFixed(2)}€
                </option>
              ))}
            </select>
            
            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-l-lg transition-colors"
              >
                -
              </button>
              <span className="px-4 py-2 text-gray-900 font-medium border-x border-gray-200">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(3, quantity + 1))}
                className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-r-lg transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                disabled={quantity >= 3 || maxQuantityReached}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={maxQuantityReached}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              maxQuantityReached
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            }`}
          >
            {maxQuantityReached
              ? 'Limite atteinte (3 max)'
              : 'Ajouter au panier'}
          </button>
        </div>
      </div>
      <Toaster
        containerStyle={{
          top: 20,
          left: 20,
          bottom: 20,
          right: 20,
          zIndex: 9999,
        }}
        toastOptions={{
          className: '!z-50',
          style: {
            zIndex: 50,
            background: '#fff',
            color: '#000',
            padding: '16px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        }}
      />
    </div>
  );
}; 