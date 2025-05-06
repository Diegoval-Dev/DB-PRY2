'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { FiPackage, FiClock, FiMapPin, FiFilter, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

type OrderStatus = 'pendiente' | 'en_curso' | 'entregado' | 'all';

export default function DeliveryHomePage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<OrderStatus>('all');
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar los pedidos');
        return res.json();
      })
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Filtrar pedidos basados en el estado seleccionado
  const filteredOrders = activeFilter === 'all' 
    ? orders.filter(order => ['pendiente', 'en_curso', 'entregado'].includes(order.status))
    : orders.filter(order => order.status === activeFilter);

  // Función para obtener el color y el icono según el estado
  const getStatusDetails = (status: string) => {
    switch(status) {
      case 'pendiente':
        return { color: 'text-yellow-600 bg-yellow-100', icon: <FiClock className="mr-1" /> };
      case 'en_curso':
        return { color: 'text-blue-600 bg-blue-100', icon: <FiMapPin className="mr-1" /> };
      case 'entregado':
        return { color: 'text-green-600 bg-green-100', icon: <FiCheckCircle className="mr-1" /> };
      default:
        return { color: 'text-gray-600 bg-gray-100', icon: <FiPackage className="mr-1" /> };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6F61] to-[#FF9671] text-white">
        <div className="container mx-auto px-6 py-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div>
              <h1 className="text-2xl font-bold">Panel de Repartidor</h1>
              <p className="text-white/80 mt-1">
                {user?.name ? `Hola, ${user.name.split(' ')[0]}` : 'Bienvenido'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <FiFilter className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Filtrar por estado</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-[#FF6F61] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('pendiente')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'pendiente' 
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setActiveFilter('en_curso')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'en_curso' 
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              En curso
            </button>
            <button
              onClick={() => setActiveFilter('entregado')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'entregado' 
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Entregados
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6F61] mb-4"></div>
            <p className="text-gray-600">Cargando pedidos...</p>
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

        {/* No orders */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {activeFilter === 'all' 
                ? 'No tienes pedidos asignados' 
                : `No tienes pedidos ${activeFilter.replace('_', ' ')}`
              }
            </h3>
            <p className="text-gray-500">
              Los pedidos aparecerán aquí cuando te sean asignados
            </p>
          </div>
        )}

        {/* Orders grid */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order, index) => {
              const statusDetails = getStatusDetails(order.status);
              
              return (
                <motion.div
                  key={order.id || order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/repartidor/pedido/${order.id || order._id}`)}
                >
                  <div className="p-4 border-l-4 border-[#FF6F61]">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <FiPackage className="text-[#FF6F61] mr-2" />
                        <h3 className="font-medium text-gray-500">
                          Pedido #{String(order.id || order._id).substring(0, 8)}
                        </h3>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full inline-flex items-center ${statusDetails.color}`}>
                        {statusDetails.icon}
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-700">Fecha</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date || order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-700">Hora</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date || order.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <FiDollarSign className="text-gray-500 mr-1" />
                        <span className="font-medium text-gray-500">Q{order.total.toFixed(2)}</span>
                      </div>
                      
                      <div className="text-sm text-blue-600">
                        {order.status === 'pendiente' && 'Tomar pedido'}
                        {order.status === 'en_curso' && 'Continuar entrega'}
                        {order.status === 'entregado' && 'Ver detalles'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}