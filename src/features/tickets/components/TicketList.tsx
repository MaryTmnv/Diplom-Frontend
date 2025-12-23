import { TicketCard } from './TicketCard';
import { EmptyState } from '@/shared/components/EmptyState';
import { Button, Skeleton } from '@/shared/ui';
import { ArrowUpDown, Inbox, Plus, Search } from 'lucide-react';
import { Ticket } from '../types/tickets.types';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  emptyMessage?: string;
  variant: 'client' | 'operator';
  onTicketClick?: (ticket: Ticket) => void;
}

export const TicketList = ({
  tickets,
  isLoading,
  emptyMessage = 'Заявок пока нет',
  variant,
  onTicketClick,
}: TicketListProps) => {
  // Loading state
  // Loading state
if (isLoading) {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div 
          key={i} 
          className="p-5 rounded-2xl border-2 border-[#90e0ef]/30 bg-white space-y-4 animate-pulse"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              {/* Number */}
              <Skeleton className="h-6 w-24 rounded-lg bg-[#caf0f8]/50" />
              {/* Title */}
              <Skeleton className="h-6 w-full rounded-lg bg-[#ade8f4]/30" />
              <Skeleton className="h-6 w-3/4 rounded-lg bg-[#ade8f4]/30" />
              {/* Category */}
              <Skeleton className="h-8 w-32 rounded-lg bg-[#90e0ef]/30" />
            </div>
            {/* Priority badge */}
            <Skeleton className="h-7 w-20 rounded-full bg-[#caf0f8]/50" />
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-[#90e0ef]/20">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6 rounded-lg bg-[#90e0ef]/30" />
              <Skeleton className="h-4 w-32 rounded bg-[#ade8f4]/30" />
            </div>
            {/* Status badge */}
            <Skeleton className="h-7 w-24 rounded-full bg-[#caf0f8]/50" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty state
if (!tickets || tickets.length === 0) {
  return (
    <div className="py-16 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-[#caf0f8] to-[#ade8f4] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
        <Inbox className="w-12 h-12 text-[#0077b6]" />
      </div>
      <h3 className="text-2xl font-bold text-[#03045e] mb-3">
        Нет заявок
      </h3>
      <p className="text-[#023e8a]/60 max-w-md mx-auto leading-relaxed">
        {emptyMessage || 'Заявки появятся здесь, когда будут созданы'}
      </p>
      
      {/* Дополнительные действия (опционально) */}
      {variant === 'client' && (
        <Button
          className="mt-6 bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-6 transition-all duration-300"
          onClick={() => window.location.href = '/client/tickets/create'}
        >
          <Plus className="w-4 h-4 mr-2" />
          Создать заявку
        </Button>
      )}
      
      {variant === 'operator' && (
        <Button
          className="mt-6 bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-6 transition-all duration-300"
          onClick={() => window.location.href = '/operator/queue'}
        >
          <Search className="w-4 h-4 mr-2" />
          Перейти к очереди
        </Button>
      )}
    </div>
  );
}

// Tickets list
return (
  <div className="space-y-4">
    {/* Заголовок списка (опционально) */}
    {tickets.length > 0 && (
      <div className="flex items-center justify-between px-2 mb-2">
        <p className="text-sm text-[#023e8a]/50 font-medium">
          Найдено заявок: {tickets.length}
        </p>
        
        {/* Сортировка (опционально) */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-[#023e8a]/60 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-lg"
          >
            <ArrowUpDown className="w-3 h-3 mr-1" />
            Сортировка
          </Button>
        </div>
      </div>
    )}

    {/* Список карточек */}
    {tickets.map((ticket, index) => (
      <div
        key={ticket.id}
        className="animate-fade-in"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <TicketCard
          ticket={ticket}
          variant={variant}
          onClick={() => onTicketClick?.(ticket)}
        />
      </div>
    ))}

    {/* Индикатор конца списка */}
    {tickets.length >= 10 && (
      <div className="pt-4 text-center">
        <p className="text-xs text-[#023e8a]/40">
          Показаны все заявки
        </p>
      </div>
    )}
  </div>
  );
};
