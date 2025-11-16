import { Article } from '../types/article.types';
import { getCategoryLabel, getCategoryIcon, getCategoryColor } from '../utils/articleHelpers';
import { Eye, ThumbsUp, Clock } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';

interface ArticleCardProps {
  article: Article;
  onClick?: () => void;
}

const categoryColorClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  purple: 'bg-purple-100 text-purple-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red: 'bg-red-100 text-red-700',
};

export const ArticleCard = ({ article, onClick }: ArticleCardProps) => {
  const categoryColor = getCategoryColor(article.category);

  return (
    <div
      onClick={onClick}
      className="card-interactive group"
    >
      {/* Категория */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
            categoryColorClasses[categoryColor]
          )}
        >
          <span>{getCategoryIcon(article.category)}</span>
          <span>{getCategoryLabel(article.category)}</span>
        </span>
      </div>

      {/* Заголовок */}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {article.title}
      </h3>

      {/* Описание */}
      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
        {article.excerpt}
      </p>

      {/* Метрики */}
      <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          <span>{article.views}</span>
        </div>

        <div className="flex items-center gap-1">
          <ThumbsUp className="w-3 h-3" />
          <span>{article.helpfulPercentage}%</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{article.readingTime} мин</span>
        </div>
      </div>
    </div>
  );
};
