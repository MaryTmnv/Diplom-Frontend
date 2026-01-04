import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/features/auth/store/authStore';

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

export const useWebSocket = (ticketId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!accessToken || !ticketId) {
      console.warn('⚠️ WebSocket: No token or ticketId');
      return;
    }

    console.log('🔌 WebSocket: Connecting to', WEBSOCKET_URL);

    // Создаем подключение
    const newSocket = io(WEBSOCKET_URL, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = newSocket;

    // События подключения
    newSocket.on('connect', () => {
      console.log('✅ WebSocket: Connected');
      setIsConnected(true);

      // Присоединяемся к комнате заявки
      newSocket.emit('join-ticket', ticketId);
      console.log(`📥 WebSocket: Joined ticket room ${ticketId}`);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ WebSocket: Disconnected', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 WebSocket: Connection error', error);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 WebSocket: Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      
      // Повторно присоединяемся к комнате
      newSocket.emit('join-ticket', ticketId);
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      console.log('🔌 WebSocket: Disconnecting...');
      if (socketRef.current) {
        socketRef.current.emit('leave-ticket', ticketId);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [accessToken, ticketId]);

  return {
    socket,
    isConnected,
  };
};
