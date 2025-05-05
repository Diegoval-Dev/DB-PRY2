'use client';

import { useEffect } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { useRestaurants } from './useRestaurants';
import RestaurantCard from './RestaurantCard';
import Link from 'next/link';

export default function ClientHomePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const { restaurants, loading, error } = useRestaurants(token);

  console.log(restaurants)

  useEffect(() => {
    if (!user || user.role !== 'cliente') {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <h1 className="text-2xl font-medium mb-6 text-[#333]">Restaurantes disponibles</h1>

      {loading && <p>Cargando restaurantes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {restaurants.map((r) => (
          <RestaurantCard key={r._id} restaurant={r} />
        ))}
      </div>
    </div>
  );
}