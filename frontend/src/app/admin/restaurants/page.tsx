'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/store/useAuth';
import { FiTrash2, FiPlus, FiEdit, FiSearch, FiHome, FiChevronLeft, FiChevronRight, FiFilter, FiMapPin, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import CreateRestaurantModal from './createRestaurantModal';
import EditRestaurantModal from './editRestaurantModal';

interface Restaurant {
    _id: string;
    name: string;
    address: string;
    specialties?: string[];
    location?: {
        type: 'Point';
        coordinates: [number, number];
    };
}

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export default function AdminRestaurantsPage() {
    const { token } = useAuth();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const refreshData = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        if (!token) return;

        setLoading(true);
        setError('');

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants?page=${currentPage}&limit=${pageSize}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar restaurantes');
                return res.json();
            })
            .then(response => {
                // Extraer datos del formato paginado
                setRestaurants(response.data || []);
                setPagination({
                    page: response.page,
                    limit: response.limit,
                    total: response.total,
                    pages: response.pages
                });
            })
            .catch(err => setError(err.message || 'Error al cargar restaurantes'))
            .finally(() => setLoading(false));
            
    }, [token, currentPage, pageSize, searchTerm, refreshTrigger]);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const deleteSelected = async () => {
        if (!token || selectedIds.length === 0) return;
        if (!window.confirm(`¿Eliminar ${selectedIds.length} restaurantes?`)) return;

        setIsDeleting(true);

        try {
            await Promise.all(
                selectedIds.map(id =>
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${id}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );
            setSelectedIds([]);
            refreshData();

            if (restaurants.length === selectedIds.length && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }
        } catch (err) {
            setError('Error al eliminar restaurantes');
        } finally {
            setIsDeleting(false);
        }
    };

    // Funciones de navegación
    const goToNextPage = () => {
        if (pagination && currentPage < pagination.pages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (page: number) => {
        if (pagination && page >= 1 && page <= pagination.pages) {
            setCurrentPage(page);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // Reset a la primera página al buscar
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <motion.div
                className="bg-gradient-to-r from-[#FF6F61] to-[#FF9671] text-white py-8 px-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold flex items-center">
                        <FiHome className="mr-3" /> Administración de Restaurantes
                    </h1>
                    <p className="mt-2 opacity-90">Gestiona los restaurantes de la plataforma</p>
                </div>
            </motion.div>

            <div className="container mx-auto px-6 py-8">
                {/* Search and actions */}
                <motion.div
                    className="bg-white rounded-lg shadow-md p-6 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        <form onSubmit={handleSearch} className="flex-grow max-w-lg">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar restaurantes..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF6F61] text-gray-500"
                                />
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </form>

                        <div className="flex items-center gap-4">
                            {selectedIds.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <button
                                        onClick={deleteSelected}
                                        disabled={isDeleting}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center"
                                    >
                                        {isDeleting ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Eliminando...
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <FiTrash2 className="mr-2" /> Eliminar ({selectedIds.length})
                                            </span>
                                        )}
                                    </button>
                                </motion.div>
                            )}
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-[#FF6F61] text-white px-4 py-2 rounded hover:bg-[#e95d53]"
                            >
                                <FiPlus className="inline-block mr-2" /> Nuevo restaurante
                            </button>
                        </div>
                    </div>
                </motion.div>

                {error && (
                    <motion.div
                        className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Table */}
                <motion.div
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {loading && restaurants.length === 0 ? (
                        <div className="p-8 flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6F61]"></div>
                            <p className="mt-4 text-gray-600">Cargando restaurantes...</p>
                        </div>
                    ) : restaurants.length === 0 ? (
                        <div className="p-8 text-center">
                            <FiFilter className="mx-auto text-gray-400 text-4xl mb-3" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron restaurantes</h3>
                            <p className="text-gray-500">
                                {searchTerm ? 'Intenta con otra búsqueda o' : 'Empieza'} añadiendo nuevos restaurantes.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 w-10">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-[#FF6F61] focus:ring-[#FF6F61]"
                                                checked={selectedIds.length === restaurants.length && restaurants.length > 0}
                                                onChange={e =>
                                                    setSelectedIds(e.target.checked ? restaurants.map(r => r._id) : [])
                                                }
                                            />
                                        </th>
                                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidades</th>
                                        <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {restaurants.map(r => (
                                        <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-[#FF6F61] focus:ring-[#FF6F61]"
                                                    checked={selectedIds.includes(r._id)}
                                                    onChange={() => toggleSelection(r._id)}
                                                />
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-800">{r.name}</div>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex items-center text-gray-600">
                                                    <FiMapPin className="mr-2 text-gray-400" size={16} />
                                                    {r.address || '-'}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {r.specialties?.map((specialty, i) => (
                                                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF0EF] text-[#FF6F61]">
                                                            <FiTag className="mr-1" size={12} />
                                                            {specialty}
                                                        </span>
                                                    ))}
                                                    {(!r.specialties || r.specialties.length === 0) && (
                                                        <span className="text-gray-400 text-xs">Sin especialidades</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(r._id);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="text-blue-500 hover:text-blue-700 transition-colors p-1.5 rounded-full hover:bg-blue-50"
                                                    >
                                                        <FiEdit size={18} />
                                                    </button>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-full hover:bg-red-50"
                                                        onClick={() => toggleSelection(r._id)}
                                                        aria-label="Eliminar"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="bg-white px-4 py-5 border-t border-gray-200 sm:px-6 flex justify-between items-center">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === pagination.pages}
                                    className={`relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === pagination.pages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Siguiente
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Mostrando <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> a{' '}
                                        <span className="font-medium">
                                            {Math.min(currentPage * pageSize, pagination.total)}
                                        </span>{' '}
                                        de <span className="font-medium">{pagination.total}</span> restaurantes
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={goToPreviousPage}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 ${currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Anterior</span>
                                            <FiChevronLeft size={18} />
                                        </button>

                                        {/* First page */}
                                        {pagination.pages > 2 && currentPage > 2 && (
                                            <>
                                                <button
                                                    onClick={() => goToPage(1)}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    1
                                                </button>
                                                {currentPage > 3 && (
                                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                        ...
                                                    </span>
                                                )}
                                            </>
                                        )}

                                        {/* Current page range */}
                                        {Array.from(
                                            { length: Math.min(5, pagination.pages) },
                                            (_, i) => {
                                                // Show 2 pages before and after current page, but adjust for edge cases
                                                let pageNum;
                                                if (pagination.pages <= 5) {
                                                    // If we have 5 or fewer pages, show them all
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    // If we're near the start, show pages 1-5
                                                    pageNum = i + 1;
                                                } else if (currentPage >= pagination.pages - 2) {
                                                    // If we're near the end, show the last 5 pages
                                                    pageNum = pagination.pages - 4 + i;
                                                } else {
                                                    // Otherwise show current page and 2 pages on either side
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                // Only show pages that are within bounds
                                                if (pageNum > 0 && pageNum <= pagination.pages) {
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => goToPage(pageNum)}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                                ? 'z-10 bg-[#FF6F61] text-white border-[#FF6F61]'
                                                                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                }
                                                return null;
                                            }
                                        )}

                                        {/* Last page */}
                                        {pagination.pages > 2 && currentPage < pagination.pages - 1 && (
                                            <>
                                                {currentPage < pagination.pages - 2 && (
                                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                        ...
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => goToPage(pagination.pages)}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    {pagination.pages}
                                                </button>
                                            </>
                                        )}

                                        <button
                                            onClick={goToNextPage}
                                            disabled={currentPage === pagination.pages}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 ${currentPage === pagination.pages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Siguiente</span>
                                            <FiChevronRight size={18} />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
            {showCreateModal && (
                <CreateRestaurantModal
                    token={token}
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => {
                        refreshData();
                    }}
                />
            )}

            {showEditModal && editingId && (
                <EditRestaurantModal
                    token={token}
                    restaurantId={editingId}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingId(null);
                    }}
                    onUpdated={() => {
                        setShowEditModal(false);
                        setEditingId(null);
                        refreshData();
                    }}
                />
            )}
        </div>
    );
}