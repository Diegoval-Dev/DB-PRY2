'use client';

import { useCart } from '@/store/useCart';
import { useRouter } from 'next/navigation';

export default function FloatingCart() {
  const { itemCount, total } = useCart();
  const router = useRouter();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={() => router.push('/client/cart')}
        className="bg-[#FF6F61] hover:bg-[#E5645A] text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium"
      >
        Ver Carrito – {itemCount} ítems · Q{total.toFixed(2)}
      </button>
    </div>
  );
}