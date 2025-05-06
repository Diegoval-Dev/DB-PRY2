'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/store/useAuth';
import { motion } from 'framer-motion';
import { FiX, FiSave, FiAlertCircle, FiDollarSign, FiGrid, FiFileText, FiType, FiHome } from 'react-icons/fi';

interface Restaurant {
  _id: string;
  name: string;
}

export default function CreateMenuItemModal({ onClose, onCreated }: {
  onClose: () => void;
  onCreated: (item: any) => void;
}) {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    
    setLoadingRestaurants(true);
    setError('');
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error cargando restaurantes');
        return res.json();
      })
      .then(response => {
        // Extraer el array desde response.data
        if (response && Array.isArray(response.data)) {
          setRestaurants(response.data);
          // Auto-select first restaurant if available
          if (response.data.length > 0) {
            setRestaurantId(response.data[0]._id);
          }
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      })
      .catch(err => {
        console.error('Error fetching restaurants:', err);
        setError('No se pudieron cargar los restaurantes');
      })
      .finally(() => setLoadingRestaurants(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !restaurantId) {
      setError('Por favor completa todos los campos obligatorios (*)');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu-items`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, price, category, restaurantId }),
      });

      if (res.ok) {
        const newItem = await res.json();
        onCreated(newItem);
        onClose();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear ítem');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear ítem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-medium text-gray-900">Crear ítem de menú</h2>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiType size={16} />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="Nombre del ítem"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] text-gray-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiFileText size={16} />
                </div>
                <textarea
                  id="description"
                  placeholder="Descripción del ítem"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] text-gray-500"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Precio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiDollarSign size={16} />
                  </div>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] text-gray-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiGrid size={16} />
                  </div>
                  <input
                    id="category"
                    type="text"
                    placeholder="Ej: Desayunos, Postres..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] text-gray-500"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="restaurant" className="block text-sm font-medium text-gray-700 mb-1">
                Restaurante <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FiHome size={16} />
                </div>
                {loadingRestaurants ? (
                  <div className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 bg-gray-50 text-gray-500">
                    Cargando restaurantes...
                  </div>
                ) : (
                  <select
                    id="restaurant"
                    value={restaurantId}
                    onChange={(e) => setRestaurantId(e.target.value)}
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] bg-white text-gray-500"
                    required
                  >
                    <option value="">Selecciona un restaurante</option>
                    {restaurants.map((r) => (
                      <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#FF6F61] border border-transparent rounded-md font-medium text-white hover:bg-[#e95d53] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6F61] disabled:opacity-70 flex items-center "
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Guardar ítem
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}