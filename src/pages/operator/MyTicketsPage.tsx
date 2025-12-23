import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { TicketList } from '@/features/tickets/components/TicketList';
import { useMyActiveTickets } from '@/features/tickets/hooks/useMyActiveTickets';
import { useMemo } from 'react';
import { TicketStatus } from '@/features/tickets/types/tickets.types';
import { Card, CardHeader, CardDescription, CardTitle, CardContent, Button } from '@/shared/ui';
import { ClipboardList, Layers, PlayCircle, Clock, MessageCircle, FileText, Filter, ArrowUpDown, Inbox, ArrowRight, Lightbulb } from 'lucide-react';

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
    <div className="space-y-8">
  <Breadcrumbs items={[{ label: 'Мои заявки' }]} />

  {/* Header */}
  <div className="flex items-start gap-4">
    <div className="w-14 h-14 bg-gradient-to-br from-[#0077b6] to-[#03045e] rounded-2xl flex items-center justify-center shadow-lg">
      <ClipboardList className="w-7 h-7 text-white" />
    </div>
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-[#03045e]">Мои активные заявки</h1>
      <p className="text-[#023e8a]/70 mt-1 text-lg">Заявки, которые вы сейчас обрабатываете</p>
    </div>
  </div>

  {/* Статистика */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
    {/* Всего */}
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-[#caf0f8]/20 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-center justify-between">
          <CardDescription className="text-[#023e8a]/60 font-medium">Всего</CardDescription>
          <div className="w-10 h-10 bg-gradient-to-br from-[#90e0ef] to-[#48cae4] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <Layers className="w-5 h-5 text-[#03045e]" />
          </div>
        </div>
        <CardTitle className="text-4xl font-bold text-[#03045e] mt-2">{stats.total}</CardTitle>
      </CardHeader>
      <div className="h-1 bg-gradient-to-r from-[#90e0ef] to-[#48cae4]" />
    </Card>

    {/* В работе */}
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-[#caf0f8]/20 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-center justify-between">
          <CardDescription className="text-[#023e8a]/60 font-medium">В работе</CardDescription>
          <div className="w-10 h-10 bg-gradient-to-br from-[#0096c7] to-[#0077b6] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <PlayCircle className="w-5 h-5 text-white" />
          </div>
        </div>
        <CardTitle className="text-4xl font-bold text-[#0077b6] mt-2">{stats.inProgress}</CardTitle>
      </CardHeader>
      <div className="h-1 bg-gradient-to-r from-[#0096c7] to-[#0077b6]" />
    </Card>

    {/* Ожидание */}
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-amber-50/30 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-center justify-between">
          <CardDescription className="text-amber-700/60 font-medium">Ожидание</CardDescription>
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-5 h-5 text-white" />
          </div>
        </div>
        <CardTitle className="text-4xl font-bold text-amber-600 mt-2">{stats.waiting}</CardTitle>
      </CardHeader>
      <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
    </Card>

    {/* Непрочитанных */}
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-[#caf0f8]/20 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
      {stats.unread > 0 && (
        <div className="absolute top-3 right-3 w-3 h-3 bg-[#00b4d8] rounded-full animate-pulse" />
      )}
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-center justify-between">
          <CardDescription className="text-[#023e8a]/60 font-medium">Непрочитанных</CardDescription>
          <div className="w-10 h-10 bg-gradient-to-br from-[#00b4d8] to-[#0096c7] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
        </div>
        <CardTitle className="text-4xl font-bold text-[#00b4d8] mt-2">{stats.unread}</CardTitle>
      </CardHeader>
      <div className="h-1 bg-gradient-to-r from-[#00b4d8] to-[#0096c7]" />
    </Card>
  </div>

  {/* Список заявок */}
  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
    <CardHeader className="pb-4 border-b border-[#90e0ef]/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0096c7] to-[#023e8a] rounded-xl flex items-center justify-center shadow-md">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-[#03045e]">Активные заявки</CardTitle>
            <CardDescription className="text-[#023e8a]/60 mt-0.5">
              Заявки, назначенные на вас
            </CardDescription>
          </div>
        </div>
        
        {/* Быстрые фильтры */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#023e8a]/70 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-xl transition-all"
          >
            <Filter className="w-4 h-4 mr-2" />
            Фильтры
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#023e8a]/70 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-xl transition-all"
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Сортировка
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-6">
      {myTickets.length === 0 && !isLoading ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-[#caf0f8] to-[#ade8f4] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Inbox className="w-10 h-10 text-[#0077b6]" />
          </div>
          <h3 className="text-xl font-bold text-[#03045e] mb-2">
            Нет активных заявок
          </h3>
          <p className="text-[#023e8a]/60 mb-6 max-w-md mx-auto">
            У вас нет активных заявок. Возьмите заявку из очереди, чтобы начать работу!
          </p>
          <Button
            onClick={() => navigate('/operator/queue')}
            className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-6 transition-all duration-300"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Перейти к очереди
          </Button>
        </div>
      ) : (
        <TicketList
          tickets={myTickets}
          isLoading={isLoading}
          variant="operator"
          emptyMessage="У вас нет активных заявок. Возьмите заявку из очереди!"
          onTicketClick={(ticket) => navigate(`/operator/tickets/${ticket.id}`)}
        />
      )}
    </CardContent>
  </Card>

  {/* Подсказка */}
  <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-gradient-to-r from-[#caf0f8]/50 to-[#ade8f4]/30">
    <CardContent className="p-5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#48cae4]/30 rounded-xl flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-[#0077b6]" />
        </div>
        <p className="text-sm text-[#023e8a]/80">
          <span className="font-semibold text-[#03045e]">Совет:</span> Старайтесь отвечать на заявки в течение 15 минут. 
          Это повышает удовлетворённость клиентов и улучшает вашу статистику.
        </p>
      </div>
    </CardContent>
  </Card>
</div>


  );
};

export default MyTicketsPage;
