import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { chatApi } from '../api/chatApi';
import { queryKeys } from '@/shared/lib/api/queryClient';
import type { Message, SendMessageDto } from '../types/message.types';
import { useWebSocket } from './ useWebSocket';

export const useChat = (ticketId: string) => {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useWebSocket(ticketId);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Получение сообщений
  const { data: messages, isLoading } = useQuery({
    queryKey: queryKeys.chat.messages(ticketId),
    queryFn: () => chatApi.getMessages(ticketId),
    enabled: !!ticketId,
  });

  // Отправка сообщения
  const sendMessageMutation = useMutation({
    mutationFn: (data: SendMessageDto) => {
      // Если WebSocket подключен, отправляем через него
      if (socket && isConnected) {
        socket.emit('send-message', {
          ticketId,
          ...data,
        });
        // Возвращаем промис для совместимости
        return Promise.resolve({} as Message);
      }
      
      // Fallback на REST API
      return chatApi.sendMessage(ticketId, data);
    },
    onSuccess: (newMessage) => {
      // Если сообщение пришло через REST API, добавляем в кеш
      if (newMessage.id) {
        queryClient.setQueryData<Message[]>(
          queryKeys.chat.messages(ticketId),
          (old = []) => [...old, newMessage]
        );
      }
    },
  });

  // WebSocket события
  useEffect(() => {
    if (!socket) return;

    // Новое сообщение
    socket.on('new-message', (message: Message) => {
      console.log('📨 New message received:', message);
      queryClient.setQueryData<Message[]>(
        queryKeys.chat.messages(ticketId),
        (old = []) => {
          // Проверяем, нет ли уже этого сообщения
          if (old.some((m) => m.id === message.id)) {
            return old;
          }
          return [...old, message];
        }
      );
    });

    // Пользователь печатает
    socket.on('user-typing', (data: { userId: string; userName: string }) => {
      console.log('⌨️ User typing:', data.userName);
      setTypingUsers((prev) => {
        if (prev.includes(data.userName)) return prev;
        return [...prev, data.userName];
      });

      // Убираем индикатор через 3 секунды
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((name) => name !== data.userName));
      }, 3000);
    });

    // Сообщение прочитано
    socket.on('message-read', (data: { messageId: string; userId: string }) => {
      console.log('👁️ Message read:', data.messageId);
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(ticketId) });
    });

    return () => {
      socket.off('new-message');
      socket.off('user-typing');
      socket.off('message-read');
    };
  }, [socket, ticketId, queryClient]);

  // Отправка события "печатает"
  const emitTyping = () => {
    if (socket && isConnected) {
      socket.emit('typing', { ticketId });
    }
  };

  return {
    messages,
    isLoading,
    isConnected,
    typingUsers,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    emitTyping,
  };
};
