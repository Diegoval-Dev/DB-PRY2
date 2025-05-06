'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiSave, FiAlertCircle, FiMap, FiMapPin, FiGrid, FiType, FiNavigation } from 'react-icons/fi';

interface Props {
  token: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateRestaurantModal({ token, onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [specialties, setSpecialties] = useState<string>('');
  const [latitude, setLatitude] = useState<number | ''>('');
  const [longitude, setLongitude] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !address || !specialties || latitude === '' || longitude === '') {
      setError('Por favor completa todos los campos obligatorios (*)');
      return;
    }

    const body = {
      name,
      address,
      specialties: specialties.split(',').map(s => s.trim()),
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude as any), parseFloat(latitude as any)],
      },
    };

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onCreated();
        onClose();
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Error al crear el restaurante');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear el restaurante');
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
          <h2 className="text-xl font-medium text-gray-900">Crear nuevo restaurante</h2>
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
            {/* Nombre */}
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
                  placeholder="Nombre del restaurante"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] text-gray-500"
                  required
                />
              </div>
            </div>
            
            {/* Dirección */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiMapPin size={16} />
                </div>
                <input
                  id="address"
                  type="text"
                  placeholder="Dirección completa"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] text-gray-500"
                  required
                />
              </div>
            </div>
            
            {/* Especialidades */}
            <div>
              <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 mb-1">
                Especialidades <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiGrid size={16} />
                </div>
                <input
                  id="specialties"
                  type="text"
                  placeholder="Ej: Italiana, Mariscos, Postres"
                  value={specialties}
                  onChange={e => setSpecialties(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] text-gray-500"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Separadas por comas</p>
            </div>
            
            {/* Coordenadas */}
            <div>
              <label htmlFor="coordinates" className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiMap size={16} />
                  </div>
                  <input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="Latitud"
                    value={latitude}
                    onChange={e => setLatitude(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] text-gray-500"
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiNavigation size={16} />
                  </div>
                  <input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="Longitud"
                    value={longitude}
                    onChange={e => setLongitude(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] text-gray-500"
                    required
                  />
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Coordenadas en formato decimal. Ej: Latitud 14.6349, Longitud -90.5069
              </p>
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
              className="px-4 py-2 bg-[#FF6F61] border border-transparent rounded-md font-medium text-white hover:bg-[#e95d53] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6F61] disabled:opacity-70 flex items-center"
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
                  <FiSave className="mr-2" /> Crear restaurante
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}