'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <>
      <div className="flex justify-around mb-4 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('login')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'login' ? 'text-[#FF6F61] border-b-2 border-[#FF6F61]' : 'text-gray-500'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'register' ? 'text-[#FF6F61] border-b-2 border-[#FF6F61]' : 'text-gray-500'
          }`}
        >
          Registrarse
        </button>
      </div>

      {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
    </>
  );
}