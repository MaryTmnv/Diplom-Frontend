import { Skeleton } from '@/shared/ui';
import { Article } from '../types/article.types';
import { ArticleCard } from './ArticleCard';
import { EmptyState } from '@/shared/components/EmptyState';
import { BookOpen } from 'lucide-react';

interface ArticleListProps {
  articles: Article[];
  isLoading?: boolean;
  onArticleClick?: (article: Article) => void;
}

export const ArticleList = ({ articles, isLoading, onArticleClick }: ArticleListProps) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-4 space-y-3">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!articles || articles.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="w-16 h-16" />}
        title="Статей не найдено"
        description="Попробуйте изменить фильтры или поисковый запрос"
      />
    );
  }

  // Articles grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onClick={() => onArticleClick?.(article)}
        />
      ))}
    </div>
  );
};
