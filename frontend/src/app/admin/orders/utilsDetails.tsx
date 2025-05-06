
import {
    FiPackage,
    FiXCircle,
    FiTruck,
    FiCheckCircle,
    FiClock
} from 'react-icons/fi';

export function getStatusIcon(status: string) {
    status = status.toLowerCase();

    if (status.includes('prepar')) return <FiClock className="text-blue-500" />;
    if (status.includes('confirm')) return <FiCheckCircle className="text-blue-500" />;
    if (status.includes('camino') || status.includes('ruta')) return <FiTruck className="text-yellow-500" />;
    if (status.includes('entrega')) return <FiCheckCircle className="text-green-500" />;
    if (status.includes('cancel')) return <FiXCircle className="text-red-500" />;

    return <FiPackage className="text-gray-600" />;
}

export function getStatusStyle(status: string) {
    status = status.toLowerCase();

    if (status.includes('prepar')) return 'bg-blue-100 text-blue-800';
    if (status.includes('confirm')) return 'bg-blue-100 text-blue-800';
    if (status.includes('camino') || status.includes('ruta')) return 'bg-yellow-100 text-yellow-800';
    if (status.includes('entrega')) return 'bg-green-100 text-green-800';
    if (status.includes('cancel')) return 'bg-red-100 text-red-800';

    return 'bg-gray-100 text-gray-800';
}