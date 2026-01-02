import { TicketStatus } from '../types/tickets.types';
import { getStatusLabel } from '../utils/ticketHelpers';
import { cn } from '@/shared/lib/utils/cn';

interface TicketStatusBadgeProps {
  status: TicketStatus;
  variant?: 'default' | 'human';
  className?: string;
}

export const TicketStatusBadge = ({ 
  status, 
  variant = 'default',
  className 
}: TicketStatusBadgeProps) => {
  const label = getStatusLabel(status, variant);
  const getStatusStyles = (status: TicketStatus): string => {
  const styles: Record<TicketStatus, string> = {
      [TicketStatus.NEW]: 'bg-[#caf0f8] text-[#0077b6] border border-[#90e0ef]',
      [TicketStatus.IN_PROGRESS]: 'bg-gradient-to-r from-[#00b4d8] to-[#0096c7] text-white shadow-md',
      [TicketStatus.WAITING]: 'bg-amber-100 text-amber-700 border border-amber-300',
      [TicketStatus.RESOLVED]: 'bg-green-100 text-green-700 border border-green-300',
      [TicketStatus.CLOSED]: 'bg-[#90e0ef]/30 text-[#023e8a]/60 border border-[#90e0ef]/50',
    };
    
    return styles[status];
  };

  return (
    <span
  className={cn(
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200',
    getStatusStyles(status),
    className
  )}
>

  <span>{label}</span>
</span>

  );
};
