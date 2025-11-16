import { ArticleCategory } from '../types/article.types';

export const getCategoryLabel = (category: ArticleCategory): string => {
  const labels: Record<ArticleCategory, string> = {
    [ArticleCategory.CARDS]: 'Карты',
    [ArticleCategory.DEPOSITS]: 'Вклады',
    [ArticleCategory.LOANS]: 'Кредиты',
    [ArticleCategory.MOBILE_APP]: 'Мобильное приложение',
    [ArticleCategory.PAYMENTS]: 'Платежи',
    [ArticleCategory.SECURITY]: 'Безопасность',
  };
  return labels[category];
};

export const getCategoryIcon = (category: ArticleCategory): string => {
  const icons: Record<ArticleCategory, string> = {
    [ArticleCategory.CARDS]: '💳',
    [ArticleCategory.DEPOSITS]: '💰',
    [ArticleCategory.LOANS]: '💵',
    [ArticleCategory.MOBILE_APP]: '📱',
    [ArticleCategory.PAYMENTS]: '💸',
    [ArticleCategory.SECURITY]: '🔒',
  };
  return icons[category];
};

export const getCategoryColor = (category: ArticleCategory): string => {
  const colors: Record<ArticleCategory, string> = {
    [ArticleCategory.CARDS]: 'blue',
    [ArticleCategory.DEPOSITS]: 'green',
    [ArticleCategory.LOANS]: 'purple',
    [ArticleCategory.MOBILE_APP]: 'indigo',
    [ArticleCategory.PAYMENTS]: 'yellow',
    [ArticleCategory.SECURITY]: 'red',
  };
  return colors[category];
};
