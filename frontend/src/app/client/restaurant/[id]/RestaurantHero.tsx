export default function RestaurantHero({ restaurant }: { restaurant: any }) {
    return (
      <div className="relative h-48 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-semibold">{restaurant.name}</h2>
          <p className="text-sm">{restaurant.specialties.join(', ')}</p>
          <p className="text-sm">{restaurant.address}</p>
        </div>
      </div>
    );
  }