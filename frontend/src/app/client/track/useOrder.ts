import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';

export function useOrder(orderId: string) {
  const { token } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId || !token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId, token]);

  return { order, loading, error };
}