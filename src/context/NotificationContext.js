// src/context/NotificationContext.js
import React, { createContext, useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const clientRef = useRef(null); // Prevent duplicate clients

  useEffect(() => {
    console.log("🌐 Connecting to WebSocket...");

    // 🛑 Prevent multiple client instances (React Strict Mode in dev runs effects twice)
    if (clientRef.current) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8083/ws"),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ Connected to /ws");

        client.subscribe("/topic/quotes", (msg) => {
          console.log("📩 Quote Event Raw:", msg.body);

          let data;
          try {
            data = JSON.parse(msg.body);
          } catch {
            data = { message: msg.body };
          }

          console.log("✅ Parsed Quote Event:", data);

          // ✅ Update state cleanly (no toast inside)
          setMessages((prev) => [...prev, data]);

          // ✅ Toast triggered outside React render scope
          const messageText =
            data.message ||
            `${data.event || "Quote update"} | ${data.status || "N/A"}`;

          toast.info(`💬 ${messageText}`, {
            position: "bottom-right",
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "colored",
          });
        });
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
  }, []);

  return (
    <NotificationContext.Provider value={{ messages }}>
      {children}
    </NotificationContext.Provider>
  );
};
