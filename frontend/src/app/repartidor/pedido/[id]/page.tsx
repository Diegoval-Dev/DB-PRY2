'use client';

import { useParams, useRouter } from 'next/navigation';
import { useOrder } from '../../../client/track/useOrder';
import MapView from '../../../client/track/MapView';
import { useAuth } from '@/store/useAuth';
import { useState } from 'react';
import { FiPackage, FiMapPin, FiCalendar, FiDollarSign, FiClock, FiArrowLeft, FiCheckCircle, FiTruck, FiUser, FiMap } from 'react-icons/fi';
import { motion } from 'framer-motion';

type OrderStatus = 'pendiente' | 'en_curso' | 'entregado' | 'cancelado';

const ORDER_STATUSES: { [key in OrderStatus]: { label: string; color: string; icon: JSX.Element } } = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-500', icon: <FiClock /> },
  en_curso: { label: 'En camino', color: 'bg-blue-500', icon: <FiTruck /> },
  entregado: { label: 'Entregado', color: 'bg-green-500', icon: <FiCheckCircle /> },
  cancelado: { label: 'Cancelado', color: 'bg-red-500', icon: <FiPackage /> }
};

export default function DeliveryOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, user } = useAuth();
  const { order, loading, error, refetch } = useOrder(id as string);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState('');
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);

  const updateOrderStatus = async (status: OrderStatus) => {
    setUpdatingStatus(true);
    setStatusUpdateError('');
    setStatusUpdateSuccess('');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Error al actualizar el estado del pedido');
      }

      setStatusUpdateSuccess(`Pedido actualizado a: ${ORDER_STATUSES[status].label}`);
      refetch(); 
      
      if (status === 'entregado') {
        // Set a timeout to redirect back to home after successful delivery
        setTimeout(() => {
          router.push('/repartidor/home');
        }, 2000);
      }
    } catch (err: any) {
      setStatusUpdateError(err.message || 'Error al actualizar el pedido');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 max-w-md w-full bg-white rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6F61] mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando información del pedido...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-red-500 mb-4">⚠️ Error: {error}</div>
        <button
          onClick={() => router.push('/repartidor/home')}
          className="px-4 py-2 bg-[#FF6F61] text-white rounded-md hover:bg-[#e95d53]"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
  
  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6F61] to-[#FF9671] text-white">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/repartidor/home')}
                className="mr-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Volver"
              >
                <FiArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold">Detalles del Pedido</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                Pedido #{id?.substring(0, 8)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order details */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6 mb-6"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiPackage className="mr-2 text-[#FF6F61]" /> Información del Pedido
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-500 mr-3">
                    <FiCalendar />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fecha</p>
                    <p className="text-sm font-medium text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-purple-100 text-purple-500 mr-3">
                    <FiClock />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Hora</p>
                    <p className="text-sm font-medium text-gray-500">
                      {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-green-100 text-green-500 mr-3">
                    <FiDollarSign />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-sm font-medium text-gray-500">Q{order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <FiUser className="mr-2 text-gray-500" /> Cliente
                </h3>
                <p className="text-sm text-gray-600">{order.userName || 'Cliente'}</p>
                <p className="text-sm text-gray-600">{order.userContact || 'Sin contacto'}</p>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <FiMap className="mr-2 text-gray-500" /> Dirección de entrega
                </h3>
                <p className="text-sm text-gray-600">{order.deliveryAddress || 'Sin dirección específica'}</p>
              </div>
              
              {order.items && order.items.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Productos ({order.items.length})</h3>
                  <ul className="space-y-2 text-sm">
                    {order.items.map((item: any, index: number) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.quantity || 1}x {item.name}</span>
                        <span className="text-gray-500">Q --</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Current status */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 mb-6"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Estado Actual
              </h2>
              
              <div className="flex items-center">
                {order.status && ORDER_STATUSES[order.status as OrderStatus] ? (
                  <>
                    <div className={`w-3 h-3 rounded-full mr-2 ${ORDER_STATUSES[order.status as OrderStatus].color}`}></div>
                    <span className="font-medium text-gray-500">
                      {ORDER_STATUSES[order.status as OrderStatus].label}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">Estado desconocido</span>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Actualizar estado:</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {Object.entries(ORDER_STATUSES).map(([status, details]) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status as OrderStatus)}
                      disabled={updatingStatus || status === order.status}
                      className={`flex flex-col items-center justify-center p-3 rounded-md transition-colors ${
                        selectedStatus === status 
                          ? 'ring-2 ring-[#FF6F61] bg-[#FF6F61]/10 text-gray-700' 
                          : status === order.status
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'border border-gray-200 hover:bg-gray-50 text-gray-500'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        selectedStatus === status || status === order.status
                          ? details.color + '/30 text-' + details.color.replace('bg-', '')
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {details.icon}
                      </div>
                      <span className="text-xs mt-1">{details.label}</span>
                    </button>
                  ))}
                </div>
                
                {statusUpdateError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
                    {statusUpdateError}
                  </div>
                )}
                
                {statusUpdateSuccess && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-4">
                    {statusUpdateSuccess}
                  </div>
                )}
                
                <button
                  onClick={() => selectedStatus && updateOrderStatus(selectedStatus)}
                  disabled={updatingStatus || !selectedStatus || selectedStatus === order.status}
                  className={`w-full py-3 rounded-md font-medium text-white transition-colors ${
                    selectedStatus && selectedStatus !== order.status && !updatingStatus
                      ? 'bg-[#FF6F61] hover:bg-[#e95d53]'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {updatingStatus ? 'Actualizando...' : 'Confirmar cambio de estado'}
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Map */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiMapPin className="mr-2 text-[#FF6F61]" /> Ubicación de entrega
            </h2>
            <div className="h-96">
              <MapView />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}