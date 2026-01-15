import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, FileText, Filter, Inbox, Layers, LayoutDashboard, Plus, User, History } from 'lucide-react';
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
   <div className="space-y-8">
  <Breadcrumbs items={[{ label: 'Мои заявки' }]} />

  {/* Header */}
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div className="flex items-start gap-4">
      <div className="w-14 h-14 bg-gradient-to-br from-[#0077b6] to-[#023e8a] rounded-2xl flex items-center justify-center shadow-lg">
        <LayoutDashboard className="w-7 h-7 text-white" />
      </div>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#03045e]">Мои заявки</h1>
        <p className="text-[#023e8a]/70 mt-1 text-lg">Управление вашими обращениями</p>
      </div>
    </div>

    <Button 
      onClick={() => navigate('/client/tickets/create')}
      className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-6 transition-all duration-300 self-start md:self-auto"
    >
      <Plus className="w-4 h-4 mr-2" />
      Создать заявку
    </Button>
  </div>

  {/* Статистика */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Активные */}
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-3 pt-6">
        <div className="flex items-center justify-between">
          <CardDescription className="text-[#023e8a]/60 font-medium">Активные</CardDescription>
          <div className="w-10 h-10 bg-gradient-to-br from-[#00b4d8] to-[#0096c7] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-5 h-5 text-white" />
          </div>
        </div>
        <CardTitle className="text-4xl font-bold text-[#0077b6] mt-2">{stats.active}</CardTitle>
        <p className="text-xs text-[#023e8a]/50 mt-1">В работе и ожидании</p>
      </CardHeader>
      <div className="h-1 bg-gradient-to-r from-[#00b4d8] to-[#0096c7]" />
    </Card>

    {/* Решённые */}
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-green-50/30 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-3 pt-6">
        <div className="flex items-center justify-between">
          <CardDescription className="text-green-700/60 font-medium">Решённые</CardDescription>
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        </div>
        <CardTitle className="text-4xl font-bold text-green-600 mt-2">{stats.resolved}</CardTitle>
        <p className="text-xs text-green-600/50 mt-1">Успешно закрыты</p>
      </CardHeader>
      <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
    </Card>

    {/* Всего */}
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-3 pt-6">
        <div className="flex items-center justify-between">
          <CardDescription className="text-[#023e8a]/60 font-medium">Всего</CardDescription>
          <div className="w-10 h-10 bg-gradient-to-br from-[#90e0ef] to-[#48cae4] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <Layers className="w-5 h-5 text-[#03045e]" />
          </div>
        </div>
        <CardTitle className="text-4xl font-bold text-[#03045e] mt-2">{stats.total}</CardTitle>
        <p className="text-xs text-[#023e8a]/50 mt-1">За всё время</p>
      </CardHeader>
      <div className="h-1 bg-gradient-to-r from-[#90e0ef] to-[#48cae4]" />
    </Card>
  </div>

  {/* Быстрые действия (опционально) */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <button
      onClick={() => navigate('/knowledge-base')}
      className="group p-4 bg-gradient-to-br from-[#caf0f8]/30 to-[#ade8f4]/20 hover:from-[#caf0f8]/50 hover:to-[#ade8f4]/30 rounded-xl border border-[#90e0ef]/30 transition-all duration-300 text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#0077b6] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-[#03045e]">База знаний</p>
          <p className="text-xs text-[#023e8a]/60">Найти ответы самостоятельно</p>
        </div>
      </div>
    </button>

    <button
      onClick={() => navigate('/client/tickets?status=resolved')}
      className="group p-4 bg-gradient-to-br from-[#caf0f8]/30 to-[#ade8f4]/20 hover:from-[#caf0f8]/50 hover:to-[#ade8f4]/30 rounded-xl border border-[#90e0ef]/30 transition-all duration-300 text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#00b4d8] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
          <History className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-[#03045e]">История</p>
          <p className="text-xs text-[#023e8a]/60">Просмотреть решённые заявки</p>
        </div>
      </div>
    </button>

    <button
      onClick={() => navigate('/client/profile')}
      className="group p-4 bg-gradient-to-br from-[#caf0f8]/30 to-[#ade8f4]/20 hover:from-[#caf0f8]/50 hover:to-[#ade8f4]/30 rounded-xl border border-[#90e0ef]/30 transition-all duration-300 text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#0096c7] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-[#03045e]">Профиль</p>
          <p className="text-xs text-[#023e8a]/60">Управление аккаунтом</p>
        </div>
      </div>
    </button>
  </div>

  {/* Список активных заявок */}
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
              Ваши текущие обращения в поддержку
            </CardDescription>
          </div>
        </div>

        {/* Фильтр/Сортировка */}
        {activeTickets.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#023e8a]/60 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-lg"
            >
              <Filter className="w-4 h-4 mr-1" />
              Фильтр
            </Button>
          </div>
        )}
      </div>
    </CardHeader>
    <CardContent className="p-6">
      {activeTickets.length === 0 && !isLoading ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-[#caf0f8] to-[#ade8f4] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Inbox className="w-12 h-12 text-[#0077b6]" />
          </div>
          <h3 className="text-2xl font-bold text-[#03045e] mb-3">
            Нет активных заявок
          </h3>
          <p className="text-[#023e8a]/60 mb-6 max-w-md mx-auto leading-relaxed">
            У вас пока нет активных заявок. Создайте первую заявку, чтобы получить помощь.
          </p>
          <Button
            onClick={() => navigate('/client/tickets/create')}
            className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-6 transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать заявку
          </Button>
        </div>
      ) : (
        <TicketList
          tickets={activeTickets}
          isLoading={isLoading}
          variant="client"
          emptyMessage="У вас пока нет активных заявок."
          onTicketClick={(ticket) => navigate(`/client/tickets/${ticket.id}`)}
        />
      )}
    </CardContent>
  </Card>
</div>

  );
};

export default DashboardPage;
