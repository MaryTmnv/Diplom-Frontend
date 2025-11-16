import { Article } from '../types/article.types';
import { getCategoryLabel, getCategoryIcon, getCategoryColor } from '../utils/articleHelpers';
import { Eye, ThumbsUp, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';

interface ArticleCardProps {
  article: Article;
  onClick?: () => void;
}

const categoryColorClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  red: 'bg-red-100 text-red-700 border-red-200',
};

export const ArticleCard = ({ article, onClick }: ArticleCardProps) => {
  const categoryColor = getCategoryColor(article.category);

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-xl border-2 border-gray-200 p-6 cursor-pointer transition-all duration-300 hover:border-primary-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Категория */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border',
            categoryColorClasses[categoryColor]
          )}
        >
          <span className="text-base">{getCategoryIcon(article.category)}</span>
          <span>{getCategoryLabel(article.category)}</span>
        </span>

        {/* Процент полезности */}
        {article.helpfulPercentage >= 80 && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
            <ThumbsUp className="w-3 h-3" />
            {article.helpfulPercentage}%
          </span>
        )}
      </div>

      {/* Заголовок */}
      <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {article.title}
      </h3>

      {/* Описание */}
      <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
        {article.excerpt}
      </p>

      {/* Метрики */}
      <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          <span>{article.views}</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{article.readingTime} мин</span>
        </div>

        {/* Стрелка при hover */}
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="w-4 h-4 text-primary-600" />
        </div>
      </div>

      {/* Градиент при hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};
