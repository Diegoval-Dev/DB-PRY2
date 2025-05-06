import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiPackage,
    FiXCircle,
    FiUser,
    FiHome,
    FiCalendar,
    FiEdit,
    FiTrash2,
    FiSave,
} from 'react-icons/fi';
import { getStatusIcon, getStatusStyle } from './utilsDetails';

interface OrderDetailsProps {
    order: {
        _id: string;
        userId: string;
        restaurantId: string;
        status: string;
        date: string;
        items?: Array<{
            name: string;
            quantity: number;
            price: number;
        }>;
        total: number;
    };
    onClose: () => void;
    onDelete: (id: string) => Promise<void>;
    onUpdate: (id: string, data: any) => Promise<void>;
    users: Record<string, string>;
    restaurants: Record<string, string>;
}

export function OrderDetails({ order, onClose, onDelete, onUpdate, users, restaurants }: OrderDetailsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedStatus, setEditedStatus] = useState(order.status);

    const availableStatuses = [
        "Confirmado",
        "En preparación",
        "En camino",
        "Entregado",
        "Cancelado"
    ];

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro que deseas eliminar esta orden? Esta acción no se puede deshacer.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await onDelete(order._id);
            onClose();
        } catch (error) {
            setIsDeleting(false);
            alert('Error al eliminar la orden. Intenta nuevamente.');
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate(order._id, { status: editedStatus });
            setIsEditing(false);
        } catch (error) {
            console.error("Error al actualizar la orden:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            // Cancelar edición
            setEditedStatus(order.status);
        }
        setIsEditing(!isEditing);
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b p-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <FiPackage className="mr-2" /> Detalle de Orden #{order._id.slice(-6)}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 rounded-full p-2 hover:bg-gray-100"
                    >
                        <FiXCircle size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Información de la Orden</h4>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <span className="bg-gray-100 p-2 rounded-full mr-3">
                                        <FiUser className="text-gray-600" />
                                    </span>
                                    <div>
                                        <p className="text-xs text-gray-500">Cliente</p>
                                        <p className="text-gray-800 font-medium">{users[order.userId] || 'Usuario ' + order.userId.slice(0, 6)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <span className="bg-gray-100 p-2 rounded-full mr-3">
                                        <FiHome className="text-gray-600" />
                                    </span>
                                    <div>
                                        <p className="text-xs text-gray-500">Restaurante</p>
                                        <p className="text-gray-800 font-medium">{restaurants[order.restaurantId] || 'Restaurante ' + order.restaurantId.slice(0, 6)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <span className="bg-gray-100 p-2 rounded-full mr-3">
                                        <FiCalendar className="text-gray-600" />
                                    </span>
                                    <div>
                                        <p className="text-xs text-gray-500">Fecha</p>
                                        <p className="text-gray-800 font-medium">{new Date(order.date).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <span className="bg-gray-100 p-2 rounded-full mr-3 mt-1">
                                        {isEditing ? <FiEdit className="text-blue-500" /> : getStatusIcon(order.status)}
                                    </span>
                                    <div>
                                        <p className="text-xs text-gray-500">Estado</p>
                                        {isEditing ? (
                                            <div className="mt-1">
                                                <select
                                                    value={editedStatus}
                                                    onChange={(e) => setEditedStatus(e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF6F61] focus:ring focus:ring-[#FF6F61] focus:ring-opacity-20"
                                                >
                                                    {availableStatuses.map(status => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <span className={`inline-flex px-3 py-1 text-sm rounded-full font-medium ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Resumen del Pedido</h4>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                {order.items && order.items.length > 0 ? (
                                    <>
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                                                <div className="flex items-center">
                                                    <span className="bg-[#FFF0EF] text-[#FF6F61] w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                                                        {item.quantity}
                                                    </span>
                                                    <span className="text-gray-800">{item.name}</span>
                                                </div>
                                                <span className="font-medium text-gray-900">Q{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="text-gray-500 py-4 text-center">No hay detalle de los productos</div>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                                    <span className="text-gray-700 font-medium">Total:</span>
                                    <span className="text-lg font-bold text-gray-900">Q{order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-between">
                    <div className="flex space-x-2">
                        {!isEditing && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-70 flex items-center"
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Eliminando...
                                    </>
                                ) : (
                                    <>
                                        <FiTrash2 className="mr-2" /> Eliminar
                                    </>
                                )}
                            </button>
                        )}

                        {isEditing ? (
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving || editedStatus === order.status}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-70 flex items-center"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="mr-2" /> Guardar
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                id="edit-button"
                                type="button"
                                onClick={toggleEdit}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                            >
                                <FiEdit className="mr-2" /> Editar
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={isEditing ? toggleEdit : onClose}
                        className={`px-4 py-2 ${isEditing ? 'bg-gray-400' : 'bg-[#FF6F61]'} text-white rounded-md hover:${isEditing ? 'bg-gray-500' : 'bg-[#e95d53]'} transition-colors`}
                    >
                        {isEditing ? 'Cancelar' : 'Cerrar'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}