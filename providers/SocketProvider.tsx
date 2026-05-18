"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";

export type NotificationType =
  | "task_approved"
  | "task_rejected"
  | "referral"
  | "payment"
  | "system";

export interface INotificationPayload {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  path: string;
  createdAt: string;
  updatedAt: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Initialize the socket instance locally inside the effect
    const socketInstance = io(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      },
    );

    // Synchronize states asynchronously inside the event callbacks
    socketInstance.on("connect", () => {
      setIsConnected(true);
      setSocket(socketInstance); // Safely setting state after connection is established
      console.log("Connected to Socket Server");
      socketInstance.emit("join_room", session.user.id);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      setSocket(null); // Clear socket state on disconnect safely
      console.log("Disconnected from Socket Server");
    });

    // Clean up function to disconnect and clear state on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [session?.user?.id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
