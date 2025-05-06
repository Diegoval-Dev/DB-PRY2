'use client';

import AuthTabs from './AuthTabs';

export default function ClientLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FF6F61] to-[#FF9671] text-[#333]">
      <div className="w-full max-w-md bg-[#F5F5F5] rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-medium">Bienvenido a GercoRaunte</h1>
        </div>
        <AuthTabs />
        <p className="mt-8 text-center text-sm text-[#999]">
          ¿Olvidaste tu contraseña?{' '}
          <a href="#" className="text-[#FF6F61] hover:underline">Recupérala aquí</a>
        </p>
      </div>
    </main>
  );
}