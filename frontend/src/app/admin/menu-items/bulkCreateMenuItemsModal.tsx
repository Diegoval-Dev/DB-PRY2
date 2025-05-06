'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiAlertCircle, FiUpload, FiCode } from 'react-icons/fi';

interface Props {
  token: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function BulkCreateMenuItemsModal({ token, onClose, onCreated }: Props) {
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jsonInput.trim()) {
      setError('Por favor ingresa un array JSON válido');
      return;
    }

    try {
      const items = JSON.parse(jsonInput);

      if (!Array.isArray(items)) {
        throw new Error('El contenido debe ser un array de objetos');
      }

      setLoading(true);
      setError('');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu-items/bulk`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Error al crear ítems');
      }

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error de formato');
    } finally {
      setLoading(false);
    }
  };

  const exampleJson = JSON.stringify([
    {
      name: "Pizza Margherita",
      price: 79.99,
      description: "Tomate, mozzarella, albahaca",
      category: "Pizzas",
      restaurantId: "id_del_restaurante"
    },
    {
      name: "Ensalada César",
      price: 45.50,
      description: "Lechuga romana, aderezo césar, crutones",
      category: "Ensaladas",
      restaurantId: "id_del_restaurante"
    }
  ], null, 2);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-medium text-gray-900 flex items-center">
            <FiUpload className="mr-2 text-[#FF6F61]" />
            Crear ítems en lote
          </h2>
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
              <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700 mb-1">
                JSON de ítems <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 text-gray-400">
                  <FiCode size={16} />
                </div>
                <textarea
                  id="jsonInput"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={12}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] font-mono text-sm text-gray-700"
                  placeholder={exampleJson}
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Ingresa un array JSON con los elementos que deseas crear. Cada objeto debe contener al menos nombre, precio y restaurantId.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mt-6">
              <div className="flex">
                <div className="flex-shrink-0 text-blue-400">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Formato requerido: <code className="bg-blue-100 px-1 py-0.5 rounded">[{"{name, price, restaurantId, ...}"}]</code>
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
                  Creando...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2" /> Crear ítems
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}