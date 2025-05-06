'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiCheckCircle, FiMapPin, FiClock, FiStar, FiShoppingBag } from 'react-icons/fi';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background - Gradient + Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6F61] to-[#FF9671] opacity-90 z-0" />
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 z-0" />

        {/* Navigation */}
        <nav className="relative z-10 container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-white text-2xl font-bold">
                Gerco<span className="text-yellow-300">Raunte</span>
              </div>
            </div>
            <div>
              <Link 
                href="/login" 
                className="px-6 py-3 bg-white text-[#FF6F61] rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container mx-auto px-6 pt-20 pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-white"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Deliciosa comida a un<br /> 
                <span className="text-yellow-300">Click de distancia</span>
              </h1>
              <p className="text-xl opacity-90 mb-8 max-w-lg">
                Conectamos los mejores restaurantes de la ciudad con tus antojos. Pedidos rápidos, entrega puntual.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/client/home" 
                  className="px-8 py-4 bg-white text-[#FF6F61] rounded-full font-medium hover:bg-gray-100 transition flex items-center group"
                >
                  Explorar restaurantes
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/login" 
                  className="px-8 py-4 border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition"
                >
                  Iniciar sesión
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative w-full h-[500px]">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white rounded-2xl shadow-xl overflow-hidden -rotate-6 z-10">
                  <Image 
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1381&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Comida deliciosa" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white rounded-2xl shadow-xl overflow-hidden rotate-6 z-20">
                  <Image 
                    src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Comida deliciosa" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[250px] h-[250px] bg-yellow-300 rounded-full shadow-xl z-0" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-white">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C58,0,120,7.72,171.17,19.46,250.34,38.15,315.39,45.89,321.39,56.44Z" className="fill-current"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
            >
              Todo lo que necesitas para satisfacer tu apetito
            </motion.h2>
            <p className="text-gray-600">
              GercoRaunte reúne los mejores restaurantes, ofreciendo una experiencia de pedido y entrega excepcional.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: <FiMapPin className="text-[#FF6F61] text-3xl" />,
                title: "Ubicación en tiempo real",
                description: "Sigue tu pedido desde la cocina hasta tu puerta con nuestro sistema de rastreo en tiempo real."
              },
              {
                icon: <FiClock className="text-[#FF6F61] text-3xl" />,
                title: "Entrega rápida",
                description: "Nuestros repartidores se comprometen a llevar tu comida en tiempo récord y en perfectas condiciones."
              },
              {
                icon: <FiStar className="text-[#FF6F61] text-3xl" />,
                title: "Los mejores restaurantes",
                description: "Colaboramos con restaurantes de calidad que cumplen con nuestros altos estándares."
              },
              {
                icon: <FiCheckCircle className="text-[#FF6F61] text-3xl" />,
                title: "Pago seguro",
                description: "Múltiples métodos de pago seguros para tu tranquilidad en cada pedido."
              },
              {
                icon: <FiShoppingBag className="text-[#FF6F61] text-3xl" />,
                title: "Pedidos personalizados",
                description: "Personaliza tus pedidos según tus preferencias y necesidades alimenticias."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="p-3 rounded-full w-14 h-14 flex items-center justify-center bg-[#FFF0EF] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#FFF0EF] py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-[#FF6F61] to-[#FF9671] rounded-2xl p-10 text-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold mb-4"
                >
                  ¿Hambriento? GercoRaunte es la solución
                </motion.h2>
                <p className="text-white/90 mb-8">
                  Descarga nuestra aplicación o usa nuestro sitio web para hacer tu primer pedido hoy mismo. ¡Tu comida favorita te espera!
                </p>
                <Link 
                  href="/login" 
                  className="inline-flex items-center px-6 py-3 bg-white text-[#FF6F61] rounded-full font-medium hover:bg-gray-100 transition shadow-lg"
                >
                  Comenzar ahora <FiArrowRight className="ml-2" />
                </Link>
              </div>
              <div className="flex justify-center lg:justify-end">
                <Image 
                  src="https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="GercoRaunte App" 
                  width={300}
                  height={600}
                  className="drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">GercoRaunte</h3>
              <p className="text-gray-400 mb-4">
                La forma más deliciosa de recibir comida a domicilio.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-gray-400 hover:text-white transition">Iniciar sesión</Link></li>
                <li><Link href="/register" className="text-gray-400 hover:text-white transition">Registrarse</Link></li>
                <li><Link href="/restaurants" className="text-gray-400 hover:text-white transition">Restaurantes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition">Términos de servicio</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition">Política de privacidad</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contáctanos</h4>
              <p className="text-gray-400">support@gercoruante.com</p>
              <p className="text-gray-400">+502 1234 5678</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} GercoRaunte. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}