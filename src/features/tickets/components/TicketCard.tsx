import { TicketStatusBadge } from './TicketStatusBadge';
import { TicketPriorityBadge } from './TicketPriorityBadge';
import { getCategoryLabel, getCategoryIcon } from '../utils/ticketHelpers';
import { formatRelativeTime } from '@/shared/lib/utils/formatters';
import { MessageSquare, Clock } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { Ticket } from '../types/tickets.types';

interface TicketCardProps {
  ticket: Ticket;
  variant: 'client' | 'operator';
  onClick?: () => void;
}

export const TicketCard = ({ ticket, variant, onClick }: TicketCardProps) => {
  const isClient = variant === 'client';

  return (
    <div
      onClick={onClick}
      className={cn(
        'card-interactive p-4',
        ticket.unreadCount && ticket.unreadCount > 0 && 'border-l-4 border-l-primary-500'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          {/* Номер заявки */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-500">
              {ticket.number}
            </span>
            {ticket.unreadCount && ticket.unreadCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-primary-600 font-medium">
                <MessageSquare className="w-3 h-3" />
                {ticket.unreadCount}
              </span>
            )}
          </div>

          {/* Заголовок */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
            {ticket.title}
          </h3>

          {/* Категория */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>{getCategoryIcon(ticket.category)}</span>
            <span>{getCategoryLabel(ticket.category)}</span>
          </div>
        </div>

        {/* Приоритет */}
        <TicketPriorityBadge priority={ticket.priority} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {/* Время */}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(ticket.createdAt)}</span>
          </div>

          {/* Оператор (для клиента) или Клиент (для оператора) */}
          {isClient && ticket.operator && (
            <div className="flex items-center gap-1">
              <span>Оператор:</span>
              <span className="font-medium text-gray-700">
                {ticket.operator.firstName} {ticket.operator.lastName}
              </span>
            </div>
          )}

          {!isClient && ticket.client && (
            <div className="flex items-center gap-1">
              {ticket.client.clientProfile?.isVip && (
                <span className="text-yellow-600 font-semibold">⭐ VIP</span>
              )}
              <span className="font-medium text-gray-700">
                {ticket.client.firstName} {ticket.client.lastName}
              </span>
            </div>
          )}
        </div>

        {/* Статус */}
        <TicketStatusBadge status={ticket.status} />
      </div>
    </div>
  );
};
