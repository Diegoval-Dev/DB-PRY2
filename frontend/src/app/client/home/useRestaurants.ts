import { useEffect, useState } from 'react';

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  specialties: string[];
  imageIds?: string[];
}

export function useRestaurants(token: string | null) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(setRestaurants)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return { restaurants, loading, error };
}