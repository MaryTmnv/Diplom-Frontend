import { ArticleCategory } from '../types/article.types';
import { getCategoryLabel, getCategoryIcon, getCategoryColor } from '../utils/articleHelpers';
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

const categoryGradients: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  indigo: 'from-indigo-500 to-indigo-600',
  yellow: 'from-yellow-500 to-yellow-600',
  red: 'from-red-500 to-red-600',
};

export const CategoryFilter = ({ selected, onChange }: CategoryFilterProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Все */}
      <button
        onClick={() => onChange(null)}
        className={cn(
          'group relative overflow-hidden rounded-xl p-6 text-left transition-all',
          'border-2',
          selected === null
            ? 'border-primary-600 bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg scale-105'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        )}
      >
        <div className="relative z-10">
          <div className="text-3xl mb-2">📚</div>
          <p className={cn(
            'font-semibold text-lg',
            selected === null ? 'text-primary-700' : 'text-gray-900'
          )}>
            Все категории
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Показать всё
          </p>
        </div>
        {selected === null && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-purple-600/5" />
        )}
      </button>

      {/* Категории */}
      {categories.map((category) => {
        const color = getCategoryColor(category);
        const isSelected = selected === category;

        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={cn(
              'group relative overflow-hidden rounded-xl p-6 text-left transition-all',
              'border-2',
              isSelected
                ? 'border-primary-600 bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            )}
          >
            <div className="relative z-10">
              <div className="text-3xl mb-2">
                {getCategoryIcon(category)}
              </div>
              <p className={cn(
                'font-semibold text-lg',
                isSelected ? 'text-primary-700' : 'text-gray-900'
              )}>
                {getCategoryLabel(category)}
              </p>
            </div>
            
            {/* Градиент при hover */}
            {!isSelected && (
              <div className={cn(
                'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity',
                'bg-gradient-to-br',
                categoryGradients[color],
                'opacity-5'
              )} />
            )}
          </button>
        );
      })}
    </div>
  );
};
