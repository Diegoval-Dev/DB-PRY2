interface Props {
    items: string[];
    active: string | null;
    onChange: (value: string | null) => void;
  }
  
  export default function CategoryTabs({ items, active, onChange }: Props) {
    return (
      <div className="flex space-x-4 overflow-x-auto">
        <button
          onClick={() => onChange(null)}
          className={`py-1 px-4 rounded-full ${
            active === null ? 'bg-[#FF6F61] text-white' : 'bg-gray-200'
          }`}
        >
          Todos
        </button>
        {items.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`py-1 px-4 rounded-full ${
              active === cat ? 'bg-[#FF6F61] text-white' : 'bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  }