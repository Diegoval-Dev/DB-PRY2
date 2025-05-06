import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/store/useAuth';

export function useOrder(orderId: string) {
  const { token } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para obtener los datos del pedido
  const fetchOrder = useCallback(async () => {
    if (!orderId || !token) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener el pedido');
      }
      
      const data = await response.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId, token]);

  // Cargar datos inicialmente
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Función refetch para actualizar manualmente los datos
  const refetch = useCallback(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, loading, error, refetch };
}