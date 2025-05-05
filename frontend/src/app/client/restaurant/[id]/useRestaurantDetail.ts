import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';

export function useRestaurantDetail(restaurantId: string) {
  const { token } = useAuth();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !restaurantId) return;

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((list) => list.find((r: any) => r.id === restaurantId)),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu-items?restaurantId=${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(([r, m]) => {
        setRestaurant(r);
        setMenuItems(m);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [restaurantId, token]);

  return { restaurant, menuItems, loading, error };
}