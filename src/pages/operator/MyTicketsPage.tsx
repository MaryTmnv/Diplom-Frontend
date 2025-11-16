import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { TicketList } from '@/features/tickets/components/TicketList';
import { useMyActiveTickets } from '@/features/tickets/hooks/useMyActiveTickets';
import { useMemo } from 'react';
import { TicketStatus } from '@/features/tickets/types/tickets.types';
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from '@/shared/ui';

export const MyTicketsPage = () => {
  const navigate = useNavigate();
  const { data: myTickets = [], isLoading } = useMyActiveTickets();

  // Статистика
  const stats = useMemo(() => {
    return {
      total: myTickets.length,
      inProgress: myTickets.filter((t) => t.status === TicketStatus.IN_PROGRESS).length,
      waiting: myTickets.filter((t) => t.status === TicketStatus.WAITING).length,
      unread: myTickets.reduce((sum, t) => sum + (t.unreadCount || 0), 0),
    };
  }, [myTickets]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Мои заявки' }]} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Мои активные заявки</h1>
        <p className="text-gray-600 mt-1">Заявки, которые вы сейчас обрабатываете</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Всего</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>В работе</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.inProgress}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ожидание</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.waiting}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Непрочитанных</CardDescription>
            <CardTitle className="text-3xl text-primary-600">{stats.unread}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Список заявок */}
      <Card>
        <CardHeader>
          <CardTitle>Активные заявки</CardTitle>
          <CardDescription>Заявки, назначенные на вас</CardDescription>
        </CardHeader>
        <CardContent>
          <TicketList
            tickets={myTickets}
            isLoading={isLoading}
            variant="operator"
            emptyMessage="У вас нет активных заявок. Возьмите заявку из очереди!"
            onTicketClick={(ticket) => navigate(`/operator/tickets/${ticket.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MyTicketsPage;
