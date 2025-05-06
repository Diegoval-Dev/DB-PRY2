'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Props {
  restaurant: {
    _id: string;
    name: string;
    address: string;
    specialties: string[];
    imageIds?: string[];
    imageUrls?: string[];
  };
}

export default function RestaurantCard({ restaurant }: Props) {
  const router = useRouter();
  const hasImage = restaurant.imageUrls && restaurant.imageUrls.length > 0;

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition cursor-pointer"
      onClick={() => router.push(`/client/restaurant/${restaurant._id}`)}
    >
      <div className="h-40 bg-gray-200 relative">
        {hasImage ? (
          <Image
            src={(restaurant.imageUrls?.[0] ?? '')}
            alt={restaurant.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-gray-400">No imagen disponible</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-[#333]">{restaurant.name}</h3>
        <p className="text-sm text-gray-500">{restaurant.address}</p>
        <div className="text-sm mt-2 text-[#FF6F61]">
          {restaurant.specialties.join(', ')}
        </div>
      </div>
    </div>
  );
}