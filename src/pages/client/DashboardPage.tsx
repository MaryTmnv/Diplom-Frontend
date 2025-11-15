import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import { TicketList } from '@/features/tickets/components/TicketList';
import { useTickets } from '@/features/tickets/hooks/useTickets';
import { TicketStatus } from '@/features/tickets/types/tickets.types';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { Button, Card, CardHeader, CardDescription, CardTitle, CardContent } from '@/shared/ui';

export const DashboardPage = () => {
  const navigate = useNavigate();
  
  // Загружаем все заявки
  const { data: ticketsResponse, isLoading } = useTickets();

  // Вычисляем статистику
  const stats = useMemo(() => {
    const tickets = ticketsResponse?.data || [];
    
    return {
      active: tickets.filter(
        (t) => t.status === TicketStatus.NEW || t.status === TicketStatus.IN_PROGRESS
      ).length,
      resolved: tickets.filter((t) => t.status === TicketStatus.RESOLVED).length,
      total: tickets.length,
    };
  }, [ticketsResponse]);

  // Активные заявки
  const activeTickets = useMemo(() => {
    return ticketsResponse?.data.filter(
      (t) => t.status !== TicketStatus.CLOSED && t.status !== TicketStatus.RESOLVED
    ) || [];
  }, [ticketsResponse]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Мои заявки' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Мои заявки</h1>
          <p className="text-gray-600 mt-1">Управление вашими обращениями</p>
        </div>

        <Button onClick={() => navigate('/client/tickets/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Создать заявку
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Активные</CardDescription>
            <CardTitle className="text-3xl">{stats.active}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Решённые</CardDescription>
            <CardTitle className="text-3xl">{stats.resolved}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Всего</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Список активных заявок */}
      <Card>
        <CardHeader>
          <CardTitle>Активные заявки</CardTitle>
          <CardDescription>Ваши текущие обращения в поддержку</CardDescription>
        </CardHeader>
        <CardContent>
          <TicketList
            tickets={activeTickets}
            isLoading={isLoading}
            variant="client"
            emptyMessage="У вас пока нет активных заявок. Создайте первую заявку, чтобы получить помощь."
            onTicketClick={(ticket) => navigate(`/client/tickets/${ticket.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
