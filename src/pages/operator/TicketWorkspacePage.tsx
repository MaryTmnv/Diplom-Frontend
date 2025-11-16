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
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, XCircle, Tag, Calendar, MessageSquare, FileText } from 'lucide-react';
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
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/operator/my-tickets')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {ticket.title}
            </h1>
          </div>
          <p className="text-gray-600 ml-12">Заявка {ticket.number}</p>
        </div>

        <div className="flex items-center gap-2">
          <TicketPriorityBadge priority={ticket.priority} />
          <TicketStatusBadge status={ticket.status} />
          
          {/* Меню действий */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Действия
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Изменить статус</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => handleStatusChange(TicketStatus.IN_PROGRESS)}
                disabled={ticket.status === TicketStatus.IN_PROGRESS}
              >
                <Clock className="mr-2 h-4 w-4" />
                В работу
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleStatusChange(TicketStatus.WAITING)}
                disabled={ticket.status === TicketStatus.WAITING}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Ожидание
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleStatusChange(TicketStatus.RESOLVED)}
                disabled={ticket.status === TicketStatus.RESOLVED}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Решена
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleStatusChange(TicketStatus.CLOSED)}
                disabled={ticket.status === TicketStatus.CLOSED}
                className="text-red-600"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Закрыть
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Двухпанельный layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Левая панель (40%) - Информация */}
        <div className="lg:col-span-2 space-y-6">
          {/* Информация о клиенте */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Клиент</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {ticket.client?.firstName[0]}{ticket.client?.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {ticket.client?.firstName} {ticket.client?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{ticket.client?.email}</p>
                  {ticket.client?.clientProfile?.isVip && (
                    <span className="text-xs text-yellow-600 font-semibold">⭐ VIP</span>
                  )}
                </div>
              </div>

              {ticket.client?.clientProfile && (
                <div className="pt-3 border-t text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Всего заявок:</span>
                    <span className="font-medium">{ticket.client.clientProfile.totalTickets}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">Решено:</span>
                    <span className="font-medium">{ticket.client.clientProfile.resolvedTickets}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Детали заявки */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Детали заявки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Категория */}
              <div className="flex items-start gap-3">
                <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Категория</p>
                  <div className="flex items-center gap-1">
                    <span>{getCategoryIcon(ticket.category)}</span>
                    <span className="text-sm font-medium">
                      {getCategoryLabel(ticket.category)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Дата создания */}
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Создана</p>
                  <p className="text-sm font-medium">
                    {formatDate(ticket.createdAt, 'dd.MM.yyyy HH:mm')}
                  </p>
                </div>
              </div>

              {/* Описание */}
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Описание</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {ticket.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Файлы */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Файлы ({ticket.attachments.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {ticket.attachments.map((file) => (
                  <a
                    key={file.id}
                    href={`http://localhost:3000${file.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded transition-colors"
                  >
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 truncate flex-1">
                      {file.fileName}
                    </span>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Внутренние заметки */}
          {ticket.internalNotes && ticket.internalNotes.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Внутренние заметки ({ticket.internalNotes.length})
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInternalNotes(!showInternalNotes)}
                  >
                    {showInternalNotes ? 'Скрыть' : 'Показать'}
                  </Button>
                </div>
              </CardHeader>
              {showInternalNotes && (
                <CardContent className="space-y-3">
                  {ticket.internalNotes.map((note) => (
                    <div key={note.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          {note.author.firstName} {note.author.lastName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(note.createdAt, 'dd.MM HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{note.content}</p>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          )}

          {/* Умные подсказки */}
          {ticket.suggestions && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Подсказки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ticket.suggestions.similarTickets.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Похожие решённые заявки:
                    </p>
                    <div className="space-y-2">
                      {ticket.suggestions.similarTickets.slice(0, 3).map((similar) => (
                        <button
                          key={similar.id}
                          onClick={() => navigate(`/operator/tickets/${similar.id}`)}
                          className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs transition-colors"
                        >
                          <p className="font-medium text-gray-900">{similar.number}</p>
                          <p className="text-gray-600 truncate">{similar.title}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {ticket.suggestions.articles.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Полезные статьи:
                    </p>
                    <div className="space-y-2">
                      {ticket.suggestions.articles.slice(0, 3).map((article: any) => (
                        <a
                          key={article.id}
                          href={`/knowledge-base/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs transition-colors"
                        >
                          <p className="font-medium text-gray-900">{article.title}</p>
                          <p className="text-gray-600">{article.excerpt}</p>
                        </a>
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
        <ChatWindow 
            ticketId={ticket.id} 
            ticketNumber={ticket.number}
            ticketCategory={ticket.category}  
            className="h-[calc(100vh-12rem)]"
        />
        </div>
      </div>
    </div>
  );
};

export default TicketWorkspacePage;
