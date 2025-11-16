import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { ArticleSearch } from '@/features/knowledge-base/components/ArticleSearch';
import { CategoryFilter } from '@/features/knowledge-base/components/CategoryFilter';
import { ArticleList } from '@/features/knowledge-base/components/ArticleList';
import { useArticles } from '@/features/knowledge-base/hooks/useArticles';
import { ArticleCategory } from '@/features/knowledge-base/types/article.types';
import { getCategoryLabel } from '@/features/knowledge-base/utils/articleHelpers';
import { BookOpen, TrendingUp, Lightbulb, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui';

const KnowledgeBasePage = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 text-white">
        <div className="container px-4 py-16">
          <Breadcrumbs 
            items={[{ label: 'База знаний' }]} 
            className="mb-8 [&_a]:text-primary-100 [&_a:hover]:text-white [&_span]:text-white"
          />

          <div className="max-w-3xl mx-auto text-center">
            {/* Иконка */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 shadow-xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>

            {/* Заголовок */}
            <h1 className="text-5xl font-bold mb-4">
              База знаний
            </h1>
            <p className="text-xl text-primary-100 mb-10">
              Найдите ответы на часто задаваемые вопросы
            </p>

            {/* Поиск */}
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl">
              <ArticleSearch
                onArticleSelect={(article) => navigate(`/knowledge-base/${article.slug}`)}
                placeholder="Поиск по базе знаний..."
                className="[&_input]:bg-white [&_input]:border-0 [&_input]:shadow-lg"
              />
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <p className="text-3xl font-bold mb-1">
                  {articlesResponse?.meta.total || 0}
                </p>
                <p className="text-sm text-primary-100">Статей</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold mb-1">6</p>
                <p className="text-sm text-primary-100">Категорий</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold mb-1">24/7</p>
                <p className="text-sm text-primary-100">Доступ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container px-4 py-12 space-y-10">
        {/* Категории */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Выберите категорию
            </h2>
          </div>
          <CategoryFilter
            selected={selectedCategory}
            onChange={handleCategoryChange}
          />
        </div>

        {/* Популярные темы (если нет фильтра) */}
        {!selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Самые популярные
                    </h3>
                    <p className="text-sm text-gray-600">
                      Часто задаваемые вопросы
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center shrink-0">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Полезные советы
                    </h3>
                    <p className="text-sm text-gray-600">
                      Лайфхаки и рекомендации
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Новые статьи
                    </h3>
                    <p className="text-sm text-gray-600">
                      Последние обновления
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Список статей */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory
                ? getCategoryLabel(selectedCategory)
                : 'Все статьи'}
            </h2>
            {articlesResponse && (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {articlesResponse.meta.total} {articlesResponse.meta.total === 1 ? 'статья' : 'статей'}
              </span>
            )}
          </div>

          <ArticleList
            articles={articlesResponse?.data || []}
            isLoading={isLoading}
            onArticleClick={(article) => navigate(`/knowledge-base/${article.slug}`)}
          />
        </div>

        {/* CTA внизу */}
        {!selectedCategory && (
          <Card className="bg-gradient-to-r from-primary-600 to-purple-600 border-0 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">
                Не нашли ответ на свой вопрос?
              </h3>
              <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                Наши специалисты всегда готовы помочь. Создайте заявку, и мы решим вашу проблему!
              </p>
              <button
                onClick={() => navigate('/client/tickets/create')}
                className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
              >
                Создать заявку
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
