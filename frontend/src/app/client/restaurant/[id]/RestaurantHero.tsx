import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiStar, FiClock } from 'react-icons/fi';

export default function RestaurantHero({ restaurant }: { restaurant: any }) {
  return (
    <div className="relative h-64 bg-gray-200 overflow-hidden">
      {restaurant.image ? (
        <Image 
          src={restaurant.image} 
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6F61] to-[#FF9671]" />
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Restaurant info */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          
          <h1 className="text-3xl font-bold mb-1 drop-shadow-sm">{restaurant.name}</h1>
          
          <div className="flex flex-wrap items-center text-sm space-x-4 mb-1">
            {restaurant.rating && (
              <div className="flex items-center">
                <FiStar className="text-yellow-400 mr-1" />
                <span>{restaurant.rating}</span>
              </div>
            )}
            
            {restaurant.specialties && restaurant.specialties.length > 0 && (
              <span className="line-clamp-1">{restaurant.specialties.join(', ')}</span>
            )}
            
            {restaurant.address && (
              <span className="opacity-90">{restaurant.address}</span>
            )}
          </div>
          
          {restaurant.openingHours && (
            <div className="flex items-center text-xs text-white/80 mt-1">
              <FiClock className="mr-1" />
              <span>{restaurant.openingHours}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}