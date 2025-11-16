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
          <div key={i} className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-32 rounded-lg" />
              <Skeleton className="h-5 w-12 rounded" />
            </div>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-4 pt-4">
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
      <div className="py-16">
        <EmptyState
          icon={<BookOpen className="w-20 h-20" />}
          title="Статей не найдено"
          description="Попробуйте изменить фильтры или поисковый запрос"
        />
      </div>
    );
  }

  // Articles grid с анимацией появления
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <div
          key={article.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ArticleCard
            article={article}
            onClick={() => onArticleClick?.(article)}
          />
        </div>
      ))}
    </div>
  );
};
