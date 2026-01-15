import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/features/auth/store/authStore';
const WEBSOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace('/api', '');

export const useWebSocket = (ticketId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (!accessToken || !ticketId) {
      console.warn('⚠️ WebSocket: No token or ticketId', { 
        hasToken: !!accessToken, 
        ticketId 
      });
      return;
    }

    // Подключаемся к namespace /chat
    const socketUrl = `${WEBSOCKET_URL}/chat`;
    console.log('🔌 WebSocket: Connecting to', socketUrl, { ticketId });

    const newSocket = io(socketUrl, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: maxReconnectAttempts,
      timeout: 10000,
    });

    socketRef.current = newSocket;

    // ===== События подключения =====
    
    newSocket.on('connect', () => {
      console.log('✅ WebSocket: Connected', { 
        socketId: newSocket.id,
        ticketId 
      });
      setIsConnected(true);
      reconnectAttempts.current = 0;

      // Присоединяемся к комнате заявки
      newSocket.emit('join-ticket', { ticketId });
      console.log(`📥 WebSocket: Emitted join-ticket for ${ticketId}`);
    });

    newSocket.on('connected', (data) => {
      console.log('✅ WebSocket: Server confirmed connection', data);
    });

    newSocket.on('joined-ticket', (data) => {
      console.log('✅ WebSocket: Joined ticket room', data);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ WebSocket: Disconnected', { reason, ticketId });
      setIsConnected(false);

      // Если отключение не по нашей инициативе
      if (reason === 'io server disconnect') {
        // Сервер отключил нас, пробуем переподключиться
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 WebSocket: Connection error', {
        error: error.message,
        ticketId,
        attempt: reconnectAttempts.current + 1,
      });
      setIsConnected(false);
      reconnectAttempts.current += 1;

      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('🔴 WebSocket: Max reconnection attempts reached');
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 WebSocket: Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      reconnectAttempts.current = 0;
      
      // Повторно присоединяемся к комнате
      newSocket.emit('join-ticket', { ticketId });
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 WebSocket: Reconnection attempt ${attemptNumber}`);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('🔴 WebSocket: Reconnection failed');
      setIsConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('🔴 WebSocket: Error', error);
    });

    // ===== Cleanup =====
    
    return () => {
      console.log('🔌 WebSocket: Cleaning up', { ticketId });
      if (socketRef.current) {
        socketRef.current.emit('leave-ticket', { ticketId });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
    };
  }, [accessToken, ticketId]);

  return {
    socket: socketRef.current,
    isConnected,
  };
};
