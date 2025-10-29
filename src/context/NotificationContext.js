// src/context/NotificationContext.js
import React, { createContext, useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const safeParse = (body) => {
  try {
    // if body is already an object, return it
    if (typeof body === "object") return body;
    return JSON.parse(body);
  } catch {
    // fallback to wrapping raw body
    return { message: typeof body === "string" ? body : JSON.stringify(body) };
  }
};

export const NotificationContext = createContext();

export const NotificationProvider = ({ children, role }) => {
  const [events, setEvents] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    console.log("🌐 Connecting to WebSocket...");

    // Avoid duplicate clients
    if (clientRef.current) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("🚫 No JWT token found — aborting WebSocket connection");
      return;
    }

    const socketUrl = "https://api.supremebuildsolutions.com/ws";
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      onConnect: () => {
        console.log("✅ Authenticated connection established via SockJS");

        // small delay so server attaches user session
        setTimeout(() => {
          const email = localStorage.getItem("userEmail")?.toLowerCase();
          if (email) {
            const dest = `/user/${email}/queue/updates`;
            console.log("🧩 Subscribing to", dest);
            client.subscribe(dest, (msg) => {
              console.log("🎯 [USER MESSAGE] =>", msg.body);
              const parsed = safeParse(msg.body);
              setEvents((prev) => [...prev, parsed]);
              if (parsed.message) {
                toast.info(parsed.message, { position: "bottom-right", autoClose: 3500 });
              }
            });
          } else {
            console.warn("⚠️ No userEmail in localStorage — skipping user subscription");
          }

          // Admin subscriptions
          if (role === "ADMIN") {
            console.log("👑 Subscribing admin topics");
            client.subscribe("/topic/admins", (msg) => {
              const parsed = safeParse(msg.body);
              console.log("👑 [ADMIN]", parsed);
              setEvents((prev) => [...prev, parsed]);
              if (parsed.message) toast.info(`Admin: ${parsed.message}`, { position: "bottom-right" });
            });

            client.subscribe("/topic/quotes", (msg) => {
              const parsed = safeParse(msg.body);
              console.log("📄 [QUOTE EVENT]", parsed);
              setEvents((prev) => [...prev, { ...parsed, source: "quotes" }]);
            });

            client.subscribe("/topic/contacts", (msg) => {
              const parsed = safeParse(msg.body);
              console.log("📞 [CONTACT EVENT]", parsed);
              setEvents((prev) => [...prev, { ...parsed, source: "contacts" }]);
            });
          }

          // Public broadcast (optional)
          client.subscribe("/topic/updates", (msg) => {
            console.log("🌍 [PUBLIC]", msg.body);
          });
        }, 600);
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
      try {
        client.deactivate();
      } catch (e) {
        /* ignore */
      }
      clientRef.current = null;
    };
  }, [role]); // re-run when role changes (subscribe/unsubscribe admin topics)

  return (
    <NotificationContext.Provider value={{ events }}>
      {children}
    </NotificationContext.Provider>
  );
};
