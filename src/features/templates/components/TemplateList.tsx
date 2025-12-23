import { Button, Skeleton } from '@/shared/ui';
import { Template } from '../types/template.types';
import { TemplateCard } from './TemplateCard';
import { EmptyState } from '@/shared/components/EmptyState';
import { FileText, Info, LayoutGrid, List, Plus, RotateCcw } from 'lucide-react';

interface TemplateListProps {
  templates: Template[];
  isLoading?: boolean;
  onUse: (template: Template) => void;
}

export const TemplateList = ({ templates, isLoading, onUse }: TemplateListProps) => {
  // Loading state
  // Loading state
if (isLoading) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="p-5 rounded-2xl border-2 border-[#90e0ef]/30 bg-white space-y-4 animate-pulse"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4 rounded-lg bg-[#ade8f4]/30" />
              <Skeleton className="h-8 w-24 rounded-lg bg-[#caf0f8]/50" />
            </div>
            <Skeleton className="h-8 w-12 rounded-lg bg-amber-100" />
          </div>

          {/* Content preview */}
          <Skeleton className="h-24 w-full rounded-xl bg-[#caf0f8]/30" />

          {/* Variables */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-lg bg-[#90e0ef]/30" />
            <Skeleton className="h-6 w-20 rounded-lg bg-[#90e0ef]/30" />
            <Skeleton className="h-6 w-14 rounded-lg bg-[#90e0ef]/30" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#90e0ef]/20">
            <Skeleton className="h-6 w-20 rounded-lg bg-[#90e0ef]/30" />
            <Skeleton className="h-8 w-28 rounded-xl bg-[#0077b6]/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty state
if (!templates || templates.length === 0) {
  return (
    <div className="py-16 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-[#caf0f8] to-[#ade8f4] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
        <FileText className="w-12 h-12 text-[#0077b6]" />
      </div>
      <h3 className="text-2xl font-bold text-[#03045e] mb-3">
        Шаблоны не найдены
      </h3>
      <p className="text-[#023e8a]/60 max-w-md mx-auto leading-relaxed mb-6">
        Попробуйте изменить фильтры или поисковый запрос
      </p>

      {/* Действия */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="border-[#0077b6] text-[#0077b6] hover:bg-[#0077b6] hover:text-white rounded-xl transition-all"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Сбросить фильтры
        </Button>
        
        <Button
          className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-6 transition-all duration-300"
          onClick={() => window.location.href = '/operator/templates/create'}
        >
          <Plus className="w-4 h-4 mr-2" />
          Создать шаблон
        </Button>
      </div>

      {/* Подсказка */}
      <div className="mt-8 p-4 bg-[#caf0f8]/20 rounded-xl max-w-md mx-auto">
        <p className="text-xs text-[#023e8a]/50 flex items-center justify-center gap-2">
          <Info className="w-3 h-3" />
          Шаблоны помогают быстрее отвечать на типовые вопросы
        </p>
      </div>
    </div>
  );
}

// Templates grid
return (
  <div className="space-y-6">
    {/* Заголовок списка */}
    <div className="flex items-center justify-between px-2">
      <p className="text-sm text-[#023e8a]/50 font-medium">
        Найдено шаблонов: {templates.length}
      </p>
      
      {/* Переключатель вида (опционально) */}
      <div className="flex items-center gap-1 bg-[#caf0f8]/30 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-[#0077b6] bg-white shadow-sm rounded-md"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-[#023e8a]/50 hover:text-[#0077b6] rounded-md"
        >
          <List className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>

    {/* Grid шаблонов */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template, index) => (
        <div
          key={template.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <TemplateCard
            template={template}
            onUse={() => onUse(template)}
          />
        </div>
      ))}
    </div>

    {/* Индикатор конца списка */}
    {templates.length >= 12 && (
      <div className="pt-4 text-center">
        <p className="text-xs text-[#023e8a]/40">
          Показаны все шаблоны
        </p>
      </div>
    )}
  </div>
);
};
