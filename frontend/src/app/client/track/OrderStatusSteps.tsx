interface Props {
    status: 'pendiente' | 'en_curso' | 'entregado';
  }
  
  const steps = ['pendiente', 'en_curso', 'entregado'];
  
  export default function OrderStatusSteps({ status }: Props) {
    const current = steps.indexOf(status);
  
    return (
      <div className="flex justify-between items-center gap-4 mt-6 mb-6">
        {steps.map((step, idx) => (
          <div key={step} className="flex-1 text-center">
            <div
              className={`w-4 h-4 mx-auto rounded-full ${
                idx <= current ? 'bg-[#4CAF50]' : 'bg-gray-300'
              }`}
            />
            <p className="text-xs mt-2 capitalize text-gray-700">{step.replace('_', ' ')}</p>
          </div>
        ))}
      </div>
    );
  }