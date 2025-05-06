'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { motion } from 'framer-motion';
import {
  FiAward,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
  FiStar,
} from 'react-icons/fi';

interface Column {
  label: string;
  key: string;
  format?: (value: any) => string;
}

export default function AdminReportsPage() {
  const { token } = useAuth();

  const [topRated, setTopRated] = useState<any[]>([]);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [userFreq, setUserFreq] = useState<any[]>([]);
  const [avgRatings, setAvgRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/top-rated-restaurants?limit=5`, { headers }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/most-ordered-items?limit=5`, { headers }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/restaurant-sales`, { headers }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/user-order-frequency`, { headers }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/avg-rating-by-specialty`, { headers }).then(r => r.json()),
    ])
      .then(([rated, items, salesData, freq, ratings]) => {
        setTopRated(rated);
        setTopItems(items);
        setSales(salesData);
        setUserFreq(freq);
        setAvgRatings(ratings);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <motion.div
        className="bg-gradient-to-r from-[#FF6F61] to-[#FF9671] text-white py-8 px-6 rounded-lg mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold flex items-center">
          <FiTrendingUp className="mr-3" /> Reportes del Sistema
        </h1>
        <p className="mt-2 text-white/80">Resumen de datos estadísticos clave</p>
      </motion.div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando reportes...</p>
      ) : (
        <div className="space-y-10">
          <ReportTable
            title="Top Restaurantes Mejor Calificados"
            icon={<FiAward />}
            data={topRated}
            columns={[
              { label: 'Restaurante', key: 'name' },
              { label: 'Promedio', key: 'avgRating', format: (v) => v.toFixed(2) },
            ]}
          />

          <ReportTable
            title="Ítems más pedidos"
            icon={<FiShoppingBag />}
            data={topItems}
            columns={[
              { label: 'Ítem', key: 'name' },
              { label: 'Pedidos', key: 'totalSold' },
            ]}
          />

          <ReportTable
            title="Ventas por Restaurante"
            icon={<FiTrendingUp />}
            data={sales}
            columns={[
              { label: 'Restaurante', key: 'name' },
              { label: 'Total vendido (Q)', key: 'totalSales', format: (v) => v.toFixed(2) },
            ]}
          />

          <ReportTable
            title="Pedidos por Usuario"
            icon={<FiUsers />}
            data={userFreq}
            columns={[
              { label: 'Usuario', key: 'name' },
              { label: 'Total de pedidos', key: 'orderCount' },
            ]}
          />

          <ReportTable
            title="Promedio de Rating por Especialidad"
            icon={<FiStar />}
            data={avgRatings}
            columns={[
              { label: 'Especialidad', key: 'specialty' },
              { label: 'Promedio', key: 'avgRating', format: (v) => v.toFixed(2) },
            ]}
          />
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Dashboard Interactivo</h2>
            <div className="overflow-hidden rounded-lg">
              <iframe 
                style={{ 
                  background: "#F1F5F4", 
                  border: "none", 
                  borderRadius: "2px", 
                  boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)", 
                  width: "100%", 
                  height: "800px" 
                }} 
                src="https://charts.mongodb.com/charts-gercoraunte-pftdoin/embed/dashboards?id=2e955f16-3d91-455e-9431-7e88876cac5c&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportTable({
  title,
  icon,
  data,
  columns,
}: {
  title: string;
  icon: JSX.Element;
  data: any[];
  columns: Column[];
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center text-[#FF6F61]">
        {icon} <span className="ml-2">{title}</span>
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">Sin datos disponibles.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="px-4 py-2">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {columns.map((col, j) => (
                    <td key={j} className="px-4 py-2 text-gray-700">
                      {col.format ? col.format(item[col.key]) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}