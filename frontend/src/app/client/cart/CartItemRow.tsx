import { CartItem, useCart } from '@/store/useCart';

export default function CartItemRow({ item }: { item: CartItem }) {
  const { addItem, removeItem } = useCart();

  return (
    <div className="flex items-center justify-between bg-white border p-4 rounded shadow">
      <div>
        <h3 className="text-sm font-medium text-[#333]">{item.name}</h3>
        <p className="text-sm text-gray-500">Q{item.price.toFixed(2)} x {item.quantity}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => addItem({ ...item, quantity: 1 })}
          className="text-[#4CAF50] text-lg font-bold"
        >
          +
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => removeItem(item.menuItemId)}
          className="text-red-500 text-lg font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}