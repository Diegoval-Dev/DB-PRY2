import { useCart } from '@/store/useCart';

interface Props {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageId?: string;
  };
}

export default function MenuItemCard({ item }: Props) {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-xl border shadow hover:shadow-md p-4 flex flex-col justify-between">
      <div>
        <div className="h-32 bg-gray-100 rounded mb-2" />
        <h3 className="text-lg font-medium text-[#333]">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.description}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-[#FF6F61] font-medium">Q{item.price.toFixed(2)}</span>
        <button
          className="text-sm bg-[#4CAF50] text-white px-3 py-1 rounded hover:bg-green-600"
          onClick={() =>
            addItem({
              menuItemId: item.id,
              name: item.name,
              price: item.price,
              quantity: 1,
            })
          }
        >
          Agregar
        </button>
      </div>
    </div>
  );
}