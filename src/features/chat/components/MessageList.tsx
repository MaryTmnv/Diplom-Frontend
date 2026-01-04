import { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { EmptyState } from '@/shared/components/EmptyState';
import type { Message } from '../types/message.types';
import { formatDate } from 'date-fns';
import { ru } from 'date-fns/locale';

interface MessageListProps {
  messages: Message[];
  currentUserId: string; // ← Добавили!
  isLoading?: boolean;
}

export const MessageList = ({ 
  messages, 
  currentUserId, // ← Добавили!
  isLoading = false 
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Автоскролл к новым сообщениям
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner text="Загрузка сообщений..." />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyState
          icon="💬"
          title="Нет сообщений"
          description="Начните диалог с клиентом"
        />
      </div>
    );
  }

  // Группировка сообщений по датам
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(new Date(message.createdAt), 'dd MMMM yyyy', { locale: ru });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#caf0f8]/10 to-white">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          {/* Разделитель по дате */}
          <div className="flex items-center justify-center my-6">
            <div className="bg-[#90e0ef]/30 text-[#023e8a] text-xs font-medium px-4 py-1.5 rounded-full">
              {date}
            </div>
          </div>

          {/* Сообщения */}
          <div className="space-y-3">
            {msgs.map((message, index) => {
              const isOwn = message.authorId === currentUserId;
              const showAvatar = index === 0 || msgs[index - 1].authorId !== message.authorId;

              return (
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Якорь для автоскролла */}
      <div ref={messagesEndRef} />
    </div>
  );
};
