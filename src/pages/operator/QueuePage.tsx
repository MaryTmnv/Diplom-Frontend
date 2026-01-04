import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { useAssignTicket } from '@/features/tickets/hooks/useAssignTicket';
import { TicketList } from '@/features/tickets/components/TicketList';
import { useQueue } from '@/features/tickets/hooks/useQueue';
import { Ticket, TicketPriority, TicketCategory } from '@/features/tickets/types/tickets.types';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';
import { 
  SlidersHorizontal, Filter, Badge, Info, AlertTriangle, ArrowUp, 
  ArrowUpDown, FileText, Inbox, Layers, PartyPopper, Star, Tag, X, Zap 
} from 'lucide-react';

export const QueuePage = () => {
  const navigate = useNavigate();
  
  // Типизируем данные из хука
  const { data: queueData, isLoading } = useQueue();
  const queueTickets: Ticket[] = queueData?.data || [];
  
  const { mutate: assignTicket } = useAssignTicket();

  const [selectedPriorities, setSelectedPriorities] = useState<TicketPriority[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<TicketCategory[]>([]);

  // Фильтрация с типизацией
  const filteredTickets: Ticket[] = useMemo(() => { 
    let filtered: Ticket[] = queueTickets; 

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
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Очередь заявок' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#0077b6] to-[#03045e] rounded-2xl flex items-center justify-center shadow-lg">
            <Inbox className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#03045e]">Очередь заявок</h1>
            <p className="text-[#023e8a]/70 mt-1 text-lg">Новые обращения клиентов</p>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm"
          className="border-[#0077b6] text-[#0077b6] hover:bg-[#0077b6] hover:text-white rounded-xl transition-all self-start md:self-auto"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Настройки очереди
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {/* В очереди */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-[#caf0f8]/20 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="pb-3 pt-5">
            <div className="flex items-center justify-between">
              <CardDescription className="text-[#023e8a]/60 font-medium">В очереди</CardDescription>
              <div className="w-10 h-10 bg-gradient-to-br from-[#90e0ef] to-[#48cae4] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Layers className="w-5 h-5 text-[#03045e]" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-[#03045e] mt-2">{stats.total}</CardTitle>
          </CardHeader>
          <div className="h-1 bg-gradient-to-r from-[#90e0ef] to-[#48cae4]" />
        </Card>

        {/* Критические */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-red-50/30 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
          {stats.critical > 0 && (
            <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
          <CardHeader className="pb-3 pt-5">
            <div className="flex items-center justify-between">
              <CardDescription className="text-red-600/70 font-medium">Критические</CardDescription>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-red-600 mt-2">{stats.critical}</CardTitle>
          </CardHeader>
          <div className="h-1 bg-gradient-to-r from-red-500 to-red-600" />
        </Card>

        {/* Высокий приоритет */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-orange-50/30 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="pb-3 pt-5">
            <div className="flex items-center justify-between">
              <CardDescription className="text-orange-600/70 font-medium">Высокий приоритет</CardDescription>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <ArrowUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-orange-500 mt-2">{stats.high}</CardTitle>
          </CardHeader>
          <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-500" />
        </Card>

        {/* VIP клиенты */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-amber-50/30 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="pb-3 pt-5">
            <div className="flex items-center justify-between">
              <CardDescription className="text-amber-600/70 font-medium">VIP клиенты</CardDescription>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-amber-500 mt-2">{stats.vip}</CardTitle>
          </CardHeader>
          <div className="h-1 bg-gradient-to-r from-amber-400 to-yellow-500" />
        </Card>
      </div>

      {/* Фильтры */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
        <CardHeader className="pb-4 border-b border-[#90e0ef]/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#48cae4] to-[#0096c7] rounded-xl flex items-center justify-center shadow-md">
              <Filter className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-[#03045e]">Фильтры</CardTitle>
            
            {(selectedPriorities.length > 0 || selectedCategories.length > 0) && (
              <Badge className="ml-auto bg-[#0077b6] text-white">
                {selectedPriorities.length + selectedCategories.length} активно
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Приоритеты */}
          <div>
            <p className="text-sm font-semibold text-[#03045e] mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#0077b6]" />
              Приоритет
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.values(TicketPriority).map((priority) => {
                const isSelected = selectedPriorities.includes(priority);
                return (
                  <Badge
                    key={priority}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-[#0077b6] to-[#023e8a] text-white shadow-md hover:shadow-lg' 
                        : 'bg-[#caf0f8]/50 text-[#023e8a] hover:bg-[#ade8f4] border border-[#90e0ef]/50'
                    }`}
                    onClick={() => togglePriority(priority)}
                  >
                    {priority}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Категории */}
          <div>
            <p className="text-sm font-semibold text-[#03045e] mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#0077b6]" />
              Категория
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.values(TicketCategory).map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <Badge
                    key={category}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-[#0077b6] to-[#023e8a] text-white shadow-md hover:shadow-lg' 
                        : 'bg-[#caf0f8]/50 text-[#023e8a] hover:bg-[#ade8f4] border border-[#90e0ef]/50'
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Сброс */}
          {(selectedPriorities.length > 0 || selectedCategories.length > 0) && (
            <div className="pt-4 border-t border-[#90e0ef]/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPriorities([]);
                  setSelectedCategories([]);
                }}
                className="text-[#023e8a]/70 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <X className="w-4 h-4 mr-2" />
                Сбросить все фильтры
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Список заявок */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
        <CardHeader className="pb-4 border-b border-[#90e0ef]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0096c7] to-[#023e8a] rounded-xl flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-[#03045e] flex items-center gap-2">
                  Заявки в очереди
                  <span className="text-base font-medium text-[#0077b6] bg-[#caf0f8] px-3 py-1 rounded-full">
                    {filteredTickets.length}
                  </span>
                </CardTitle>
                <CardDescription className="text-[#023e8a]/60 mt-0.5">
                  Нажмите на заявку чтобы взять её в работу
                </CardDescription>
              </div>
            </div>

            {/* Сортировка */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#023e8a]/70 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-xl transition-all"
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                По приоритету
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {filteredTickets.length === 0 && !isLoading ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-[#caf0f8] to-[#ade8f4] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <PartyPopper className="w-12 h-12 text-[#0077b6]" />
              </div>
              <h3 className="text-2xl font-bold text-[#03045e] mb-2">
                Очередь пуста!
              </h3>
              <p className="text-[#023e8a]/60 mb-2 max-w-md mx-auto">
                В очереди нет заявок. Отличная работа! 🎉
              </p>
              <p className="text-sm text-[#023e8a]/40">
                Новые заявки появятся здесь автоматически
              </p>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>

      {/* Информационная подсказка */}
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-gradient-to-r from-[#ade8f4]/30 to-[#90e0ef]/20">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#48cae4]/30 rounded-xl flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-[#0077b6]" />
            </div>
            <div>
              <p className="text-sm text-[#023e8a]/80">
                <span className="font-semibold text-[#03045e]">Как это работает:</span> Заявки отсортированы по приоритету и времени ожидания. 
                Критические заявки и обращения VIP-клиентов отображаются первыми.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueuePage;
