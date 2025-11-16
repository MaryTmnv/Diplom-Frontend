import { Skeleton } from '@/shared/ui';
import { Template } from '../types/template.types';
import { TemplateCard } from './TemplateCard';
import { EmptyState } from '@/shared/components/EmptyState';
import { FileText } from 'lucide-react';

interface TemplateListProps {
  templates: Template[];
  isLoading?: boolean;
  onUse: (template: Template) => void;
}

export const TemplateList = ({ templates, isLoading, onUse }: TemplateListProps) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!templates || templates.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="w-16 h-16" />}
        title="Шаблоны не найдены"
        description="Попробуйте изменить фильтры или поисковый запрос"
      />
    );
  }

  // Templates grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onUse={() => onUse(template)}
        />
      ))}
    </div>
  );
};
