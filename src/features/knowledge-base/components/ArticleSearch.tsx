import { useState } from 'react';
import { Search, X, Loader2, TrendingUp, ArrowRight, ThumbsUp, Clock } from 'lucide-react';
import { useArticleSearch } from '../hooks/useArticleSearch';
import { Article } from '../types/article.types';
import { getCategoryIcon } from '../utils/articleHelpers';
import { cn } from '@/shared/lib/utils/cn';

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

  const showResults = isFocused && query.length >= 3;

  return (
    <div className={cn('relative', className)}>
      {/* Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-12 pr-12 py-4 rounded-xl',
            'border-2 border-gray-300 bg-white',
            'text-base text-gray-900 placeholder-gray-400',
            'focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none',
            'transition-all duration-200',
            'shadow-sm focus:shadow-lg',
            className
          )}
        />

        {/* Индикатор загрузки или кнопка очистки */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : query ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Результаты поиска */}
      {showResults && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsFocused(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden animate-scale-in">
            {results.length > 0 ? (
              <div className="overflow-y-auto max-h-[500px]">
                {/* Header */}
                <div className="sticky top-0 bg-gray-50 px-4 py-3 border-b flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Найдено результатов: {results.length}
                  </span>
                </div>

                {/* Результаты */}
                <div className="p-2">
                  {results.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => handleSelect(article)}
                      className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <span className="text-xl">
                            {getCategoryIcon(article.category)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">
                            {article.title}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.readingTime} мин
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              {article.helpfulPercentage}%
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {isLoading ? 'Поиск...' : 'Ничего не найдено'}
                </p>
                <p className="text-xs text-gray-500">
                  {!isLoading && 'Попробуйте изменить поисковый запрос'}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Подсказка */}
      {query.length > 0 && query.length < 3 && (
        <p className="text-xs text-gray-500 mt-2 px-1">
          💡 Введите минимум 3 символа для поиска
        </p>
      )}
    </div>
  );
};
