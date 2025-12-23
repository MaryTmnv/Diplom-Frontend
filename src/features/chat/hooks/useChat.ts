import { useEffect, useState, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Socket } from 'socket.io-client';
import { initChatSocket } from '@/shared/lib/api/websocket';
import { chatApi } from '../api/chatApi';
import { Message } from '../types/message.types';
import { queryKeys } from '@/shared/lib/api/queryClient';
import { useAuthStore } from '@/features/auth/store/authStore';
import toast from 'react-hot-toast';
export const useChat = (ticketId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);  // ← добавь | null и null

  // Загружаем сообщения через REST API
 // Загружаем сообщения через REST API (только при первой загрузке)
  const { data: messages = [], isLoading } = useQuery({
    queryKey: queryKeys.messages.list(ticketId),
    queryFn: () => chatApi.getMessages(ticketId),
    enabled: !!ticketId,
    staleTime: Infinity, // ← не перезагружаем, т.к. WebSocket обновляет в реальном времени
    refetchOnMount: false, // ← не перезагружаем при монтировании
    refetchOnWindowFocus: false, // ← не перезагружаем при фокусе
  });


  // Подключение к WebSocket
  useEffect(() => {
    if (!token || !ticketId) return;

    const chatSocket = initChatSocket(token);
    setSocket(chatSocket);

    // ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

    chatSocket.on('connect', () => {
      console.log('✅ Chat connected');
      setIsConnected(true);
    });

    chatSocket.on('connected', (data) => {
      console.log('Authenticated:', data);
      // Присоединяемся к комнате заявки
      chatSocket.emit('join-ticket', { ticketId });
    });

    chatSocket.on('joined-ticket', (data) => {
      console.log('✅ Joined ticket:', data.ticketId);
    });

    chatSocket.on('disconnect', () => {
      console.log('❌ Chat disconnected');
      setIsConnected(false);
    });

    chatSocket.on('error', (error) => {
      console.error('Chat error:', error);
      toast.error('Ошибка подключения к чату');
    });

    // Новое сообщение
    chatSocket.on('new-message', (message: Message) => {
      console.log('📨 New message:', message);

      // Добавляем в кэш React Query (проверяем на дубликаты)
      queryClient.setQueryData<Message[]>(
        queryKeys.messages.list(ticketId),
        (old = []) => {
          // Проверяем, нет ли уже такого сообщения
          const exists = old.some((msg) => msg.id === message.id);
          if (exists) {
            return old; // Не добавляем дубликат
          }
          return [...old, message];
        }
      );

      // Воспроизводим звук если сообщение не от текущего пользователя
      if (message.authorId !== user?.id) {
        playMessageSound();
      }
    });

    // Подтверждение отправки
    chatSocket.on('message-sent', (data: { tempId: number; message: Message }) => {
      console.log('✅ Message sent:', data);

      // Заменяем временное сообщение на реальное
      queryClient.setQueryData<Message[]>(
        queryKeys.messages.list(ticketId),
        (old = []) => {
          // Удаляем временное сообщение и добавляем реальное
          const withoutTemp = old.filter((msg) => msg.id !== `temp-${data.tempId}`);
          
          // Проверяем, нет ли уже реального сообщения
          const exists = withoutTemp.some((msg) => msg.id === data.message.id);
          if (exists) {
            return withoutTemp;
          }
          
          return [...withoutTemp, data.message];
        }
      );
    });


    // Сообщение прочитано
    chatSocket.on('message-read', (data: { messageId: string; readAt: string }) => {
      console.log('✓✓ Message read:', data);

      queryClient.setQueryData<Message[]>(
        queryKeys.messages.list(ticketId),
        (old = []) =>
          old.map((msg) =>
            msg.id === data.messageId ? { ...msg, readAt: data.readAt } : msg
          )
      );
    });

    // Пользователь печатает
    chatSocket.on('user-typing', (data: { userId: string; isTyping: boolean }) => {
      if (data.userId === user?.id) return; // Игнорируем себя

      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });

      // Автоматически убираем индикатор через 3 секунды
      if (data.isTyping) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(data.userId);
            return newSet;
          });
        }, 3000);
      }
    });

    return () => {
      chatSocket.emit('leave-ticket', { ticketId });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Не отключаем socket полностью, может использоваться в других местах
    };
  }, [ticketId, token, user?.id, queryClient]);

  // ========== МЕТОДЫ ==========

  // Отправка сообщения
  const sendMessage = useCallback(
    (content: string, attachmentIds?: string[]) => {
      if (!socket || !isConnected || !content.trim()) return;

      const tempId = Date.now();

      // Оптимистичное обновление UI
      const tempMessage: Message = {
        id: `temp-${tempId}`,
        ticketId,
        authorId: user?.id || '',
        author: {
          id: user?.id || '',
          firstName: user?.firstName || 'Вы',
          lastName: user?.lastName || '',
          avatar: user?.avatar,
          role: user?.role || 'CLIENT',
        },
        content,
        isInternal: false,
        createdAt: new Date().toISOString(),
        readAt: null,
        attachments: [],
      };

      // Добавляем в UI сразу
      queryClient.setQueryData<Message[]>(
        queryKeys.messages.list(ticketId),
        (old = []) => [...old, tempMessage]
      );

      // Отправляем через WebSocket
      socket.emit('send-message', {
        ticketId,
        message: {
          content,
          attachmentIds,
          isInternal: false,
        },
        tempId,
      });
    },
    [socket, isConnected, ticketId, user, queryClient]
  );

  // Индикатор печати
  const emitTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket || !isConnected) return;
      socket.emit('typing', { ticketId, isTyping });
    },
    [socket, isConnected, ticketId]
  );

  // Отметить как прочитанное
  const markAsRead = useCallback(
    (messageId: string) => {
      if (!socket || !isConnected) return;
      socket.emit('mark-as-read', { messageId });
    },
    [socket, isConnected]
  );

  return {
    messages,
    isLoading,
    isConnected,
    typingUsers: Array.from(typingUsers),
    sendMessage,
    emitTyping,
    markAsRead,
  };
};

// Утилита для воспроизведения звука
const playMessageSound = () => {
  try {
    const audio = new Audio('/sounds/message.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Игнорируем ошибки (браузер может блокировать автовоспроизведение)
    });
  } catch (error) {
    // Игнорируем
  }
};
