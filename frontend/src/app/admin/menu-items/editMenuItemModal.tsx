'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiSave, FiAlertCircle, FiDollarSign, FiGrid, FiFileText, FiType, FiHome } from 'react-icons/fi';

interface Restaurant {
  _id: string;
  name: string;
}

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  restaurantId: string;
}

interface Props {
  token: string;
  itemId: string;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditMenuItemModal({ token, itemId, onClose, onUpdated }: Props) {
  const [item, setItem] = useState<MenuItem | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemRes, restRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu-items/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(r => {
            if (!r.ok) throw new Error('Error al cargar el ítem');
            return r.json();
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(r => {
            if (!r.ok) throw new Error('Error al cargar restaurantes');
            return r.json();
          })
        ]);

        setItem(itemRes);
        
        // Extraer el array de restaurants desde la respuesta paginada
        if (restRes && Array.isArray(restRes.data)) {
          setRestaurants(restRes.data);
        } else {
          throw new Error('Formato de respuesta de restaurantes inválido');
        }
      } catch (err: any) {
        setError(err.message || 'Error cargando datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId, token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!item) return;
    if (!item.name || !item.price || !item.restaurantId) {
      setError('Por favor completa todos los campos obligatorios (*)');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu-items/${itemId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al actualizar');
      }

      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el ítem');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6F61] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del ítem...</p>
        </motion.div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 text-center"
        >
          <FiAlertCircle className="mx-auto text-red-500 text-4xl mb-4" />
          <p className="text-red-500 font-medium">No se pudo cargar el ítem</p>
          <button 
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-medium text-gray-900">Editar ítem de menú</h2>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleUpdate} className="p-6">
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
                  value={item.name}
                  onChange={e => setItem({ ...item, name: e.target.value })}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61 text-gray-600"
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
                  value={item.description || ''}
                  onChange={e => setItem({ ...item, description: e.target.value })}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] text-gray-600"
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
                    value={item.price}
                    onChange={e => setItem({ ...item, price: parseFloat(e.target.value) })}
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] text-gray-600"
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
                    value={item.category || ''}
                    onChange={e => setItem({ ...item, category: e.target.value })}
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] text-gray-600"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="restaurant" className="block text-sm font-medium text-gray-700 mb-1">
                Restaurante <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiHome size={16} />
                </div>
                <select
                  id="restaurant"
                  value={item.restaurantId}
                  onChange={e => setItem({ ...item, restaurantId: e.target.value })}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] bg-white text-gray-600"
                  required
                >
                  <option value="">Selecciona un restaurante</option>
                  {restaurants.map((r) => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#FF6F61] border border-transparent rounded-md font-medium text-white hover:bg-[#e95d53] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6F61] disabled:opacity-70 flex items-center"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Actualizar ítem
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}