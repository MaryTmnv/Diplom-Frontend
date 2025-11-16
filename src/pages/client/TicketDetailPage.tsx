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
import { ArrowLeft, User, Calendar, Tag, FileText } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';

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
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/client/dashboard')}
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
          <TicketStatusBadge status={ticket.status} variant="human" />
        </div>
      </div>

      {/* Основная информация */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка - детали */}
        <div className="lg:col-span-2 space-y-6">
          {/* Описание */}
          <Card>
            <CardHeader>
              <CardTitle>Описание проблемы</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          {/* ЧАТ - НОВОЕ! */}
          <ChatWindow 
            ticketId={ticket.id} 
            ticketNumber={ticket.number}
          />
        </div>

        {/* Правая колонка - метаинформация */}
        <div className="space-y-6">
          {/* Информация */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Информация</CardTitle>
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

              {/* Оператор */}
              {ticket.operator && (
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Оператор</p>
                    <p className="text-sm font-medium">
                      {ticket.operator.firstName} {ticket.operator.lastName}
                    </p>
                    {ticket.operator.operatorStats && (
                      <p className="text-xs text-gray-500">
                        ⭐ {ticket.operator.operatorStats.averageRating.toFixed(1)} • 
                        Решено: {ticket.operator.operatorStats.totalResolved}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Время решения */}
              {ticket.resolvedAt && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Решена</p>
                    <p className="text-sm font-medium">
                      {formatDate(ticket.resolvedAt, 'dd.MM.yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              )}
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
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
