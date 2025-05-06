'use client';

import { useParams } from 'next/navigation';
import { useRestaurantDetail } from './useRestaurantDetail';
import RestaurantHero from './RestaurantHero';
import MenuItemCard from './MenuItemCard';
import CategoryTabs from './CategoryTabs';
import { useState, useEffect } from 'react';
import RestaurantReviews from './RestaurantReviews';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { 
    restaurant, 
    menuItems, 
    loading, 
    error, 
    pagination,
    currentPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    hasMoreItems,
    hasPreviousItems
  } = useRestaurantDetail(id as string);

  // Estado para almacenar categorías
  const [categories, setCategories] = useState<string[]>([]);
  
  // Calcular categorías cuando cambien los ítems del menú
  useEffect(() => {
    if (menuItems.length > 0) {
      const uniqueCategories = Array.from(
        new Set(menuItems.filter(item => item.category).map(item => item.category!))
      );
      setCategories(uniqueCategories);
    }
  }, [menuItems]);
  
  const filteredItems = activeCategory
    ? menuItems.filter((item) => item.category === activeCategory)
    : menuItems;

  // Componente de controles de paginación
  const PaginationControls = () => (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button 
        onClick={goToPreviousPage} 
        disabled={!hasPreviousItems}
        className={`p-2 rounded-md ${!hasPreviousItems ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        aria-label="Página anterior"
      >
        <FiChevronLeft size={20} />
      </button>
      
      {/* Mostrar números de página */}
      {pagination && Array.from({ length: pagination.pages }, (_, i) => i + 1)
        .filter(page => {
          // Mostrar primera página, última página, página actual y páginas adyacentes
          return page === 1 || page === pagination.pages || 
                 Math.abs(page - currentPage) <= 1;
        })
        .map((page, index, array) => {
          // Si hay un salto entre páginas, mostrar puntos suspensivos
          if (index > 0 && page - array[index - 1] > 1) {
            return (
              <span key={`ellipsis-${page}`} className="px-2 py-1 text-gray-500">...</span>
            );
          }
          
          return (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-8 h-8 rounded-full ${page === currentPage 
                ? 'bg-[#FF6F61] text-white' 
                : 'text-gray-700 hover:bg-gray-100'}`}
              aria-label={`Ir a página ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
        
      <button 
        onClick={goToNextPage} 
        disabled={!hasMoreItems}
        className={`p-2 rounded-md ${!hasMoreItems ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        aria-label="Página siguiente"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );

  if (loading && menuItems.length === 0) return <p className="p-8">Cargando...</p>;
  if (error) return <p className="text-red-500 p-8">{error}</p>;
  if (!restaurant) return null;

  return (
    <div className="pb-32 bg-white min-h-screen">
      <RestaurantHero restaurant={restaurant} />
      <div className="px-6 pt-4">
        <CategoryTabs
          items={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {/* Mostrar mensaje cuando no hay ítems */}
        {filteredItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No se encontraron elementos en esta categoría</p>
          </div>
        )}

        {/* Grid de elementos del menú */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item._id} item={item} restaurantId={restaurant._id} />
          ))}
        </div>
        
        {/* Mostrar controles de paginación solo si hay más de una página y no hay filtrado por categoría */}
        {!activeCategory && pagination && pagination.pages > 1 && (
          <PaginationControls />
        )}
        
        {/* Información sobre los resultados */}
        {pagination && (
          <div className="text-center text-sm text-gray-500 mt-4">
            Mostrando {menuItems.length} de {pagination.total} elementos del menú
            {activeCategory && ` en la categoría "${activeCategory}"`}
          </div>
        )}
      </div>
      <RestaurantReviews restaurantId={restaurant._id} />
    </div>
  );
}