'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function RestaurantReviews({ restaurantId }: { restaurantId: string }) {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
    if (!token || !restaurantId) return;

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/restaurant/${restaurantId}`;

    fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then(setReviews)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));

}, [restaurantId, token]);

  console.log('Reviews:', reviews);

  if (loading) return <p className="mt-6 text-sm">Cargando reseñas...</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (reviews.length === 0) return <p className="mt-6 text-sm text-gray-500">Aún no hay reseñas.</p>;

  return (
    <div className="mt-10 p-5">
      <h2 className="text-lg text-gray-600 font-semibold mb-3">Opiniones de otros clientes</h2>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border p-4 rounded bg-gray-50">
            <p className="text-sm text-[#333] font-medium">{r.userName}</p>
            <p className="text-sm text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
            <p className="text-sm text-gray-600">{r.comment}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}