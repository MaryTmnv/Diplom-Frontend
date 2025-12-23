import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { ArticleSearch } from '@/features/knowledge-base/components/ArticleSearch';
import { CategoryFilter } from '@/features/knowledge-base/components/CategoryFilter';
import { ArticleList } from '@/features/knowledge-base/components/ArticleList';
import { useArticles } from '@/features/knowledge-base/hooks/useArticles';
import { ArticleCategory } from '@/features/knowledge-base/types/article.types';
import { getCategoryLabel } from '@/features/knowledge-base/utils/articleHelpers';
import { BookOpen, TrendingUp, Lightbulb, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-b from-[#caf0f8]/30 to-white">
  {/* Hero Section */}
  <div className="bg-gradient-to-br from-[#03045e] via-[#023e8a] to-[#0077b6] text-white relative overflow-hidden">
    {/* Декоративные элементы */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#0096c7]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-[#48cae4]/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00b4d8]/10 rounded-full blur-3xl" />
    </div>

    <div className="container mx-auto px-4 py-20 relative z-10">
      <Breadcrumbs 
        items={[{ label: 'База знаний' }]} 
        className="mb-10 [&_a]:text-[#90e0ef] [&_a:hover]:text-white [&_span]:text-white"
      />

      <div className="max-w-3xl mx-auto text-center">
        {/* Иконка */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl mb-8 shadow-2xl ring-1 ring-white/20">
          <BookOpen className="w-12 h-12 text-white" />
        </div>

        {/* Заголовок */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
          База знаний
        </h1>
        <p className="text-xl md:text-2xl text-[#90e0ef] mb-12 leading-relaxed">
          Найдите ответы на часто задаваемые вопросы
        </p>

        {/* Поиск */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl ring-1 ring-white/20 shadow-2xl">
          <ArticleSearch
            onArticleSelect={(article) => navigate(`/knowledge-base/${article.slug}`)}
            placeholder="Поиск по базе знаний..."
            className="[&_input]:bg-white [&_input]:border-0 [&_input]:shadow-lg [&_input]:rounded-xl [&_input]:py-4 [&_input]:text-lg"
          />
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
          <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
            <p className="text-4xl font-bold mb-2 text-white">
              {articlesResponse?.meta.total || 0}
            </p>
            <p className="text-sm text-[#90e0ef] font-medium">Статей</p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
            <p className="text-4xl font-bold mb-2 text-white">6</p>
            <p className="text-sm text-[#90e0ef] font-medium">Категорий</p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
            <p className="text-4xl font-bold mb-2 text-white">24/7</p>
            <p className="text-sm text-[#90e0ef] font-medium">Доступ</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Основной контент */}
  <div className="container mx-auto px-4 py-16 space-y-14">
    {/* Категории */}
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-[#00b4d8] to-[#0077b6] rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#03045e]">
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
        <Card className="group bg-gradient-to-br from-[#caf0f8] to-[#ade8f4] border-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#0077b6] to-[#03045e] rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#03045e] text-lg mb-1 group-hover:text-[#0077b6] transition-colors">
                  Самые популярные
                </h3>
                <p className="text-sm text-[#023e8a]/70">
                  Часто задаваемые вопросы
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-[#ade8f4] to-[#90e0ef] border-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#0096c7] to-[#0077b6] rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#03045e] text-lg mb-1 group-hover:text-[#0077b6] transition-colors">
                  Полезные советы
                </h3>
                <p className="text-sm text-[#023e8a]/70">
                  Лайфхаки и рекомендации
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-[#90e0ef] to-[#48cae4] border-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#00b4d8] to-[#0096c7] rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#03045e] text-lg mb-1 group-hover:text-[#0077b6] transition-colors">
                  Новые статьи
                </h3>
                <p className="text-sm text-[#023e8a]/70">
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#03045e]">
          {selectedCategory
            ? getCategoryLabel(selectedCategory)
            : 'Все статьи'}
        </h2>
        {articlesResponse && (
          <span className="text-sm font-medium text-[#0077b6] bg-[#caf0f8] px-4 py-2 rounded-full">
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
      <Card className="bg-gradient-to-br from-[#03045e] via-[#023e8a] to-[#0077b6] border-0 text-white rounded-3xl overflow-hidden relative">
        {/* Декоративные круги */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 border border-white/10 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-[#48cae4]/20 rounded-full blur-2xl" />
        </div>

        <CardContent className="p-10 md:p-12 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Не нашли ответ на свой вопрос?
          </h3>
          <p className="text-[#90e0ef] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Наши специалисты всегда готовы помочь. Создайте заявку, и мы решим вашу проблему!
          </p>
          <button
            onClick={() => navigate('/client/tickets/create')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#03045e] rounded-2xl font-bold text-lg hover:bg-[#caf0f8] hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Создать заявку
            <ArrowRight className="w-5 h-5" />
          </button>
        </CardContent>
      </Card>
    )}
  </div>
</div>

  );
};

export default KnowledgeBasePage;
