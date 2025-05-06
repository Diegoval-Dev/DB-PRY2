import { useEffect, useState } from 'react';

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  description?: string;
  rating?: number;
  specialties?: string[];
  imageUrls?: string[];
  imageIds?: string[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface RestaurantsResponse {
  data: Restaurant[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function useRestaurants(token: string | null, page = 1, limit = 10) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  useEffect(() => {
    if (!token) return;
    
    setLoading(true);

    // Construir URL con parámetros de paginación
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('sortBy', 'name');
    url.searchParams.append('sortDir', 'asc');
    
    fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((response: RestaurantsResponse) => {
        setRestaurants(response.data);
        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
          pages: response.pages
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, page, limit]); // Añadir page y limit como dependencias

  return { restaurants, loading, error, pagination };
}