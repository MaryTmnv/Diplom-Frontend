import { Button } from '@/shared/ui';
import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {  // ← добавить
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action,
  secondaryAction  // ← добавить в деструктуризацию
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Иконка */}
      {icon && (
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#caf0f8] to-[#ade8f4] rounded-3xl flex items-center justify-center mb-6 shadow-lg">
          {typeof icon === 'string' ? (
            <span className="text-4xl md:text-5xl">{icon}</span>
          ) : (
            <div className="text-[#0077b6] [&>svg]:w-10 [&>svg]:h-10 md:[&>svg]:w-12 md:[&>svg]:h-12">
              {icon}
            </div>
          )}
        </div>
      )}

      {/* Заголовок */}
      <h3 className="text-xl md:text-2xl font-bold text-[#03045e] mb-3">
        {title}
      </h3>

      {/* Описание */}
      {description && (
        <p className="text-sm md:text-base text-[#023e8a]/60 max-w-md mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {/* Действие */}
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-6 transition-all duration-300"
        >
          {action.icon && (
            <span className="mr-2">{action.icon}</span>
          )}
          {action.label}
        </Button>
      )}

      {/* Дополнительные ссылки */}
      {secondaryAction && (
        <Button
          variant="ghost"
          onClick={secondaryAction.onClick}
          className="mt-3 text-[#023e8a]/70 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-xl transition-all"
        >
          {secondaryAction.icon && (
            <span className="mr-2">{secondaryAction.icon}</span>
          )}
          {secondaryAction.label}
        </Button>
      )}
    </div>
  );
};

