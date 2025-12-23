import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { Card, CardContent } from '@/shared/ui';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
  icon: React.ReactNode;
  invertColors?: boolean; // Для метрик где уменьшение = хорошо
}

export const MetricsCard = ({
  title,
  value,
  change,
  trend,
  icon,
  invertColors = false,
}: MetricsCardProps) => {
  const isPositive = invertColors ? trend === 'down' : trend === 'up';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {trend === 'up' ? (
                  <TrendingUp className={cn('w-4 h-4', isPositive ? 'text-green-600' : 'text-red-600')} />
                ) : (
                  <TrendingDown className={cn('w-4 h-4', isPositive ? 'text-green-600' : 'text-red-600')} />
                )}
                <span className={cn('text-sm font-semibold', isPositive ? 'text-green-600' : 'text-red-600')}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
                <span className="text-xs text-gray-500">от прошлой недели</span>
              </div>
            )}
          </div>

          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-primary-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
