'use client';

import FloatingCart from '@/components/FloatingCart';
import React from 'react';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCartPage = pathname === '/client/cart';
  
  return (
    <div className="relative bg-white min-h-screen">
      {children}
      {!isCartPage && <FloatingCart />}
    </div>
  );
}