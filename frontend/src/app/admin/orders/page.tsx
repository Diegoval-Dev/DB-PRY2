'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/store/useAuth';
import {
    FiSearch,
    FiUser,
    FiHome,
    FiShoppingCart,
    FiDollarSign,
    FiCalendar,
    FiFilter,
    FiPackage,
    FiClock,
    FiTruck,
    FiCheckCircle,
    FiXCircle,
    FiChevronDown,
    FiChevronRight,
    FiChevronLeft,
    FiInfo,
    FiTrash2,
    FiEdit,
    FiSave
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderDetails } from './orderDetail';
import { getStatusIcon, getStatusStyle } from './utilsDetails';

interface Order {
    _id: string;
    userId: string;
    restaurantId: string;
    status: string;
    total: number;
    date: string;
    items?: Array<{
        dishId: string;
        name: string;
        quantity: number;
        price: number;
    }>;
}

export default function AdminOrdersPage() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<Record<string, string>>({});
    const [restaurants, setRestaurants] = useState<Record<string, string>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortField, setSortField] = useState<'date' | 'total' | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const loadData = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Error al cargar órdenes');

            const data: Order[] = await res.json();
            setOrders(data);

            const userIds = [...new Set(data.map(o => o.userId))];
            const restaurantIds = [...new Set(data.map(o => o.restaurantId))];

            const usersMap: Record<string, string> = {};
            await Promise.all(userIds.map(id =>
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => res.ok ? res.json() : null)
                    .then(u => u && (usersMap[u._id] = u.name))
            ));
            setUsers(usersMap);

            const restMap: Record<string, string> = {};
            await Promise.all(restaurantIds.map(id =>
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => res.ok ? res.json() : null)
                    .then(r => r && (restMap[r._id] = r.name))
            ));
            setRestaurants(restMap);
        } catch (err: any) {
            setError(err.message || 'Error al cargar órdenes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [token]);

    const handleDeleteOrder = async (orderId: string): Promise<void> => {
        if (!token) return Promise.reject(new Error('No autorizado'));

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la orden');
            }

            // Actualizar el estado local eliminando la orden
            setOrders(orders.filter(order => order._id !== orderId));

            return Promise.resolve();
        } catch (error) {
            setError('Error al eliminar la orden. Intenta nuevamente.');
            return Promise.reject(error);
        }
    };

    const handleUpdateOrder = async (orderId: string, data: Partial<Order>): Promise<void> => {
        if (!token) return Promise.reject(new Error('No autorizado'));

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la orden');
            }

            const updatedOrder = await response.json();

            // Actualizar la orden en el estado local
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, ...updatedOrder } : order
            ));

            // Actualizar la orden seleccionada si está abierta
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder({ ...selectedOrder, ...updatedOrder });
            }

            return Promise.resolve();
        } catch (error) {
            setError('Error al actualizar la orden. Intenta nuevamente.');
            return Promise.reject(error);
        }
    };

    // Get unique statuses for filtering
    const uniqueStatuses = useMemo(() => {
        const statuses = [...new Set(orders.map(order => order.status))];
        return statuses.sort();
    }, [orders]);

    // Filter and sort orders
    const filteredOrders = useMemo(() => {
        let result = [...orders];

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(o =>
            (o.status?.toLowerCase().includes(searchLower) ||
                users[o.userId]?.toLowerCase().includes(searchLower) ||
                restaurants[o.restaurantId]?.toLowerCase().includes(searchLower))
            );
        }

        // Apply status filter
        if (statusFilter) {
            result = result.filter(o => o.status === statusFilter);
        }

        // Apply sorting
        if (sortField === 'date') {
            result.sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
            });
        } else if (sortField === 'total') {
            result.sort((a, b) => {
                return sortDirection === 'asc' ? a.total - b.total : b.total - a.total;
            });
        }

        return result;
    }, [orders, searchTerm, sortField, sortDirection, statusFilter, users, restaurants]);

    // Handle pagination
    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredOrders.slice(start, end);
    }, [filteredOrders, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const handleSort = (field: 'date' | 'total') => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <motion.div
                className="bg-gradient-to-r from-[#FF6F61] to-[#FF9671] text-white py-8 px-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold flex items-center">
                        <FiShoppingCart className="mr-3" /> Administración de Órdenes
                    </h1>
                    <p className="mt-2 opacity-90">Visualiza y administra las órdenes realizadas en la plataforma</p>
                </div>
            </motion.div>

            <div className="container mx-auto px-6 py-8">
                <motion.div
                    className="bg-white rounded-lg shadow-md p-6 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative max-w-md w-full">
                            <input
                                type="text"
                                placeholder="Buscar por usuario, restaurante o estado..."
                                value={searchTerm}
                                onChange={e => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF6F61]"
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>

                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={e => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF6F61] bg-white"
                            >
                                <option value="">Todos los estados</option>
                                {uniqueStatuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </motion.div>

                {error && (
                    <motion.div
                        className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FiXCircle className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    className="bg-white shadow rounded-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6F61]"></div>
                                <p className="mt-4 text-gray-500">Cargando órdenes...</p>
                            </div>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                            <FiPackage size={40} className="mb-4 text-gray-300" />
                            <p className="text-lg font-medium">No se encontraron órdenes</p>
                            <p className="text-sm mt-1">
                                {searchTerm || statusFilter
                                    ? 'Intenta cambiar los filtros de búsqueda'
                                    : 'Todavía no hay órdenes en el sistema'}
                            </p>
                        </div>
                    ) : (
                        <>
                                                        
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm table-auto">
                                    <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
                                        <tr>
                                            <th className="p-4" style={{ width: '8%' }}>ID</th>
                                            <th className="p-4" style={{ width: '18%' }}>Usuario</th>
                                            <th className="p-4" style={{ width: '20%' }}>Restaurante</th>
                                            <th className="p-4" style={{ width: '15%' }}>Estado</th>
                                            <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('total')} style={{ width: '12%' }}>
                                                <div className="flex items-center">
                                                    Total
                                                    {sortField === 'total' && (
                                                        <span className="ml-1">
                                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('date')} style={{ width: '15%' }}>
                                                <div className="flex items-center">
                                                    Fecha
                                                    {sortField === 'date' && (
                                                        <span className="ml-1">
                                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="p-4 text-center" style={{ width: '12%' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedOrders.map(order => (
                                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-mono text-sm text-gray-500">
                                                    #{order._id.slice(-6)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <span className="flex-shrink-0 bg-gray-100 rounded-full p-1.5">
                                                            <FiUser className="text-gray-500" size={14} />
                                                        </span>
                                                        <span className="truncate">
                                                            {users[order.userId] || order.userId.slice(0, 6)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <span className="flex-shrink-0 bg-gray-100 rounded-full p-1.5">
                                                            <FiHome className="text-gray-500" size={14} />
                                                        </span>
                                                        <span className="truncate" title={restaurants[order.restaurantId] || order.restaurantId}>
                                                            {restaurants[order.restaurantId] || order.restaurantId.slice(0, 6)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        <span className="ml-1">{order.status}</span>
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-800 font-medium">
                                                    <div className="flex items-center gap-1">
                                                        <FiDollarSign className="text-gray-400" />
                                                        <span>Q{order.total.toFixed(2)}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <FiCalendar size={14} className="flex-shrink-0" />
                                                        <div>
                                                            <div>{new Date(order.date).toLocaleDateString()}</div>
                                                            <div className="text-xs text-gray-400">
                                                                {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="inline-flex items-center rounded-md border border-transparent bg-[#FF6F61]/10 px-2 py-1 text-sm font-medium text-[#FF6F61] hover:bg-[#FF6F61]/20 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:ring-offset-2 transition-colors"
                                                            title="Ver detalles"
                                                        >
                                                            <FiInfo size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setTimeout(() => {
                                                                    document.getElementById('edit-button')?.click();
                                                                }, 100);
                                                            }}
                                                            className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                                            title="Editar orden"
                                                        >
                                                            <FiEdit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('¿Estás seguro que deseas eliminar esta orden? Esta acción no se puede deshacer.')) {
                                                                    await handleDeleteOrder(order._id);
                                                                }
                                                            }}
                                                            className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-2 py-1 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                                            title="Eliminar orden"
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-white px-4 py-5 border-t border-gray-200 sm:px-6 flex justify-between items-center">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => goToPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            onClick={() => goToPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
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
                                                Mostrando <span className="font-medium">{filteredOrders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> a{' '}
                                                <span className="font-medium">
                                                    {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
                                                </span>{' '}
                                                de <span className="font-medium">{filteredOrders.length}</span> órdenes
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                <button
                                                    onClick={() => goToPage(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <span className="sr-only">Anterior</span>
                                                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                                                </button>

                                                {/* Pages */}
                                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                    .filter(page => {
                                                        if (totalPages <= 7) return true;
                                                        if (page === 1 || page === totalPages) return true;
                                                        if (Math.abs(page - currentPage) <= 1) return true;
                                                        if (page === 2 && currentPage <= 3) return true;
                                                        if (page === totalPages - 1 && currentPage >= totalPages - 2) return true;
                                                        return false;
                                                    })
                                                    .map((page, i, array) => {
                                                        // Show ellipsis
                                                        if (i > 0 && array[i - 1] !== page - 1) {
                                                            return (
                                                                <span
                                                                    key={`ellipsis-${page}`}
                                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                                >
                                                                    ...
                                                                </span>
                                                            );
                                                        }

                                                        return (
                                                            <button
                                                                key={page}
                                                                onClick={() => goToPage(page)}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                                                    ? 'z-10 bg-[#FF6F61] text-white border-[#FF6F61]'
                                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                                                    }`}
                                                            >
                                                                {page}
                                                            </button>
                                                        );
                                                    })}

                                                <button
                                                    onClick={() => goToPage(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <span className="sr-only">Siguiente</span>
                                                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </div>

            <AnimatePresence>
                {selectedOrder && (
                    <OrderDetails
                        order={selectedOrder}
                        onClose={() => setSelectedOrder(null)}
                        onDelete={handleDeleteOrder}
                        onUpdate={handleUpdateOrder}
                        users={users}
                        restaurants={restaurants}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}