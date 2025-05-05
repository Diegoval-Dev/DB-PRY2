'use client';

import { useParams } from 'next/navigation';
import { useRestaurantDetail } from './useRestaurantDetail';
import RestaurantHero from './RestaurantHero';
import MenuItemCard from './MenuItemCard';
import CategoryTabs from './CategoryTabs';
import { useState } from 'react';
import RestaurantReviews from './RestaurantReviews';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { restaurant, menuItems, loading, error } = useRestaurantDetail(id as string);

  if (loading) return <p className="p-8">Cargando...</p>;
  if (error) return <p className="text-red-500 p-8">{error}</p>;
  if (!restaurant) return null;

  const categories = Array.from(new Set(menuItems.map((item) => item.category)));
  const filteredItems = activeCategory
    ? menuItems.filter((item) => item.category === activeCategory)
    : menuItems;

  return (
    <div className="pb-32 bg-white min-h-screen">
      <RestaurantHero restaurant={restaurant} />
      <div className="px-6 pt-4">
        <CategoryTabs
          items={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item._id} item={item} restaurantId={restaurant._id} />
          ))}
        </div>
      </div>
      <RestaurantReviews restaurantId={restaurant._id} />
    </div>
  );
}