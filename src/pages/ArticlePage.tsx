import { useParams, useNavigate } from 'react-router-dom';
import { ArticleContent } from '@/features/knowledge-base/components/ArticleContent';
import { useArticleDetail } from '@/features/knowledge-base/hooks/useArticleDetail';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { EmptyState } from '@/shared/components/EmptyState';

export const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: article, isLoading, error } = useArticleDetail(slug!);

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Загрузка статьи..." />;
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          icon="📖"
          title="Статья не найдена"
          description="Возможно, она была удалена или перемещена."
          action={{
            label: 'Вернуться к базе знаний',
            onClick: () => navigate('/knowledge-base'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <ArticleContent article={article} />
      </div>
    </div>
  );
};

export default ArticlePage;
