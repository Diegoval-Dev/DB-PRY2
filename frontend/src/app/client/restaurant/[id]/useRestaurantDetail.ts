// filepath: frontend/src/app/client/restaurant/[id]/useRestaurantDetail.ts
import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { Console } from 'console';

export function useRestaurantDetail(restaurantId: string) {
  const { token } = useAuth();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !restaurantId) return;
    setLoading(true);
    setError('');

    const headers = { Authorization: `Bearer ${token}` };
    const restaurantUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}`;
    const menuUrl       = `${process.env.NEXT_PUBLIC_API_URL}/api/menu-items?restaurantId=${restaurantId}`;

    Promise.all([
      fetch(restaurantUrl, { headers }).then((res) => res.json()),
      fetch(menuUrl,       { headers }).then((res) => res.json()),
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