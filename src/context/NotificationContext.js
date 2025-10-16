// src/context/NotificationContext.js
import React, { createContext, useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children, username, role }) => {
  const [messages, setMessages] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    console.log("🌐 Connecting to WebSocket...");

    if (clientRef.current) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`http://localhost:8085/ws?username=${username}`),
      reconnectDelay: 5000,

      // 👇 Send username header so Spring knows who this connection belongs to
      connectHeaders: {
        login: username,
        passcode: "guest", // dummy (Spring ignores it by default)
      },

      onConnect: () => {
        console.log("✅ Connected to /ws");

const userQueue = "/user/queue/updates"; // ✅ no username here!
client.subscribe(userQueue, (msg) => {
  console.log(`🎯 User-specific message for ${username}:`, msg.body);
  toast.success(`🔔 ${msg.body}`, { position: "bottom-right" });
});
console.log(`🎯 Subscribed to ${userQueue}`);


        // ✅ Admin-only topic
        if (role === "ADMIN") {
          client.subscribe("/topic/admins", (msg) => {
            console.log("📩 Message (admin):", msg.body);
            toast.info(`👑 Admin: ${msg.body}`, { position: "bottom-right" });
          });
          console.log("📡 Subscribed to /topic/admins (Admin)");
        }

        // ✅ Public topic (for all)
        client.subscribe("/topic/updates", (msg) => {
          console.log("📢 Public update:", msg.body);
          toast.info(`💬 ${msg.body}`, { position: "bottom-right" });
        });
        console.log("📢 Subscribed to /topic/updates (Public)");
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame);
      },

      debug: (str) => console.log("🔌 [STOMP]", str),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      console.log("🛑 Disconnecting STOMP client...");
      client.deactivate();
      clientRef.current = null;
    };
  }, [username, role]);

  return (
    <NotificationContext.Provider value={{ messages }}>
      {children}
    </NotificationContext.Provider>
  );
};
