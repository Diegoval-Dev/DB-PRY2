'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { FiPackage, FiArrowLeft, FiClock, FiDollarSign, FiCalendar, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function OrderHistoryPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!user?.id || !token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user?.id, token]);

  // Función para obtener el color según el estado
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'entregado':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'en_camino':
      case 'on_the_way':
        return 'bg-blue-100 text-blue-800';
      case 'preparando':
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#FF6F61] to-[#FF9671] text-white">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Mis Pedidos</h1>
              <button 
                onClick={() => router.push('/client/home')}
                className="inline-flex items-center px-4 py-2 bg-white text-[#FF6F61] font-medium rounded-md hover:bg-gray-100 transition-colors shadow-sm"
              >
                <FiArrowLeft className="mr-2" /> Volver al inicio
              </button>
            </div>
            <p className="mt-2 opacity-90">Historial completo de todos tus pedidos</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6F61] mb-4"></div>
            <p className="text-gray-600">Cargando tu historial de pedidos...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-medium">Error al cargar los pedidos</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              className="mt-3 text-sm font-medium text-red-700 underline"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">🛍️</div>
            <h3 className="text-xl font-medium text-gray-700">No tienes pedidos aún</h3>
            <p className="text-gray-500 mt-2">¿Que tal si pruebas alguno de nuestros restaurantes?</p>
            <button 
              onClick={() => router.push('/client/home')}
              className="mt-6 inline-flex items-center px-4 py-2 bg-[#FF6F61] text-white font-medium rounded-md hover:bg-[#e86559] transition-colors shadow-sm"
            >
              Explorar restaurantes
            </button>
          </motion.div>
        )}

        {/* Orders list */}
        {!loading && !error && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {orders.map((order, index) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="border-l-4 border-[#FF6F61] p-5">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <div className="flex items-center mb-2">
                        <FiPackage className="text-gray-500 mr-2" />
                        <span className="text-lg font-medium text-gray-800">Pedido #{order._id?.substring(0, 8)}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        <div className="flex items-center">
                          <FiCalendar className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString('es', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center">
                          <FiClock className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{new Date(order.date).toLocaleTimeString('es', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </div>
                        <div className="flex items-center">
                          <FiDollarSign className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">Q{order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <button
                        onClick={() => router.push(`/client/track?id=${order._id}`)}
                        className="inline-flex items-center px-4 py-2 bg-[#FF6F61] text-white rounded-md hover:bg-[#e86559] transition-colors text-sm font-medium"
                      >
                        <FiMapPin className="mr-1.5" /> Seguir pedido
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}