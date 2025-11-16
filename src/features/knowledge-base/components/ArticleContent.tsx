import { ArticleDetail } from '../types/article.types';
import { getCategoryLabel, getCategoryIcon } from '../utils/articleHelpers';
import { Breadcrumbs } from '@/shared/components/Navigation';

import { useRateArticle } from '../hooks/useArticleDetail';
import { Eye, Clock, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDate } from '@/shared/lib/utils/formatters';
import { Card, CardContent, Button } from '@/shared/ui';
import { ArticleCard } from './ArticleCard';

interface ArticleContentProps {
  article: ArticleDetail;
}

export const ArticleContent = ({ article }: ArticleContentProps) => {
  const { mutate: rateArticle } = useRateArticle();

  const handleRate = (helpful: boolean) => {
    rateArticle({ id: article.id, helpful });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'База знаний', href: '/knowledge-base' },
          { label: getCategoryLabel(article.category), href: `/knowledge-base?category=${article.category}` },
          { label: article.title },
        ]}
      />

      {/* Header */}
      <div className="max-w-4xl mx-auto">
        {/* Категория */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{getCategoryIcon(article.category)}</span>
          <span className="text-sm font-medium text-gray-600">
            {getCategoryLabel(article.category)}
          </span>
        </div>

        {/* Заголовок */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>

        {/* Метаинформация */}
        <div className="flex items-center gap-6 text-sm text-gray-600 pb-6 border-b">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{article.views} просмотров</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{article.readingTime} мин чтения</span>
          </div>

          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{article.helpfulPercentage}% полезно</span>
          </div>

          <div className="flex items-center gap-1 text-gray-400">
            <span>Обновлено: {formatDate(article.updatedAt || article.createdAt, 'dd.MM.yyyy')}</span>
          </div>
        </div>
      </div>

      {/* Контент */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Кастомные компоненты для markdown
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-gray-700 leading-relaxed mb-4" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700" {...props} />
                ),
                code: ({ node, inline, ...props }: any) =>
                  inline ? (
                    <code className="px-1.5 py-0.5 bg-gray-100 text-gray-900 rounded text-sm font-mono" {...props} />
                  ) : (
                    <code className="block p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm font-mono" {...props} />
                  ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-primary-600 hover:text-primary-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                img: ({ node, ...props }) => (
                  <img className="rounded-lg my-4 max-w-full h-auto" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 my-4" {...props} />
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Оценка статьи */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-4">
              Была ли эта статья полезна?
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant={article.userRating === true ? 'default' : 'outline'}
                onClick={() => handleRate(true)}
                className="gap-2"
              >
                <ThumbsUp className="w-4 h-4" />
                Да, помогло
              </Button>

              <Button
                variant={article.userRating === false ? 'default' : 'outline'}
                onClick={() => handleRate(false)}
                className="gap-2"
              >
                <ThumbsDown className="w-4 h-4" />
                Нет, не помогло
              </Button>
            </div>

            {article.userRating !== null && (
              <p className="text-sm text-gray-500 mt-3">
                Спасибо за вашу оценку!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Похожие статьи */}
      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Похожие статьи
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {article.relatedArticles.map((related) => (
              <ArticleCard
                key={related.id}
                article={related}
                onClick={() => window.location.href = `/knowledge-base/${related.slug}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <CardContent className="p-6 text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Не нашли решение?
          </p>
          <p className="text-gray-600 mb-4">
            Создайте заявку, и наши специалисты помогут вам
          </p>
          <Button onClick={() => window.location.href = '/client/tickets/create'}>
            Создать заявку
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
