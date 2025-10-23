// Corrected version
import React, { createContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children, username }) => {
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!username) {
      console.warn("⚠️ No username provided for WebSocket connection!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("🚫 Missing JWT for WebSocket");
      return;
    }

    console.log("🌐 Connecting WebSocket for user:", username);

const stompClient = new Client({
  webSocketFactory: () => new SockJS("http://localhost:8083/ws"),
  reconnectDelay: 5000,
  connectHeaders: {
    Authorization: `Bearer ${token}`,
  },
  onConnect: () => {
    console.log("✅ Connected to Channel Server as", username);
    setConnected(true);

    // ✅ Subscribe to user-specific updates
    stompClient.subscribe("/user/queue/updates", (msg) => {
      console.log("🎯 Private message received:", msg.body);
      try {
        const data = JSON.parse(msg.body);
        setEvents((prev) => [...prev, data]);
        toast.success(`💬 ${data.message || "New update!"}`, {
          position: "bottom-right",
          autoClose: 3000,
        });
      } catch {
        toast.info(`📩 ${msg.body}`);
      }
    });

    // Optional: global topic
    stompClient.subscribe("/topic/updates", (msg) => {
      console.log("🌍 Public update:", msg.body);
    });
  },
  onStompError: (frame) => {
    console.error("❌ STOMP error:", frame.headers["message"]);
  },

  // ✅ Add this debug line
  debug: (str) => console.log("🔌 [STOMP DEBUG]", str),
});


    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, [username]);

  return (
    <WebSocketContext.Provider value={{ connected, client, events }}>
      {children}
    </WebSocketContext.Provider>
  );
};
