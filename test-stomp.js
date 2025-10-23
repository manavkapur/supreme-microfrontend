// npm install @stomp/stompjs sockjs-client
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const token = "PASTE_YOUR_JWT_HERE";

const socket = new SockJS("http://localhost:8083/ws");
const client = new Client({
  webSocketFactory: () => socket,
  connectHeaders: {
    Authorization: `Bearer ${token}`,
  },
  debug: (str) => console.log("🐞", str),
  onConnect: () => {
    console.log("✅ Connected to Channel Server");

    // Subscribe to your personal queue
    client.subscribe("/user/queue/updates", (msg) => {
      console.log("📩 Message received:", msg.body);
    });

    // Send a test message (this goes to the broker, not your user queue)
    client.publish({
      destination: "/app/test",
      body: JSON.stringify({
        event: "quote.test",
        message: "Hello from CLI 🚀",
      }),
    });
  },
});

client.activate();
