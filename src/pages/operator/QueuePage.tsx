import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { useAssignTicket } from '@/features/tickets/hooks/useAssignTicket';
import { TicketList } from '@/features/tickets/components/TicketList';
import { useQueue } from '@/features/tickets/hooks/useQueue';
import { TicketPriority, TicketCategory } from '@/features/tickets/types/tickets.types';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';
import { SlidersHorizontal, Filter, Badge } from 'lucide-react';


export const QueuePage = () => {
  const navigate = useNavigate();
  const { data: queueTickets = [], isLoading } = useQueue();
  const { mutate: assignTicket } = useAssignTicket();

  const [selectedPriorities, setSelectedPriorities] = useState<TicketPriority[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<TicketCategory[]>([]);

  // Фильтрация
  const filteredTickets = useMemo(() => {
    let filtered = queueTickets;

    if (selectedPriorities.length > 0) {
      filtered = filtered.filter((t) => selectedPriorities.includes(t.priority));
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((t) => selectedCategories.includes(t.category));
    }

    return filtered;
  }, [queueTickets, selectedPriorities, selectedCategories]);

  // Статистика
  const stats = useMemo(() => {
    return {
      total: queueTickets.length,
      critical: queueTickets.filter((t) => t.priority === TicketPriority.CRITICAL).length,
      high: queueTickets.filter((t) => t.priority === TicketPriority.HIGH).length,
      vip: queueTickets.filter((t) => t.client?.clientProfile?.isVip).length,
    };
  }, [queueTickets]);

  const handleTakeTicket = (ticketId: string) => {
    assignTicket(
      { id: ticketId },
      {
        onSuccess: () => {
          navigate(`/operator/tickets/${ticketId}`);
        },
      }
    );
  };

  const togglePriority = (priority: TicketPriority) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  const toggleCategory = (category: TicketCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Очередь заявок' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Очередь заявок</h1>
          <p className="text-gray-600 mt-1">Новые обращения клиентов</p>
        </div>

        <Button variant="outline" size="sm">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Фильтры
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>В очереди</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Критические</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.critical}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Высокий приоритет</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{stats.high}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>VIP клиенты</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.vip}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Фильтры */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <CardTitle className="text-base">Фильтры</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Приоритеты */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Приоритет:</p>
            <div className="flex flex-wrap gap-2">
              {Object.values(TicketPriority).map((priority) => (
                <Badge
                  key={priority}
                  // variant={selectedPriorities.includes(priority) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => togglePriority(priority)}
                >
                  {priority}
                </Badge>
              ))}
            </div>
          </div>

          {/* Категории */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Категория:</p>
            <div className="flex flex-wrap gap-2">
              {Object.values(TicketCategory).map((category) => (
                <Badge
                  key={category}
                  // variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Сброс */}
          {(selectedPriorities.length > 0 || selectedCategories.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedPriorities([]);
                setSelectedCategories([]);
              }}
            >
              Сбросить фильтры
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Список заявок */}
      <Card>
        <CardHeader>
          <CardTitle>Заявки в очереди ({filteredTickets.length})</CardTitle>
          <CardDescription>
            Нажмите на заявку чтобы взять её в работу
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TicketList
            tickets={filteredTickets}
            isLoading={isLoading}
            variant="operator"
            emptyMessage="В очереди нет заявок. Отличная работа! 🎉"
            onTicketClick={(ticket) => {
              if (window.confirm(`Взять заявку ${ticket.number} в работу?`)) {
                handleTakeTicket(ticket.id);
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default QueuePage;
