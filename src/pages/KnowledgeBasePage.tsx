import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { ArticleSearch } from '@/features/knowledge-base/components/ArticleSearch';
import { CategoryFilter } from '@/features/knowledge-base/components/CategoryFilter';
import { useArticles } from '@/features/knowledge-base/hooks/useArticles';
import { ArticleCategory } from '@/features/knowledge-base/types/article.types';
import { BookOpen } from 'lucide-react';
import { getCategoryLabel } from '@/features/knowledge-base/utils/articleHelpers'; 
import { ArticleList } from '@/features/knowledge-base/components/ArticleList';

export const KnowledgeBasePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') as ArticleCategory | null;
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | null>(categoryParam);

  const { data: articlesResponse, isLoading } = useArticles({
    category: selectedCategory || undefined,
    limit: 12,
  });

  const handleCategoryChange = (category: ArticleCategory | null) => {
    setSelectedCategory(category);
    
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'База знаний' }]} />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            База знаний
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Найдите ответы на часто задаваемые вопросы
          </p>

          {/* Поиск */}
          <ArticleSearch
            onArticleSelect={(article) => navigate(`/knowledge-base/${article.slug}`)}
          />
        </div>

        {/* Фильтр по категориям */}
        <div>
          <h2 className="text-sm font-medium text-gray-700 mb-3">Категории:</h2>
          <CategoryFilter
            selected={selectedCategory}
            onChange={handleCategoryChange}
          />
        </div>

        {/* Список статей */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedCategory
                ? getCategoryLabel(selectedCategory)
                : 'Все статьи'}
            </h2>
            {articlesResponse && (
              <span className="text-sm text-gray-500">
                Найдено: {articlesResponse.meta.total}
              </span>
            )}
          </div>

          <ArticleList
            articles={articlesResponse?.data || []}
            isLoading={isLoading}
            onArticleClick={(article) => navigate(`/knowledge-base/${article.slug}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
