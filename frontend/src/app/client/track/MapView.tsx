'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type { MapContainerProps } from 'react-leaflet';

// Importar Leaflet dinámicamente para evitar problemas de SSR
const MapWithNoSSR = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-64 bg-gray-200 flex items-center justify-center">Cargando mapa...</div>
  }
);

export default function MapView() {
  const position: [number, number] = [14.6349, -90.5069]; // Ciudad de Guatemala

  return (
    <div className="w-full h-64 mt-6 rounded-xl overflow-hidden shadow">
      <MapWithNoSSR position={position} />
    </div>
  );
}