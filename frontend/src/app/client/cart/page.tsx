'use client';

import { useCart } from '@/store/useCart';
import CartItemRow from './CartItemRow';
import SummaryBox from './SummaryBox';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';

export default function CartPage() {
  const { items, total, itemCount, clearCart } = useCart();
  const router = useRouter();
  const { user, token } = useAuth();

  const deliveryFee = 10;
  const tax = total * 0.12;
  const finalTotal = total + deliveryFee + tax;

  if (itemCount === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        <p>Tu carrito está vacío.</p>
      </div>
    );
  }

  const handleConfirm = async () => {
    try {
      const restaurantId = items[0]?.restaurantId;

      console.log({
        userId: user?.id,
        restaurantId,
        date: new Date().toISOString(),
        status: 'pendiente',
        total: finalTotal,
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
        })),
      });

      if (!restaurantId || !user?.id) {
        alert('Información del pedido incompleta');
        return;
      }

      const validItems = items.filter(i => i.menuItemId);
      if (validItems.length !== items.length) {
        alert('Algunos productos en el carrito no tienen información completa');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          restaurantId,
          date: new Date().toISOString(),
          status: 'pendiente',
          total: finalTotal,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
          })),
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      clearCart();
      alert('¡Pedido realizado con éxito!');
      router.push('/client/home');
    } catch (err: any) {
      alert(`Error al confirmar pedido: ${err.message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 pb-32">
      <h1 className="text-2xl font-semibold mb-6 text-[#333]">Tu Pedido</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <CartItemRow key={item.menuItemId} item={item} />
        ))}
      </div>

      <div className="mt-8">
        <SummaryBox
          subtotal={total}
          delivery={deliveryFee}
          tax={tax}
          total={finalTotal}
        />
      </div>

      <button
        onClick={handleConfirm}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] bg-[#FF6F61] hover:bg-[#E5645A] text-white py-3 rounded-full text-center font-medium shadow-lg"
      >
        Confirmar Pedido – Q{finalTotal.toFixed(2)}
      </button>
    </div>
  );
}