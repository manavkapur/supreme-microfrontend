// src/context/WebSocketContext.js
import React, { createContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children, username }) => {
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!username) {
      console.warn("⚠️ No username provided for WebSocket connection!");
      return;
    }

    console.log("🌐 Connecting WebSocket for user:", username);

    const socket = new SockJS(`http://localhost:8085/ws?username=${username}`);

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: {
        login: username,
        passcode: "guest",
      },
      onConnect: () => {
        console.log("✅ Connected to WebSocket server as", username);
        setConnected(true);

        // Subscribe to public updates
        stompClient.subscribe("/topic/updates", (msg) => {
          const message = msg.body;
          console.log("📩 Public Message received:", message);

          toast.info(`🔔 ${message}`, {
            position: "bottom-right",
            autoClose: 4000,
            theme: "colored",
          });
        });

        // Subscribe to user-specific queue
        const userQueue = `/user/${username}/queue/updates`;
        stompClient.subscribe(userQueue, (msg) => {
          console.log(`🎯 Private message for ${username}:`, msg.body);
          toast.success(`💬 ${msg.body}`, {
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
  }, [username]);

  return (
    <WebSocketContext.Provider value={{ connected, client }}>
      {children}
    </WebSocketContext.Provider>
  );
};
