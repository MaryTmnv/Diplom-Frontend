import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { TicketStatusBadge } from '@/features/tickets/components/TicketStatusBadge';
import { TicketPriorityBadge } from '@/features/tickets/components/TicketPriorityBadge';
import { ChatWindow } from '@/features/chat/components/ChatWindow';  // ← добавили
import { useTicketDetail } from '@/features/tickets/hooks/useTicketDetail';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { EmptyState } from '@/shared/components/EmptyState';
import { getCategoryLabel, getCategoryIcon } from '@/features/tickets/utils/ticketHelpers';
import { formatDate } from '@/shared/lib/utils/formatters';
import { ArrowLeft, Calendar, Tag, FileText, BookOpen, CheckCircle, Download, FileIcon, HelpCircle, Info, MessageCircle, Paperclip, Star } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { TicketStatus } from '@/features/tickets/types/tickets.types';

export const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: ticket, isLoading, error } = useTicketDetail(id!);

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Загрузка заявки..." />;
  }

  if (error || !ticket) {
    return (
      <EmptyState
        icon="😔"
        title="Заявка не найдена"
        description="Возможно, она была удалена или у вас нет доступа к ней."
        action={{
          label: 'Вернуться к заявкам',
          onClick: () => navigate('/client/dashboard'),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
  <Breadcrumbs
    items={[
      { label: 'Мои заявки', href: '/client/dashboard' },
      { label: ticket.number },
    ]}
  />

  {/* Header */}
  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/client/dashboard')}
          className="w-10 h-10 rounded-xl bg-[#caf0f8]/50 hover:bg-[#ade8f4] text-[#0077b6] transition-all shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-[#03045e] line-clamp-2">
            {ticket.title}
          </h1>
          <p className="text-[#023e8a]/60 text-sm mt-1">Заявка {ticket.number}</p>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-3 flex-wrap">
      <TicketPriorityBadge priority={ticket.priority} />
      <TicketStatusBadge status={ticket.status} />
    </div>
  </div>

  {/* Основная информация */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Левая колонка - детали */}
    <div className="lg:col-span-2 space-y-6">
      {/* Описание */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
        <CardHeader className="pb-4 border-b border-[#90e0ef]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0096c7] to-[#023e8a] rounded-xl flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-[#03045e]">Описание проблемы</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="p-4 bg-[#caf0f8]/20 rounded-xl border border-[#90e0ef]/30">
            <p className="text-[#03045e] whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ЧАТ */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/5">
        <CardHeader className="pb-3 border-b border-[#90e0ef]/30 bg-gradient-to-r from-[#03045e] to-[#023e8a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white">Чат с поддержкой</CardTitle>
                <p className="text-xs text-[#90e0ef]">Заявка {ticket.number}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <ChatWindow 
          ticketId={ticket.id} 
          ticketNumber={ticket.number}
          ticketCategory={ticket.category}
          className="h-[600px]"
        />
      </Card>
    </div>

    {/* Правая колонка - метаинформация */}
    <div className="space-y-6">
      {/* Информация */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#48cae4] to-[#0096c7] rounded-lg flex items-center justify-center">
              <Info className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-[#03045e]">Информация</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {/* Категория */}
          <div className="flex items-center gap-3 p-3 bg-[#caf0f8]/20 rounded-xl">
            <div className="w-10 h-10 bg-[#90e0ef]/50 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-[#0077b6]" />
            </div>
            <div>
              <p className="text-xs text-[#023e8a]/50 font-medium">Категория</p>
              <div className="flex items-center gap-2">
                <span>{getCategoryIcon(ticket.category)}</span>
                <span className="font-semibold text-[#03045e]">
                  {getCategoryLabel(ticket.category)}
                </span>
              </div>
            </div>
          </div>

          {/* Дата создания */}
          <div className="flex items-center gap-3 p-3 bg-[#caf0f8]/20 rounded-xl">
            <div className="w-10 h-10 bg-[#90e0ef]/50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#0077b6]" />
            </div>
            <div>
              <p className="text-xs text-[#023e8a]/50 font-medium">Создана</p>
              <p className="font-semibold text-[#03045e]">
                {formatDate(ticket.createdAt, 'dd.MM.yyyy HH:mm')}
              </p>
            </div>
          </div>

          {/* Оператор */}
          {ticket.operator && (
            <div className="p-4 bg-gradient-to-br from-[#caf0f8]/30 to-[#ade8f4]/20 rounded-xl border border-[#90e0ef]/30">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0096c7] to-[#023e8a] rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                    {ticket.operator.firstName[0]}{ticket.operator.lastName[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#023e8a]/50 font-medium mb-0.5">Ваш оператор</p>
                  <p className="font-bold text-[#03045e]">
                    {ticket.operator.firstName} {ticket.operator.lastName}
                  </p>
                  {ticket.operator.operatorStats && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="font-semibold text-amber-600">
                          {ticket.operator.operatorStats.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs text-[#023e8a]/40">•</span>
                      <span className="text-xs text-[#023e8a]/60">
                        Решено: {ticket.operator.operatorStats.totalResolved}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Время решения */}
          {ticket.resolvedAt && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-green-600/70 font-medium">Решена</p>
                <p className="font-semibold text-green-700">
                  {formatDate(ticket.resolvedAt, 'dd.MM.yyyy HH:mm')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Файлы */}
      {ticket.attachments && ticket.attachments.length > 0 && (
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00b4d8] to-[#0077b6] rounded-lg flex items-center justify-center">
                <Paperclip className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-bold text-[#03045e]">
                Файлы
                <span className="ml-2 text-sm font-medium text-[#0077b6] bg-[#caf0f8] px-2 py-0.5 rounded-full">
                  {ticket.attachments.length}
                </span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-2">
            {ticket.attachments.map((file) => (
              <a
                key={file.id}
                href={`http://localhost:3000${file.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#caf0f8]/20 hover:bg-[#ade8f4]/40 rounded-xl transition-all group"
              >
                <div className="w-10 h-10 bg-[#90e0ef]/50 rounded-xl flex items-center justify-center group-hover:bg-[#0077b6] transition-colors">
                  <FileIcon className="w-5 h-5 text-[#0077b6] group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm text-[#03045e] truncate flex-1 font-medium">
                  {file.fileName}
                </span>
                <Download className="w-4 h-4 text-[#023e8a]/40 group-hover:text-[#0077b6] transition-colors" />
              </a>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Действия (опционально) */}
      {ticket.status !== TicketStatus.CLOSED && (
        <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-gradient-to-r from-[#caf0f8]/40 to-[#ade8f4]/20">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#48cae4]/30 rounded-xl flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-[#0077b6]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#03045e] mb-1">
                  Нужна дополнительная помощь?
                </p>
                <p className="text-xs text-[#023e8a]/70 mb-3">
                  Свяжитесь с оператором через чат или посмотрите похожие вопросы
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/knowledge-base')}
                  className="text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-lg text-xs"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  База знаний
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  </div>
</div>

  );
};

export default TicketDetailPage;
