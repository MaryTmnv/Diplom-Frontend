import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChatWindow } from '@/features/chat/components/ChatWindow';
import { TicketPriorityBadge } from '@/features/tickets/components/TicketPriorityBadge';
import { TicketStatusBadge } from '@/features/tickets/components/TicketStatusBadge';
import { useTicketDetail } from '@/features/tickets/hooks/useTicketDetail';
import { useUpdateTicketStatus } from '@/features/tickets/hooks/useUpdateTicket';
import { TicketStatus } from '@/features/tickets/types/tickets.types';
import { getCategoryIcon, getCategoryLabel } from '@/features/tickets/utils/ticketHelpers';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { Button, DropdownMenu, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { formatDate } from 'date-fns';
import { ArrowLeft, Clock, CheckCircle, XCircle, Tag, Calendar, MessageSquare, FileText, BookOpen, ChevronDown, ChevronUp, Download, ExternalLink, FileIcon, Lightbulb, MessageCircle, MoreVertical, Paperclip, Phone, PlayCircle, Plus, Settings2, Star, StickyNote, User, Zap , History } from 'lucide-react';
import { DropdownMenuTrigger, DropdownMenuContent } from '@/shared/ui/DropdownMenu';


export const TicketWorkspacePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showInternalNotes, setShowInternalNotes] = useState(false);

  const { data: ticket, isLoading, error } = useTicketDetail(id!);
  const { mutate: updateStatus } = useUpdateTicketStatus();

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
          label: 'Вернуться к очереди',
          onClick: () => navigate('/operator/queue'),
        }}
      />
    );
  }

  const handleStatusChange = (status: TicketStatus) => {
    const comment = prompt('Комментарий (необязательно):');
    
    updateStatus({
      id: ticket.id,
      data: { status, comment: comment || undefined },
    });
  };

  return (
    <div className="space-y-6">
  <Breadcrumbs
    items={[
      { label: 'Мои заявки', href: '/operator/my-tickets' },
      { label: ticket.number },
    ]}
  />

  {/* Header */}
  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/operator/my-tickets')}
          className="w-10 h-10 rounded-xl bg-[#caf0f8]/50 hover:bg-[#ade8f4] text-[#0077b6] transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#03045e]">
            {ticket.title}
          </h1>
          <p className="text-[#023e8a]/60 text-sm mt-0.5">Заявка {ticket.number}</p>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-3 flex-wrap">
      <TicketPriorityBadge priority={ticket.priority} />
      <TicketStatusBadge status={ticket.status} />
      
      {/* Меню действий */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            className="border-[#0077b6] text-[#0077b6] hover:bg-[#0077b6] hover:text-white rounded-xl transition-all gap-2"
          >
            <Settings2 className="w-4 h-4" />
            Действия
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 p-2 rounded-xl border border-[#90e0ef]/50 shadow-xl bg-white/95 backdrop-blur-md"
        >
          <DropdownMenuLabel className="text-[#03045e] font-semibold px-2">
            Изменить статус
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#90e0ef]/30" />
          
          <DropdownMenuItem
            onClick={() => handleStatusChange(TicketStatus.IN_PROGRESS)}
            disabled={ticket.status === TicketStatus.IN_PROGRESS}
            className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-[#caf0f8]/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0077b6]/10 flex items-center justify-center mr-3">
              <PlayCircle className="h-4 w-4 text-[#0077b6]" />
            </div>
            <span className="text-[#03045e]">В работу</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleStatusChange(TicketStatus.WAITING)}
            disabled={ticket.status === TicketStatus.WAITING}
            className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-amber-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mr-3">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-[#03045e]">Ожидание</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleStatusChange(TicketStatus.RESOLVED)}
            disabled={ticket.status === TicketStatus.RESOLVED}
            className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-green-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-[#03045e]">Решена</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-[#90e0ef]/30" />

          <DropdownMenuItem
            onClick={() => handleStatusChange(TicketStatus.CLOSED)}
            disabled={ticket.status === TicketStatus.CLOSED}
            className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-red-50 transition-colors text-red-600"
          >
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3">
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
            <span>Закрыть</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>

  {/* Двухпанельный layout */}
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
    {/* Левая панель (40%) - Информация */}
    <div className="lg:col-span-2 space-y-5">
      {/* Информация о клиенте */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#48cae4] to-[#0096c7] rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-[#03045e]">Клиент</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#0096c7] to-[#03045e] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {ticket.client?.firstName[0]}{ticket.client?.lastName[0]}
              </div>
              {ticket.client?.clientProfile?.isVip && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                  <Star className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#03045e] text-lg">
                {ticket.client?.firstName} {ticket.client?.lastName}
              </p>
              <p className="text-sm text-[#023e8a]/60">{ticket.client?.email}</p>
              {ticket.client?.clientProfile?.isVip && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1">
                  <Star className="w-3 h-3" />
                  VIP клиент
                </span>
              )}
            </div>
          </div>

          {ticket.client?.clientProfile && (
            <div className="pt-4 border-t border-[#90e0ef]/30 grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#caf0f8]/30 rounded-xl text-center">
                <p className="text-2xl font-bold text-[#03045e]">
                  {ticket.client.clientProfile.totalTickets}
                </p>
                <p className="text-xs text-[#023e8a]/60">Всего заявок</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-green-600">
                  {ticket.client.clientProfile.resolvedTickets}
                </p>
                <p className="text-xs text-green-600/70">Решено</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Детали заявки */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0096c7] to-[#023e8a] rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-[#03045e]">Детали заявки</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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

          {/* Описание */}
          <div className="p-4 bg-[#caf0f8]/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-[#0077b6]" />
              <p className="text-xs text-[#023e8a]/50 font-medium">Описание</p>
            </div>
            <p className="text-sm text-[#03045e] whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </p>
          </div>
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
          <CardContent className="space-y-2">
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

      {/* Внутренние заметки */}
      {ticket.internalNotes && ticket.internalNotes.length > 0 && (
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-amber-50/20 border-l-4 border-l-amber-400">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center">
                  <StickyNote className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-[#03045e]">
                  Внутренние заметки
                  <span className="ml-2 text-sm font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                    {ticket.internalNotes.length}
                
                  </span>
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInternalNotes(!showInternalNotes)}
                className="text-[#023e8a]/60 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-xl transition-all"
              >
                {showInternalNotes ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Скрыть
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Показать
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {showInternalNotes && (
            <CardContent className="space-y-3 pt-0">
              {ticket.internalNotes.map((note) => (
                <div 
                  key={note.id} 
                  className="p-4 bg-amber-50 border border-amber-200/50 rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-amber-700">
                        {note.author.firstName[0]}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[#03045e]">
                      {note.author.firstName} {note.author.lastName}
                    </span>
                    <span className="text-xs text-[#023e8a]/50">
                      {formatDate(note.createdAt, 'dd.MM HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-[#03045e]/80 leading-relaxed">{note.content}</p>
                </div>
              ))}
              
              {/* Добавить заметку */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full border-2 border-dashed border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-400 rounded-xl transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить заметку
              </Button>
            </CardContent>
          )}
        </Card>
      )}

      {/* Умные подсказки */}
      {ticket.suggestions && (
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-[#caf0f8]/30 to-[#ade8f4]/20 relative">
          {/* Декоративный элемент */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#48cae4]/20 to-[#0096c7]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#48cae4] to-[#00b4d8] rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-bold text-[#03045e]">Умные подсказки</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 relative z-10">
  {ticket.suggestions?.similarTickets && ticket.suggestions.similarTickets.length > 0 && (
    <div>
      <p className="text-xs font-semibold text-[#03045e] mb-3 flex items-center gap-2">
        <History className="w-4 h-4 text-[#0077b6]" />
        Похожие решённые заявки
      </p>
      <div className="space-y-2">
        {ticket.suggestions.similarTickets.slice(0, 3).map((similar) => (
          <button
            key={similar.id}
            onClick={() => navigate(`/operator/tickets/${similar.id}`)}
            className="w-full text-left p-3 bg-white hover:bg-[#caf0f8]/50 rounded-xl transition-all group border border-[#90e0ef]/30 hover:border-[#0077b6]/30 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-[#0077b6] text-sm">{similar.number}</p>
              <ExternalLink className="w-3 h-3 text-[#023e8a]/30 group-hover:text-[#0077b6] transition-colors" />
            </div>
            <p className="text-sm text-[#03045e]/70 truncate">{similar.title}</p>
          </button>
        ))}
      </div>
    </div>
  )}


             {ticket.suggestions?.articles && ticket.suggestions.articles.length > 0 && (
    <div>
      <p className="text-xs font-semibold text-[#03045e] mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-[#0077b6]" />
        Полезные статьи
      </p>
      <div className="space-y-2">
        {ticket.suggestions.articles.slice(0, 3).map((article) => (
          <a
            key={article.id}
            href={`/knowledge-base/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white hover:bg-[#caf0f8]/50 rounded-xl transition-all group border border-[#90e0ef]/30 hover:border-[#0077b6]/30 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-[#03045e] text-sm">{article.title}</p>
              <ExternalLink className="w-3 h-3 text-[#023e8a]/30 group-hover:text-[#0077b6] transition-colors" />
            </div>
            <p className="text-xs text-[#023e8a]/60 line-clamp-2">{article.excerpt}</p>
          </a>
        ))}
      </div>
    </div>
  )}


            {ticket.suggestions.templates && 
 Array.isArray(ticket.suggestions.templates) && 
 ticket.suggestions.templates.length > 0 && (
  <div>
    <p className="text-xs font-semibold text-[#03045e] mb-3 flex items-center gap-2">
      <Zap className="w-4 h-4 text-[#0077b6]" />
      Рекомендуемые шаблоны
    </p>
    <div className="flex flex-wrap gap-2">
      {ticket.suggestions.templates.slice(0, 3).map((template: any) => (
        <Button
          key={template.id}
          variant="outline"
          size="sm"
          className="border-[#0077b6]/30 text-[#0077b6] hover:bg-[#0077b6] hover:text-white rounded-lg transition-all text-xs"
        >
          {template.name}
        </Button>
      ))}
    </div>
  </div>
)}

          </CardContent>
        </Card>
      )}
    </div>

    {/* Правая панель (60%) - Чат */}
    <div className="lg:col-span-3">
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/5 h-[calc(100vh-12rem)]">
        <CardHeader className="pb-3 border-b border-[#90e0ef]/30 bg-gradient-to-r from-[#03045e] to-[#023e8a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white">Чат с клиентом</CardTitle>
                <p className="text-xs text-[#90e0ef]">Заявка {ticket.number}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <ChatWindow 
          ticketId={ticket.id} 
          ticketNumber={ticket.number}
          ticketCategory={ticket.category}  
          className="h-[calc(100%-4rem)]"
        />
      </Card>
    </div>
  </div>
</div>

  );
};

export default TicketWorkspacePage;
