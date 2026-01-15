import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useCallback } from 'react';
import { chatApi } from '../api/chatApi';
import { queryKeys } from '@/shared/lib/api/queryClient';
import type { Message, SendMessageDto } from '../types/message.types';
import { useAuthStore } from '@/features/auth/store/authStore';
import toast from 'react-hot-toast';
import { useWebSocket } from './ useWebSocket';

export const useChat = (ticketId: string) => {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useWebSocket(ticketId);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const currentUser = useAuthStore((state) => state.user);

  // Получение сообщений
  const { data: messages, isLoading, error } = useQuery({
    queryKey: queryKeys.chat.messages(ticketId),
    queryFn: () => chatApi.getMessages(ticketId),
    enabled: !!ticketId,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });

  // Отправка сообщения
  const sendMessageMutation = useMutation({
    mutationFn: async (data: SendMessageDto) => {
      console.log('📤 Sending message:', { ticketId, data, isConnected });

      // Если WebSocket подключен, отправляем через него
      if (socket && isConnected) {
        // Создаём временное сообщение для оптимистичного обновления
        const tempMessage: Message = {
          id: `temp-${Date.now()}`,
          ticketId,
          content: data.content,
          authorId: currentUser?.id || '',
          author: currentUser || {} as any,
          attachments: [],
          isInternal: data.isInternal || false,
          createdAt: new Date().toISOString(),
          readAt: null,
        };

        // Оптимистично добавляем сообщение
        queryClient.setQueryData<Message[]>(
          queryKeys.chat.messages(ticketId),
          (old = []) => [...old, tempMessage]
        );

        // Отправляем через WebSocket (без ожидания ответа)
        socket.emit('send-message', {
          ticketId,
          content: data.content,
          attachmentIds: data.attachmentIds,
          isInternal: data.isInternal,
        });

        console.log('✅ Message sent via WebSocket (optimistic)');
        return tempMessage;
      }
      
      // Fallback на REST API
      console.log('📡 Sending message via REST API');
      return chatApi.sendMessage(ticketId, data);
    },
    onError: (error: any) => {
      console.error('❌ Failed to send message:', error);
      toast.error('Не удалось отправить сообщение');
      
      // Откатываем оптимистичное обновление
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.chat.messages(ticketId) 
      });
    },
  });

  // WebSocket события
  useEffect(() => {
    if (!socket || !isConnected) {
      console.log('⚠️ Socket not ready', { hasSocket: !!socket, isConnected });
      return;
    }

    console.log('🎧 Setting up WebSocket listeners for ticket:', ticketId);

    // Новое сообщение от сервера
    const handleNewMessage = (message: Message) => {
      console.log('📨 New message received:', message);
      
      queryClient.setQueryData<Message[]>(
        queryKeys.chat.messages(ticketId),
        (old = []) => {
          // Удаляем временное сообщение если есть
          const withoutTemp = old.filter((m) => !m.id.startsWith('temp-'));
          
          // Проверяем, нет ли уже этого сообщения
          if (withoutTemp.some((m) => m.id === message.id)) {
            console.log('⚠️ Message already exists, skipping');
            return old;
          }
          
          return [...withoutTemp, message];
        }
      );
    };

    // Пользователь печатает
    const handleUserTyping = (data: { userId: string; userName: string }) => {
      console.log('⌨️ User typing:', data.userName);
      
      setTypingUsers((prev) => {
        if (prev.includes(data.userName)) return prev;
        return [...prev, data.userName];
      });

      // Убираем индикатор через 3 секунды
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((name) => name !== data.userName));
      }, 3000);
    };

    // Сообщение прочитано
    const handleMessageRead = (data: { messageId: string; userId: string }) => {
      console.log('👁️ Message read:', data.messageId);
      
      queryClient.setQueryData<Message[]>(
        queryKeys.chat.messages(ticketId),
        (old = []) => 
          old.map((msg) =>
            msg.id === data.messageId
              ? { ...msg, readAt: new Date().toISOString() }
              : msg
          )
      );
    };

    // Ошибка отправки сообщения
    const handleMessageError = (error: any) => {
      console.error('❌ Message error from server:', error);
      toast.error(error.message || 'Ошибка отправки сообщения');
      
      // Перезагружаем сообщения
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.chat.messages(ticketId) 
      });
    };

    // Подписываемся на события
    socket.on('new-message', handleNewMessage);
    socket.on('user-typing', handleUserTyping);
    socket.on('message-read', handleMessageRead);
    socket.on('message-error', handleMessageError);

    // Отписываемся при размонтировании
    return () => {
      console.log('🔇 Removing WebSocket listeners');
      socket.off('new-message', handleNewMessage);
      socket.off('user-typing', handleUserTyping);
      socket.off('message-read', handleMessageRead);
      socket.off('message-error', handleMessageError);
    };
  }, [socket, isConnected, ticketId, queryClient, currentUser]);

  // Отправка события "печатает"
  const emitTyping = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('typing', { ticketId });
      console.log('⌨️ Emitted typing event');
    }
  }, [socket, isConnected, ticketId]);

  // Отметить сообщение как прочитанное
  const markAsRead = useCallback((messageId: string) => {
    if (socket && isConnected) {
      socket.emit('mark-read', { ticketId, messageId });
      console.log('👁️ Emitted mark-read event', messageId);
    }
  }, [socket, isConnected, ticketId]);

  return {
    messages: messages || [],
    isLoading,
    error,
    isConnected,
    typingUsers,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    emitTyping,
    markAsRead,
  };
};
