'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { useRestaurants } from './useRestaurants';
import RestaurantCard from './RestaurantCard';
import { FiClock, FiSearch, FiMessageCircle, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ClientHomePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const { restaurants, loading, error } = useRestaurants(token);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar restaurantes basados en la búsqueda
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!user || user.role !== 'cliente') {
      router.push('/login');
    }
  }, [user, router]);

  // Función para obtener el saludo según la hora del día
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  // Renderizar skeletons durante la carga
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="h-40 bg-gray-200 animate-pulse"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="mt-4 flex items-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-[#FF6F61] to-[#FF9671] text-white">
        <div className="container mx-auto px-6 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-center"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {getGreeting()}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              </h1>
              <p className="text-lg opacity-90">
                ¿Qué te gustaría comer hoy?
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex space-x-2">
              <button 
                onClick={() => router.push('/client/history')}
                className="inline-flex items-center px-4 py-2 bg-white text-[#FF6F61] font-medium rounded-md hover:bg-gray-100 transition-colors shadow-sm"
              >
                <FiClock className="mr-2" /> Mis pedidos
              </button>
            </div>
          </motion.div>
          
          {/* Search bar */}
          <div className="mt-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar restaurantes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 bg-red-50 px-4 pl-10 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF9671] text-gray-800"
              />
              <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        {/* Featured section */}
        {restaurants.length > 0 && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiStar className="mr-2 text-yellow-500" /> Restaurantes destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {restaurants.slice(0, 2).map((restaurant) => (
                <div key={restaurant._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="h-40 bg-gray-200 relative">
                    {restaurant.imageUrls && (
                      <img 
                        src={restaurant.imageUrls[0]} 
                        alt={restaurant.name} 
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-xl font-semibold text-white">{restaurant.name}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 line-clamp-2">{restaurant.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">⭐ {restaurant.rating || '4.5'}</span>
                      <button 
                        onClick={() => router.push(`/client/restaurant/${restaurant._id}`)}
                        className="px-4 py-2 bg-[#FF6F61] hover:bg-[#e86559] text-white rounded-md transition-colors"
                      >
                        Ver menú
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* All restaurants */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Todos los restaurantes</h2>
          
          {loading && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {renderSkeletons()}
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
              <button 
                className="mt-2 text-sm font-medium text-red-700 underline"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </button>
            </div>
          )}
          
          {!loading && filteredRestaurants.length === 0 && (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-xl font-medium text-gray-700">No se encontraron restaurantes</h3>
              <p className="text-gray-500 mt-2">Intenta con otra búsqueda</p>
            </div>
          )}

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {filteredRestaurants.map((restaurant) => (
              <motion.div
                key={restaurant._id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}