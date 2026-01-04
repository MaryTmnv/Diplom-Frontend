import { Template } from '../types/template.types';
import { getCategoryLabel, getCategoryIcon } from '@/features/tickets/utils/ticketHelpers';
import { cn } from '@/shared/lib/utils/cn';
import { Button } from '@/shared/ui';

import { TrendingUp, Star, Hash, Badge, Code, Zap } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  onUse: () => void;
  compact?: boolean;
}

export const TemplateCard = ({ template, onUse, compact = false }: TemplateCardProps) => {
  return (
    <div 
  className={cn(
    'group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden',
    'hover:shadow-xl hover:-translate-y-1 hover:border-[#48cae4]',
    'border-[#90e0ef]/30 bg-white',
    compact && 'p-4'
  )}
  onClick={onUse}
>
  {/* Hover эффект */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#0077b6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

  {/* Header */}
  <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-[#03045e] text-lg mb-2 line-clamp-2 group-hover:text-[#0077b6] transition-colors">
        {template.title}
      </h3>
      
      {/* Категория */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#caf0f8]/30 rounded-lg">
        <div className="w-4 h-4 flex items-center justify-center">
          <span className="text-sm">{getCategoryIcon(template.category)}</span>
        </div>
        <span className="text-xs font-medium text-[#023e8a]">
          {getCategoryLabel(template.category)}
        </span>
      </div>
    </div>

    {/* Рейтинг */}
    {template.rating > 0 && (
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 rounded-lg shrink-0">
        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        <span className="font-bold text-amber-700 text-sm">{template.rating.toFixed(1)}</span>
      </div>
    )}
  </div>

  {/* Превью контента */}
  {!compact && (
    <div className="mb-4 p-4 bg-gradient-to-br from-[#caf0f8]/20 to-[#ade8f4]/10 rounded-xl border border-[#90e0ef]/30 relative z-10">
      <p className="text-sm text-[#03045e] line-clamp-3 font-mono leading-relaxed">
        {template.content}
      </p>
    </div>
  )}

  {/* Переменные */}
    {template.variables && template.variables.length > 0 && (
      <div className="mb-4 relative z-10">
        <p className="text-xs font-semibold text-[#023e8a]/60 mb-2 flex items-center gap-1.5">
          <Code className="w-3 h-3" />
          Переменные
        </p>
        <div className="flex flex-wrap gap-2">
          {template.variables.map((variable: string) => (
            <Badge 
              key={variable}
              className="text-xs font-mono bg-[#90e0ef]/30 text-[#0077b6] border border-[#48cae4]/30 hover:bg-[#ade8f4]/50 transition-colors px-2.5 py-1 rounded-lg"
            >
              <Hash className="w-3 h-3 mr-1" />
              {variable}
            </Badge>
          ))}
        </div>
      </div>
    )}


  {/* Footer */}
  <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#90e0ef]/30 relative z-10">
    {/* Статистика */}
    <div className="flex items-center gap-2 text-xs">
      <div className="w-6 h-6 bg-[#90e0ef]/30 rounded-lg flex items-center justify-center">
        <TrendingUp className="w-3 h-3 text-[#0077b6]" />
      </div>
      <span className="text-[#023e8a]/60 font-medium">
        {template.usageCount} {template.usageCount === 1 ? 'раз' : 'раз'}
      </span>
    </div>

    {/* Кнопка */}
    <Button 
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        onUse();
      }}
      className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-4 transition-all duration-300"
    >
      <Zap className="w-3 h-3 mr-1.5" />
      Использовать
    </Button>
  </div>
</div>

  );
};
