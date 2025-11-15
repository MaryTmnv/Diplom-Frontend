import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../lib/utils/cn';


interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  className?: string;
  autoFocus?: boolean;
}

export const SearchBar = ({
  placeholder = 'Поиск...',
  onSearch,
  debounceMs = 300,
  className,
  autoFocus = false,
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  // Вызываем onSearch при изменении debounced значения
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={cn('relative', className)}>
      {/* Иконка поиска */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="w-5 h-5" />
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'w-full pl-10 pr-10 py-2.5 rounded-lg',
          'border border-gray-300 bg-white',
          'text-gray-900 placeholder-gray-400',
          'focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
          'transition-colors duration-200'
        )}
      />

      {/* Кнопка очистки */}
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Очистить поиск"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
