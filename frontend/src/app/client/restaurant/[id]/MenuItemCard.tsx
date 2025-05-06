import { useCart } from '@/store/useCart';
import Image from 'next/image';

interface Props {
  item: {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageId?: string;
    imageUrl?: string;
  };
  restaurantId: string;
}

export default function MenuItemCard({ item, restaurantId }: Props) {
  const { addItem } = useCart();
  const hasImage = !!item.imageUrl;

  return (
    <div className="bg-white rounded-xl border shadow hover:shadow-md p-4 flex flex-col justify-between">
      <div>
        <div className="h-32 bg-gray-100 rounded mb-2 overflow-hidden relative">
          {hasImage ? (
            <Image
              src={item.imageUrl!}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <span className="text-gray-400 text-sm">Sin imagen</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-medium text-[#333]">{item.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-[#FF6F61] font-medium">Q{item.price.toFixed(2)}</span>
        <button
          className="text-sm bg-[#FF6F61] text-white px-3 py-1 rounded hover:bg-[#de6054] transition-colors"
          onClick={() =>
            addItem({
              menuItemId: item._id,
              restaurantId,
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