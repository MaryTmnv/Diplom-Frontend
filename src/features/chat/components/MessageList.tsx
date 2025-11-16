import { useEffect, useRef, useMemo } from 'react';
import { Message } from '../types/message.types';
import { MessageItem } from './MessageItem';
import { useAuthStore } from '@/features/auth/store/authStore';
import { cn } from '@/shared/lib/utils/cn';
import { Skeleton } from '@/shared/ui';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();  // ← ВСЕ ХУКИ ДОЛЖНЫ БЫТЬ ВВЕРХУ!

  // Удаляем дубликаты по ID
  const uniqueMessages = useMemo(() => {
    const seen = new Set<string>();
    return messages.filter((msg) => {
      if (seen.has(msg.id)) {
        return false;
      }
      seen.add(msg.id);
      return true;
    });
  }, [messages]);

  // Группировка сообщений по дате
  const groupedMessages = useMemo(() => {
    return uniqueMessages.reduce((groups, message) => {
      const date = new Date(message.createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {} as Record<string, Message[]>);
  }, [uniqueMessages]);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // ========== ТЕПЕРЬ УСЛОВНЫЙ РЕНДЕРИНГ (ПОСЛЕ ВСЕХ ХУКОВ) ==========

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={cn('flex gap-3', i % 2 === 0 ? 'flex-row-reverse' : 'flex-row')}>
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-2 flex-1 max-w-[70%]">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!uniqueMessages || uniqueMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div>
          <p className="text-gray-500 mb-2">💬</p>
          <p className="text-sm text-gray-600">
            Сообщений пока нет. Начните переписку!
          </p>
        </div>
      </div>
    );
  }

  // Список сообщений
  return (
    <div className="space-y-6 p-4">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          {/* Разделитель по дате */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-500 font-medium">{date}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Сообщения */}
          <div className="space-y-4">
            {msgs.map((message, index) => {
              const isOwn = message.authorId === user?.id;
              const prevMessage = msgs[index - 1];
              const showAvatar = !prevMessage || prevMessage.authorId !== message.authorId;

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
