import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useArticleSearch } from '../hooks/useArticleSearch';
import { Article } from '../types/article.types';
import { cn } from '@/shared/lib/utils/cn';
import { getCategoryIcon } from '../utils/articleHelpers';

interface ArticleSearchProps {
  onArticleSelect?: (article: Article) => void;
  placeholder?: string;
  className?: string;
}

export const ArticleSearch = ({
  onArticleSelect,
  placeholder = 'Поиск в базе знаний...',
  className,
}: ArticleSearchProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const { data: results = [], isLoading } = useArticleSearch(query);

  const handleClear = () => {
    setQuery('');
  };

  const handleSelect = (article: Article) => {
    onArticleSelect?.(article);
    setQuery('');
    setIsFocused(false);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-3 rounded-lg',
            'border-2 border-gray-300 bg-white',
            'text-gray-900 placeholder-gray-400',
            'focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none',
            'transition-all duration-200'
          )}
        />

        {/* Индикатор загрузки или кнопка очистки */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : query ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Результаты поиска */}
      {isFocused && query.length >= 3 && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsFocused(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div className="p-2">
                {results.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleSelect(article)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl shrink-0">
                        {getCategoryIcon(article.category)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm line-clamp-1">
                          {article.title}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>{article.readingTime} мин</span>
                          <span>👍 {article.helpfulPercentage}%</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-500">
                  {isLoading ? 'Поиск...' : 'Ничего не найдено'}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Подсказка */}
      {query.length > 0 && query.length < 3 && (
        <p className="text-xs text-gray-500 mt-2">
          Введите минимум 3 символа для поиска
        </p>
      )}
    </div>
  );
};
