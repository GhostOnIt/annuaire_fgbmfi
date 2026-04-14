interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Rechercher...' }: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none bg-white"
    />
  );
}
