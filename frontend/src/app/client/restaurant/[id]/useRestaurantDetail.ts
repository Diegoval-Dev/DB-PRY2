import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  restaurantId: string;
}

interface Restaurant {
  _id: string;
  name: string;
  description?: string;
  address?: string;
  rating?: number;
  imageUrls?: string[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface MenuItemsResponse {
  data: MenuItem[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function useRestaurantDetail(restaurantId: string) {
  const { token } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuPagination, setMenuPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (!token || !restaurantId) return;
    setLoading(true);
    setError('');

    const headers = { Authorization: `Bearer ${token}` };
    const restaurantUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}`;
    const menuUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}/menu?page=${currentPage}&limit=${pageSize}`;

    Promise.all([
      fetch(restaurantUrl, { headers }).then(res => {
        if (!res.ok) throw new Error('Error cargando restaurante');
        return res.json();
      }),
      fetch(menuUrl, { headers }).then(res => {
        if (!res.ok) throw new Error('Error cargando menú');
        return res.json();
      }),
    ])
      .then(([restaurantData, menuResponse]) => {
        setRestaurant(restaurantData);
        setMenuItems(menuResponse.data);
        setMenuPagination({
          page: menuResponse.page,
          limit: menuResponse.limit,
          total: menuResponse.total,
          pages: menuResponse.pages
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [restaurantId, token, currentPage, pageSize]);

  // Funciones de navegación
  const goToNextPage = () => {
    if (menuPagination && currentPage < menuPagination.pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (menuPagination && page >= 1 && page <= menuPagination.pages) {
      setCurrentPage(page);
    }
  };

  const loadMoreItems = () => {
    if (menuPagination && currentPage < menuPagination.pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return { 
    restaurant, 
    menuItems, 
    loading, 
    error, 
    pagination: menuPagination,
    currentPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    loadMoreItems,
    hasMoreItems: menuPagination ? currentPage < menuPagination.pages : false,
    hasPreviousItems: currentPage > 1
  };
}