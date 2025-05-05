import React, { useState } from 'react';
import { FiX, FiStar } from 'react-icons/fi';
import { useAuth } from '@/store/useAuth';
import { motion } from 'framer-motion';

interface ReviewModalProps {
  orderId: string;
  restaurantId: string;
  onClose: () => void;
}

export default function ReviewModal({ orderId, restaurantId, onClose }: ReviewModalProps) {
  const { token, user } = useAuth(); // Obtener también el usuario actual
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('Usuario no autenticado');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id, // Agregar el ID del usuario
          orderId,
          restaurantId,
          rating,
          comment,
        }),
      });

      console.log("payload", JSON.stringify({
        userId: user.id, 
        orderId,
        restaurantId,
        rating,
        comment,
      }))
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al enviar la reseña');
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
      >
        {/* Resto del código igual... */}
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium text-gray-900">Calificar restaurante</h3>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-500"
          >
            <FiX size={20} />
          </button>
        </div>
        
        {success ? (
          <div className="p-6 text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">¡Gracias por tu reseña!</h3>
            <p className="text-gray-600">Tu opinión es muy importante para nosotros.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación
              </label>
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-2 rounded-full transition-colors ${
                      rating >= star ? 'text-yellow-400' : 'text-gray-500'
                    }`}
                  >
                    <FiStar size={32} fill={rating >= star ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Comentario
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full rounded-md border text-gray-800 placeholder-gray-400 border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F61]"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuéntanos tu experiencia..."
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF6F61] text-white rounded-md hover:bg-[#e95d53] disabled:opacity-75"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar valoración'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}