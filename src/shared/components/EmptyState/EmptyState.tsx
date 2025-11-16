import { Button } from '@/shared/ui';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action 
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Иконка */}
      {icon && (
        <div className="mb-6 text-gray-400 text-6xl opacity-50">
          {icon}
        </div>
      )}

      {/* Заголовок */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      {/* Описание */}
      {description && (
        <p className="text-sm text-gray-600 max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Действие */}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};
