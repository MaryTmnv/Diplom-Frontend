import { TicketStatusBadge } from './TicketStatusBadge';
import { TicketPriorityBadge } from './TicketPriorityBadge';
import { getCategoryLabel, getCategoryIcon } from '../utils/ticketHelpers';
import { formatRelativeTime } from '@/shared/lib/utils/formatters';
import { MessageSquare, Clock, Star } from 'lucide-react';
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
    'group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden',
    'hover:shadow-xl hover:-translate-y-1',
    ticket.unreadCount && ticket.unreadCount > 0
      ? 'border-l-4 border-l-[#00b4d8] bg-gradient-to-r from-[#caf0f8]/30 to-white shadow-md'
      : 'border-[#90e0ef]/30 bg-white hover:border-[#48cae4]'
  )}
>
  {/* Индикатор непрочитанных сообщений */}
  {ticket.unreadCount && ticket.unreadCount > 0 && (
    <div className="absolute top-0 right-0 w-2 h-2 bg-[#00b4d8] rounded-full animate-pulse" />
  )}

  {/* Header */}
  <div className="flex items-start justify-between gap-4 mb-4">
    <div className="flex-1 min-w-0">
      {/* Номер заявки */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono font-semibold text-[#0077b6] bg-[#caf0f8]/50 px-2 py-1 rounded-lg">
          {ticket.number}
        </span>
        {ticket.unreadCount && ticket.unreadCount > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#00b4d8] to-[#0096c7] px-2.5 py-1 rounded-full shadow-sm">
            <MessageSquare className="w-3 h-3" />
            {ticket.unreadCount}
          </span>
        )}
      </div>

      {/* Заголовок */}
      <h3 className="font-bold text-[#03045e] text-lg line-clamp-2 mb-3 group-hover:text-[#0077b6] transition-colors">
        {ticket.title}
      </h3>

      {/* Категория */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#caf0f8]/30 rounded-lg">
        <div className="w-5 h-5 flex items-center justify-center">
          <span className="text-sm">{getCategoryIcon(ticket.category)}</span>
        </div>
        <span className="text-sm font-medium text-[#023e8a]">
          {getCategoryLabel(ticket.category)}
        </span>
      </div>
    </div>

    {/* Приоритет */}
    <div className="shrink-0">
      <TicketPriorityBadge priority={ticket.priority} />
    </div>
  </div>

  {/* Footer */}
  <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#90e0ef]/30">
    <div className="flex items-center gap-4 text-xs">
      {/* Время */}
      <div className="flex items-center gap-1.5 text-[#023e8a]/60">
        <div className="w-6 h-6 bg-[#90e0ef]/30 rounded-lg flex items-center justify-center">
          <Clock className="w-3 h-3 text-[#0077b6]" />
        </div>
        <span className="font-medium">{formatRelativeTime(ticket.createdAt)}</span>
      </div>

      {/* Оператор (для клиента) */}
      {isClient && ticket.operator && (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-[#0096c7] to-[#023e8a] rounded-lg flex items-center justify-center text-white text-[10px] font-bold">
            {ticket.operator.firstName[0]}{ticket.operator.lastName[0]}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-[#023e8a]/40 leading-none">Оператор</span>
            <span className="font-semibold text-[#03045e] leading-tight">
              {ticket.operator.firstName} {ticket.operator.lastName}
            </span>
          </div>
        </div>
      )}

      {/* Клиент (для оператора) */}
      {!isClient && ticket.client && (
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-6 h-6 bg-gradient-to-br from-[#48cae4] to-[#0096c7] rounded-lg flex items-center justify-center text-white text-[10px] font-bold">
              {ticket.client.firstName[0]}{ticket.client.lastName[0]}
            </div>
            {ticket.client.clientProfile?.isVip && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                <Star className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {ticket.client.clientProfile?.isVip && (
              <span className="text-[10px] font-bold text-amber-600 leading-none flex items-center gap-0.5">
                <Star className="w-2 h-2" />
                VIP
              </span>
            )}
            <span className="font-semibold text-[#03045e] leading-tight">
              {ticket.client.firstName} {ticket.client.lastName}
            </span>
          </div>
        </div>
      )}
    </div>

    {/* Статус */}
    <div className="shrink-0">
      <TicketStatusBadge status={ticket.status} />
    </div>
  </div>

  {/* Hover эффект */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#0077b6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
</div>

  );
};
