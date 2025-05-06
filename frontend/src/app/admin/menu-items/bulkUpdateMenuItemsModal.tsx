'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiAlertCircle, FiDatabase, FiFilter, FiEdit, FiDollarSign, FiTag } from 'react-icons/fi';

interface Props {
  token: string;
  onClose: () => void;
  onUpdated: () => void;
}

export default function BulkUpdateMenuItemsModal({ token, onClose, onUpdated }: Props) {
  const [field, setField] = useState<'category' | 'price'>('category');
  const [filterCategory, setFilterCategory] = useState('');
  const [newValue, setNewValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBulkUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newValue) {
      setError('Por favor ingresa un valor para aplicar');
      return;
    }
    
    if (!token) return;

    setLoading(true);
    setError('');

    const update: any = {};
    if (field === 'price') {
      const parsed = parseFloat(newValue);
      if (isNaN(parsed) || parsed <= 0) {
        setError('El precio debe ser un número válido y positivo');
        setLoading(false);
        return;
      }
      update.price = parsed;
    } else {
      update.category = newValue;
    }

    const body = {
      filter: filterCategory ? { category: filterCategory } : {},
      update
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu-items/bulk`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Error al aplicar los cambios');
      }

      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al aplicar los cambios');
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
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-medium text-gray-900 flex items-center">
            <FiDatabase className="mr-2 text-[#FF6F61]" />
            Actualización masiva
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleBulkUpdate} className="p-6">
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
              <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-1">
                Campo a modificar <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FiEdit size={16} />
                </div>
                <select
                  id="field"
                  value={field}
                  onChange={(e) => setField(e.target.value as 'category' | 'price')}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] bg-white appearance-none text-gray-500"
                >
                  <option value="category">Categoría</option>
                  <option value="price">Precio</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por categoría <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiFilter size={16} />
                </div>
                <input
                  id="filterCategory"
                  type="text"
                  placeholder="Ej: Postres, Bebidas..."
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] text-gray-500"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Deja este campo vacío para aplicar a todos los ítems
              </p>
            </div>
            
            <div>
              <label htmlFor="newValue" className="block text-sm font-medium text-gray-700 mb-1">
                Nuevo valor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  {field === 'price' ? <FiDollarSign size={16} /> : <FiTag size={16} />}
                </div>
                <input
                  id="newValue"
                  type={field === 'price' ? 'number' : 'text'}
                  step={field === 'price' ? '0.01' : undefined}
                  min={field === 'price' ? '0' : undefined}
                  placeholder={field === 'price' ? 'Ej: 25.00' : 'Ej: Desayunos'}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] text-gray-500"
                  required
                />
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700">
                    Esta acción actualizará múltiples elementos del menú. 
                    {filterCategory 
                      ? ` Solo se modificarán los ítems de la categoría "${filterCategory}".`
                      : ' Se aplicará a todos los ítems del menú.'}
                  </p>
                </div>
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
              className="px-4 py-2 bg-[#FF6F61] border border-transparent rounded-md font-medium text-white hover:bg-[#e95d53] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6F61] disabled:opacity-70 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Aplicando...
                </>
              ) : (
                <>
                  Aplicar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}