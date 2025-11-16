import { ArticleCategory } from '../types/article.types';
import { getCategoryLabel, getCategoryIcon } from '../utils/articleHelpers';
import { cn } from '@/shared/lib/utils/cn';

interface CategoryFilterProps {
  selected: ArticleCategory | null;
  onChange: (category: ArticleCategory | null) => void;
}

const categories = [
  ArticleCategory.CARDS,
  ArticleCategory.DEPOSITS,
  ArticleCategory.LOANS,
  ArticleCategory.MOBILE_APP,
  ArticleCategory.PAYMENTS,
  ArticleCategory.SECURITY,
];

export const CategoryFilter = ({ selected, onChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Все */}
      <button
        onClick={() => onChange(null)}
        className={cn(
          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
          selected === null
            ? 'bg-primary-600 text-white shadow-sm'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        )}
      >
        Все
      </button>

      {/* Категории */}
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
            selected === category
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          )}
        >
          <span>{getCategoryIcon(category)}</span>
          <span>{getCategoryLabel(category)}</span>
        </button>
      ))}
    </div>
  );
};
