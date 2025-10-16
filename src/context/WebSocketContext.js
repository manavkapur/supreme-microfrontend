// src/context/WebSocketContext.js
import React, { createContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8085/ws");

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ Connected to WebSocket server");
        setConnected(true);

        // Subscribe to messages from the backend
        stompClient.subscribe("/topic/updates", (msg) => {
          const message = msg.body;
          console.log("📩 Message received:", message);

          toast.info(`🔔 ${message}`, {
            position: "bottom-right",
            autoClose: 4000,
            theme: "colored",
          });
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame.headers["message"]);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient) stompClient.deactivate();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ connected, client }}>
      {children}
    </WebSocketContext.Provider>
  );
};
