// src/context/NotificationContext.js
import React, { createContext, useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children, role }) => {
  const [messages, setMessages] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    console.log("🌐 Connecting to WebSocket...");

    if (clientRef.current) return;

    // ✅ Grab JWT token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("🚫 No JWT token found — aborting WebSocket connection");
      return;
    }

    // ✅ Use SockJS (required for Spring STOMP)
    const socketUrl = "http://localhost:8083/ws"; // <-- cleaned up

    // ✅ Create STOMP client
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,

      // ✅ Send JWT via headers
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      onConnect: () => {
        console.log("✅ Authenticated connection established via SockJS");

        // 🎯 Subscribe to user-specific queue
        const userQueue = "/user/queue/updates";
        client.subscribe(userQueue, (msg) => {
          console.log("🎯 User-specific:", msg.body);
          toast.success(`🔔 ${msg.body}`, { position: "bottom-right" });
        });

        // 👑 Admin-only topic
        if (role === "ADMIN") {
          client.subscribe("/topic/admins", (msg) => {
            console.log("👑 Admin message:", msg.body);
            toast.info(`👑 Admin: ${msg.body}`, { position: "bottom-right" });
          });
        }

        // 🌍 Public updates
        client.subscribe("/topic/updates", (msg) => {
          console.log("📢 Public update:", msg.body);
          toast.info(`💬 ${msg.body}`, { position: "bottom-right" });
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame);
      },

      debug: (str) => console.log("🔌 [STOMP]", str),
    });

    client.activate();
    clientRef.current = client;

    // 🧹 Cleanup on unmount
    return () => {
      console.log("🛑 Disconnecting STOMP client...");
      client.deactivate();
      clientRef.current = null;
    };
  }, [role]);

  return (
    <NotificationContext.Provider value={{ messages }}>
      {children}
    </NotificationContext.Provider>
  );
};
