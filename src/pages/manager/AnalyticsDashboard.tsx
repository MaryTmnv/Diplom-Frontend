import { useState } from 'react';
import { Breadcrumbs } from '@/shared/components/Navigation';

import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  Users, 
  ThumbsUp,
  Download,
  Calendar
} from 'lucide-react';
import { CategoryDistribution } from '@/features/analytics/components/CategoryDistribution';
import { MetricsCard } from '@/features/analytics/components/MetricsCard';
import { TicketsChart } from '@/features/analytics/components/TicketsChart';
import { TopIssues } from '@/features/analytics/components/TopIssues';
import { PerformanceTable } from '@/features/analytics/PerfomanceTable';
import { Select, Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui';
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select';

type Period = 'today' | 'week' | 'month' | 'quarter' | 'year';

const AnalyticsDashboard = () => {
  const [period, setPeriod] = useState<Period>('week');

  // Mock данные (в реальности будут из API)
  const metrics = {
    totalTickets: 245,
    totalChange: 12,
    resolvedTickets: 198,
    resolvedChange: 8,
    avgResolutionTime: 2.4, // часы
    timeChange: -5,
    satisfaction: 94, // проценты
    satisfactionChange: 2,
  };

  const handleExport = () => {
    // TODO: Реализовать экспорт
    console.log('Экспорт отчёта...');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Аналитика' }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Аналитика</h1>
          <p className="text-gray-600 mt-1">Обзор производительности поддержки</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Селектор периода */}
          <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Сегодня</SelectItem>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="quarter">Квартал</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectContent>
          </Select>

          {/* Кнопка экспорта */}
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Ключевые метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Всего заявок"
          value={metrics.totalTickets}
          change={metrics.totalChange}
          trend={metrics.totalChange > 0 ? 'up' : 'down'}
          icon={<TrendingUp className="w-5 h-5" />}
        />

        <MetricsCard
          title="Решённые"
          value={metrics.resolvedTickets}
          change={metrics.resolvedChange}
          trend="up"
          icon={<CheckCircle className="w-5 h-5" />}
        />

        <MetricsCard
          title="Среднее время"
          value={`${metrics.avgResolutionTime} ч`}
          change={metrics.timeChange}
          trend="down"
          icon={<Clock className="w-5 h-5" />}
          invertColors
        />

        <MetricsCard
          title="Удовлетворённость"
          value={`${metrics.satisfaction}%`}
          change={metrics.satisfactionChange}
          trend="up"
          icon={<ThumbsUp className="w-5 h-5" />}
        />
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* График заявок */}
        <Card>
          <CardHeader>
            <CardTitle>График заявок</CardTitle>
            <CardDescription>Динамика за последние 7 дней</CardDescription>
          </CardHeader>
          <CardContent>
            <TicketsChart period={period} />
          </CardContent>
        </Card>

        {/* Распределение по категориям */}
        <Card>
          <CardHeader>
            <CardTitle>Распределение по категориям</CardTitle>
            <CardDescription>Топ категорий обращений</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryDistribution />
          </CardContent>
        </Card>
      </div>

      {/* Таблицы */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Производительность операторов */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              <CardTitle>Производительность команды</CardTitle>
            </div>
            <CardDescription>Топ 5 операторов за период</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceTable />
          </CardContent>
        </Card>

        {/* Топ проблем */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <CardTitle>Частые проблемы</CardTitle>
            </div>
            <CardDescription>Самые распространённые обращения</CardDescription>
          </CardHeader>
          <CardContent>
            <TopIssues />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
