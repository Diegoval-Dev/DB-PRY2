'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiList,
  FiUsers,
  FiShoppingCart,
  FiMessageSquare,
  FiTrendingUp,
  FiArrowRight,
} from 'react-icons/fi';

const links = [
  {
    label: 'Ítems del Menú',
    href: '/admin/menu-items',
    icon: <FiList size={24} />,
    description: 'Gestiona los productos del menú',
  },
  {
    label: 'Restaurantes',
    href: '/admin/restaurants',
    icon: <FiHome size={24} />,
    description: 'Administra la lista de restaurantes disponibles',
  },
  {
    label: 'Órdenes',
    href: '/admin/orders',
    icon: <FiShoppingCart size={24} />,
    description: 'Consulta todas las órdenes realizadas',
  },
  {
    label: 'Reseñas',
    href: '/admin/reviews',
    icon: <FiMessageSquare size={24} />,
    description: 'Visualiza y elimina reseñas de usuarios',
  },
  {
    label: 'Reportes',
    href: '/admin/reports',
    icon: <FiTrendingUp size={24} />,
    description: 'Consulta estadísticas clave de la plataforma',
  },
];

export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <motion.div
        className="bg-gradient-to-r from-[#FF6F61] to-[#FF9671] text-white py-8 px-6 rounded-lg mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold flex items-center">
          <FiUsers className="mr-3" /> Panel de Administración
        </h1>
        <p className="mt-2 text-white/80">Accede rápidamente a las secciones del sistema</p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(({ label, href, icon, description }) => (
          <Link key={href} href={href} className="group">
            <motion.div
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition border p-5 h-full flex flex-col justify-between"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center text-[#FF6F61] mb-3">
                {icon}
                <h2 className="ml-3 font-semibold text-lg">{label}</h2>
              </div>
              <p className="text-sm text-gray-600 flex-1">{description}</p>
              <div className="mt-4 flex justify-end text-sm text-[#FF6F61] font-medium group-hover:underline">
                Ver más <FiArrowRight className="ml-2" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}