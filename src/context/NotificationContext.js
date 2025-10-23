import React, { createContext, useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children, role }) => {
  const [events, setEvents] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    console.log("🌐 Connecting to WebSocket...");

    // 🚫 Avoid duplicate clients
    if (clientRef.current) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("🚫 No JWT token found — aborting WebSocket connection");
      return;
    }

    const socketUrl = "http://localhost:8083/ws";
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      onConnect: () => {
        console.log("✅ Authenticated connection established via SockJS");

        // Delay ensures user session binding
        setTimeout(() => {
          console.log("🧩 Subscribing to /user/queue/updates ...");

          // 🎯 Subscribe to user queue
          const email = localStorage.getItem("userEmail")?.toLowerCase();
          const destination = `/user/${email}/queue/updates`;
          console.log("🧩 Subscribing to", destination);
          client.subscribe(destination, (msg) => {
            console.log("🎯 [RAW MESSAGE] =>", msg.body);

            try {
              const data = JSON.parse(msg.body);
              console.log("✅ [PARSED DATA] =>", data);

              setEvents((prev) => [...prev, data]);

              toast.success(`💬 ${data.message || "New update received"}`, {
                position: "bottom-right",
                autoClose: 4000,
                theme: "colored",
              });
            } catch (err) {
              console.warn("⚠️ [NON-JSON MESSAGE]", msg.body);
              setEvents((prev) => [...prev, { message: msg.body }]);

              toast.info(`📩 ${msg.body}`, {
                position: "bottom-right",
                autoClose: 4000,
                theme: "colored",
              });
            }
          });

          // 👑 Admin messages
          if (role === "ADMIN") {
            client.subscribe("/topic/admins", (msg) => {
              console.log("👑 Admin message:", msg.body);
              toast.info(`👑 ${msg.body}`, { position: "bottom-right" });
            });
          }

          // 🌍 Public messages
          client.subscribe("/topic/updates", (msg) => {
            console.log("🌍 Public message:", msg.body);
          });
        }, 1000);
      },

      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame);
      },

      onWebSocketError: (event) => {
        console.error("🚫 WebSocket Error:", event);
      },

      debug: (str) => console.log("🔌 [STOMP DEBUG]", str),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      console.log("🛑 Disconnecting STOMP client...");
      client.deactivate();
      clientRef.current = null;
    };
  }, [role]);

  return (
    <NotificationContext.Provider value={{ events }}>
      {children}
    </NotificationContext.Provider>
  );
};
