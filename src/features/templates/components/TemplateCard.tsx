import { Template } from '../types/template.types';
import { getCategoryLabel, getCategoryIcon } from '@/features/tickets/utils/ticketHelpers';
import { Button } from '@/shared/ui';

import { TrendingUp, Star, Hash, Badge } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  onUse: () => void;
  compact?: boolean;
}

export const TemplateCard = ({ template, onUse, compact = false }: TemplateCardProps) => {
  return (
    <div className="card-interactive">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {template.title}
          </h3>
          
          {/* Категория */}
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>{getCategoryIcon(template.category)}</span>
            <span>{getCategoryLabel(template.category)}</span>
          </div>
        </div>

        {/* Рейтинг */}
        {template.rating > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{template.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Превью контента */}
      {!compact && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 line-clamp-3 font-mono">
            {template.content}
          </p>
        </div>
      )}

      {/* Переменные */}
      {template.variables.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Переменные:</p>
          <div className="flex flex-wrap gap-1">
            {template.variables.map((variable) => (
              <Badge key={variable}  className="text-xs">
                <Hash className="w-3 h-3 mr-1" />
                {variable}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
        {/* Статистика */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <TrendingUp className="w-3 h-3" />
          <span>Использован {template.usageCount} раз</span>
        </div>

        {/* Кнопка */}
        <Button size="sm" onClick={onUse}>
          Использовать
        </Button>
      </div>
    </div>
  );
};
