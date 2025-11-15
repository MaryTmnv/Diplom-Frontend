import { TicketStatus } from '../types/tickets.types';
import { getStatusLabel, getStatusColor } from '../utils/ticketHelpers';
import { cn } from '@/shared/lib/utils/cn';

interface TicketStatusBadgeProps {
  status: TicketStatus;
  variant?: 'default' | 'human';
  className?: string;
}

const colorClasses: Record<string, string> = {
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  purple: 'bg-purple-100 text-purple-700',
  gray: 'bg-gray-100 text-gray-700',
};

export const TicketStatusBadge = ({ 
  status, 
  variant = 'default',
  className 
}: TicketStatusBadgeProps) => {
  const label = getStatusLabel(status, variant);
  const color = getStatusColor(status);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        colorClasses[color],
        className
      )}
    >
      {label}
    </span>
  );
};
