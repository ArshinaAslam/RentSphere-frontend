import { io } from "socket.io-client";

import type { Socket } from "socket.io-client";

 
let socket: ReturnType<typeof io> | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500", {
      withCredentials: true,
      autoConnect:     false,
    });
  }
  return socket;
};



export const connectSocket = (userId: string): void => {
  const s = getSocket();
  if (s.connected) {
    s.emit("user:online", userId); 
    return;
  }

   s.off("connect");

  
  s.once("connect", () => {
    s.emit("user:online", userId);
  });

  s.connect();
};


export const disconnectSocket = (): void => {
  const s = getSocket();
  if (s.connected) {
    s.disconnect();
  }

  
};

