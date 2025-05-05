interface Props {
    restaurant: {
      id: string;
      name: string;
      address: string;
      specialties: string[];
      imageIds?: string[];
    };
  }
  
  export default function RestaurantCard({ restaurant }: Props) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition">
        <div className="h-40 bg-gray-200" />
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