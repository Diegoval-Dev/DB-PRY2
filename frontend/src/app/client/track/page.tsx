'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useOrder } from './useOrder';
import OrderStatusSteps from './OrderStatusSteps';
import MapView from './MapView';
import { FiPackage, FiCalendar, FiDollarSign, FiClock, FiHome, FiArrowLeft } from 'react-icons/fi';
import ReviewModal from './ReviewModal';
import { useState } from 'react';

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const router = useRouter();
  const [showReview, setShowReview] = useState(false);

  const { order, loading, error } = useOrder(orderId || '');

  if (!orderId) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg text-center">
        <p className="text-xl text-gray-600">No se proporcionó un ID de pedido.</p>
        <button 
          onClick={() => router.push('/client/home')}
          className="mt-4 inline-flex items-center px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors"
        >
          <FiHome className="mr-2" /> Ir a Inicio
        </button>
      </div>
    </div>
  );
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando información del pedido...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => router.push('/client/home')}
          className="mt-4 inline-flex items-center px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors"
        >
          <FiHome className="mr-2" /> Ir a Inicio
        </button>
      </div>
    </div>
  );
  
  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Navigation button */}
        <button 
          onClick={() => router.push('/client/home')}
          className="mb-4 inline-flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <FiArrowLeft className="mr-2" /> Volver al inicio
        </button>
        
        {/* Header with order info */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#FF6F61] p-6 text-white">
            <h1 className="text-2xl font-bold">Seguimiento de tu pedido</h1>
            <div className="flex items-center mt-2">
              <FiPackage className="mr-2" />
              <p className="font-medium">Pedido #{orderId}</p>
            </div>
          </div>
          
          {/* Status steps */}
          <div className="p-6">
            <OrderStatusSteps status={order.status} />
          </div>
        </div>
        
        {/* Map */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Ubicación en tiempo real</h2>
          <div className="h-80"> {/* Increased height for better visibility */}
            <MapView />
          </div>
        </div>
        
        {/* Order details */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Detalles del pedido</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <FiDollarSign className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-semibold text-gray-500">Q{order.total.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                <FiClock className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className="font-semibold text-gray-500 capitalize">{order.status.replace(/_/g, ' ').toLowerCase()}</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                <FiCalendar className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-semibold text-gray-500">{new Date(order.date).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Botón para calificar restaurante (solo aparece cuando el pedido está entregado) */}
        {order.status === 'entregado' && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowReview(true)}
              className="bg-[#FF6F61] text-white px-4 py-2 rounded hover:bg-[#e95d53]"
            >
              Calificar restaurante
            </button>
          </div>
        )}
        
        {/* Modal de revisión (aparece cuando showReview es true) */}
        {showReview && (
          <ReviewModal
            orderId={order.id}
            restaurantId={order.restaurantId}
            onClose={() => setShowReview(false)}
          />
        )}
      </div>
    </div>
  );
}