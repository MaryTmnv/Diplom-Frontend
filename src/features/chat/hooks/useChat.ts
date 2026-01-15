import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useCallback } from 'react';
import { chatApi } from '../api/chatApi';
import { queryKeys } from '@/shared/lib/api/queryClient';
import type { Message, SendMessageDto } from '../types/message.types';
import toast from 'react-hot-toast';
import { useWebSocket } from './ useWebSocket';

export const useChat = (ticketId: string) => {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useWebSocket(ticketId);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Получение сообщений
  const { data: messages, isLoading, error } = useQuery({
    queryKey: queryKeys.chat.messages(ticketId),
    queryFn: () => chatApi.getMessages(ticketId),
    enabled: !!ticketId,
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 секунд
  });

  // Отправка сообщения
  const sendMessageMutation = useMutation({
    mutationFn: async (data: SendMessageDto) => {
      console.log('📤 Sending message:', { ticketId, data, isConnected });

      // Если WebSocket подключен, отправляем через него
      if (socket && isConnected) {
        return new Promise<Message>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Message send timeout'));
          }, 5000);

          // Отправляем сообщение
          socket.emit('send-message', {
            ticketId,
            ...data,
          });

          // Ждём подтверждения
          socket.once('message-sent', (message: Message) => {
            clearTimeout(timeout);
            console.log('✅ Message sent via WebSocket:', message);
            resolve(message);
          });

          socket.once('message-error', (error: any) => {
            clearTimeout(timeout);
            console.error('❌ Message send error:', error);
            reject(error);
          });
        });
      }
      
      // Fallback на REST API
      console.log('📡 Sending message via REST API');
      return chatApi.sendMessage(ticketId, data);
    },
    onSuccess: (newMessage) => {
      console.log('✅ Message sent successfully:', newMessage);
      
      // Добавляем сообщение в кеш
      queryClient.setQueryData<Message[]>(
        queryKeys.chat.messages(ticketId),
        (old = []) => {
          // Проверяем, нет ли уже этого сообщения
          if (old.some((m) => m.id === newMessage.id)) {
            return old;
          }
          return [...old, newMessage];
        }
      );
    },
    onError: (error: any) => {
      console.error('❌ Failed to send message:', error);
      toast.error('Не удалось отправить сообщение');
    },
  });

  // WebSocket события
  useEffect(() => {
    if (!socket || !isConnected) {
      console.log('⚠️ Socket not ready', { hasSocket: !!socket, isConnected });
      return;
    }

    console.log('🎧 Setting up WebSocket listeners for ticket:', ticketId);

    // Новое сообщение
    const handleNewMessage = (message: Message) => {
      console.log('📨 New message received:', message);
      
      queryClient.setQueryData<Message[]>(
        queryKeys.chat.messages(ticketId),
        (old = []) => {
          // Проверяем, нет ли уже этого сообщения
          if (old.some((m) => m.id === message.id)) {
            console.log('⚠️ Message already exists, skipping');
            return old;
          }
          return [...old, message];
        }
      );

      // Показываем уведомление (опционально)
      // toast.success('Новое сообщение');
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

    // Подписываемся на события
    socket.on('new-message', handleNewMessage);
    socket.on('user-typing', handleUserTyping);
    socket.on('message-read', handleMessageRead);

    // Отписываемся при размонтировании
    return () => {
      console.log('🔇 Removing WebSocket listeners');
      socket.off('new-message', handleNewMessage);
      socket.off('user-typing', handleUserTyping);
      socket.off('message-read', handleMessageRead);
    };
  }, [socket, isConnected, ticketId, queryClient]);

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
