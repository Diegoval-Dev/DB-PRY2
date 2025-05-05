'use client';

import FloatingCart from '@/components/FloatingCart';
import React from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-white min-h-screen">
      {children}
      <FloatingCart />
    </div>
  );
}