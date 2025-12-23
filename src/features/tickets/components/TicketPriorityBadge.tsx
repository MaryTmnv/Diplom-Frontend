import { TicketPriority } from '../types/tickets.types';
import { getPriorityLabel, getPriorityColor, getPriorityIcon } from '../utils/ticketHelpers';
import { cn } from '@/shared/lib/utils/cn';

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
  showIcon?: boolean;
  className?: string;
}

const colorClasses: Record<string, string> = {
  green: 'bg-[#caf0f8] text-[#0077b6] border border-[#90e0ef]',
  yellow: 'bg-gradient-to-r from-[#00b4d8] to-[#0096c7] text-white',
  orange: 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md',
  red: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20',
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
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200',
    colorClasses[color],
    priority === TicketPriority.CRITICAL && 'animate-pulse-subtle ring-2 ring-offset-1',
    className
  )}
>
  {showIcon && (
    <span className="flex items-center justify-center">
      {icon}
    </span>
  )}
  <span>{label}</span>
</span>

  );
};
