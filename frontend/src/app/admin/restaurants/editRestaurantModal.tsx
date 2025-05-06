'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiSave, FiAlertCircle, FiMapPin, FiHome, FiTag } from 'react-icons/fi';

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  specialties?: string[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface Props {
  token: string;
  restaurantId: string;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditRestaurantModal({ token, restaurantId, onClose, onUpdated }: Props) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Error al cargar restaurante');
        const data = await res.json();
        setRestaurant(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar restaurante');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId, token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(restaurant)
      });

      if (!res.ok) throw new Error('Error al actualizar restaurante');
      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar restaurante');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]">
        <motion.div className="bg-white rounded-lg shadow-xl p-6 text-center w-full max-w-lg">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[#FF6F61] rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del restaurante...</p>
        </motion.div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]">
        <motion.div className="bg-white rounded-lg shadow-xl p-6 text-center w-full max-w-lg">
          <FiAlertCircle className="mx-auto text-red-500 text-4xl mb-4" />
          <p className="text-red-500 font-medium">No se pudo cargar el restaurante</p>
          <button onClick={onClose} className="mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            Cerrar
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]">
      <motion.div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-medium text-gray-900">Editar Restaurante</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-5">
          {error && (
            <motion.div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
              <div className="flex">
                <FiAlertCircle className="text-red-400 mt-1 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <div className="relative">
              <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={restaurant.name}
                onChange={e => setRestaurant({ ...restaurant, name: e.target.value })}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={restaurant.address}
                onChange={e => setRestaurant({ ...restaurant, address: e.target.value })}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Especialidades (separadas por coma)</label>
            <div className="relative">
              <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={restaurant.specialties?.join(', ') || ''}
                onChange={e => setRestaurant({
                  ...restaurant,
                  specialties: e.target.value.split(',').map(s => s.trim())
                })}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitud *</label>
              <input
                type="number"
                step="any"
                value={restaurant.location?.coordinates[1] ?? ''}
                onChange={e =>
                  setRestaurant({
                    ...restaurant,
                    location: {
                      type: 'Point',
                      coordinates: [
                        restaurant.location?.coordinates[0] ?? 0,
                        parseFloat(e.target.value)
                      ]
                    }
                  })
                }
                className="w-full rounded-md border border-gray-300 py-2 px-3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitud *</label>
              <input
                type="number"
                step="any"
                value={restaurant.location?.coordinates[0] ?? ''}
                onChange={e =>
                  setRestaurant({
                    ...restaurant,
                    location: {
                      type: 'Point',
                      coordinates: [
                        parseFloat(e.target.value),
                        restaurant.location?.coordinates[1] ?? 0
                      ]
                    }
                  })
                }
                className="w-full rounded-md border border-gray-300 py-2 px-3"
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#FF6F61] text-white rounded-md hover:bg-[#e95d53] flex items-center"
            >
              {saving ? (
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" d="M4 12a8 8 0 018-8v8H4z" fill="currentColor"></path>
                </svg>
              ) : (
                <FiSave className="mr-2" />
              )}
              Guardar cambios
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}