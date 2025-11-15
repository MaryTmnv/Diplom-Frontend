import { TicketPriority } from '../types/tickets.types';
import { getPriorityLabel, getPriorityColor, getPriorityIcon } from '../utils/ticketHelpers';
import { cn } from '@/shared/lib/utils/cn';

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
  showIcon?: boolean;
  className?: string;
}

const colorClasses: Record<string, string> = {
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  orange: 'bg-orange-100 text-orange-700',
  red: 'bg-red-100 text-red-700',
};

export const TicketPriorityBadge = ({ 
  priority, 
  showIcon = true,
  className 
}: TicketPriorityBadgeProps) => {
  const label = getPriorityLabel(priority);
  const color = getPriorityColor(priority);
  const icon = getPriorityIcon(priority);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
        colorClasses[color],
        priority === TicketPriority.CRITICAL && 'font-semibold',
        className
      )}
    >
      {showIcon && <span>{icon}</span>}
      {label}
    </span>
  );
};
