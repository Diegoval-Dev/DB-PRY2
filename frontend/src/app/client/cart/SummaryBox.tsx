interface Props {
    subtotal: number;
    delivery: number;
    tax: number;
    total: number;
  }
  
  export default function SummaryBox({ subtotal, delivery, tax, total }: Props) {
    return (
      <div className="bg-[#F5F5F5] p-4 rounded shadow">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-sm text-gray-700">Q{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Envío</span>
          <span className="text-sm text-gray-700">Q{delivery.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Impuestos</span>
          <span className="text-sm text-gray-700">Q{tax.toFixed(2)}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-medium text-[#333]">
          <span>Total</span>
          <span>Q{total.toFixed(2)}</span>
        </div>
      </div>
    );
  }