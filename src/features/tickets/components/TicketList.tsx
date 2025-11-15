import { TicketCard } from './TicketCard';
import { EmptyState } from '@/shared/components/EmptyState';
import { Skeleton } from '@/shared/ui';
import { Inbox } from 'lucide-react';
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
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!tickets || tickets.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="w-16 h-16" />}
        title="Нет заявок"
        description={emptyMessage}
      />
    );
  }

  // Tickets list
  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          variant={variant}
          onClick={() => onTicketClick?.(ticket)}
        />
      ))}
    </div>
  );
};
