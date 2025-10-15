// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBca234eieNwDHXTSw9hH5qMEhIDL8WuSA",
  authDomain: "supreme-microservices.firebaseapp.com",
  projectId: "supreme-microservices",
  storageBucket: "supreme-microservices.firebasestorage.app",
  messagingSenderId: "779394132777",
  appId: "1:779394132777:web:4ec73d23c14f178e4f2538"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 🔑 Ask browser for permission and generate FCM token
export const requestFcmToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BHJfbcOeULQCXcT7LWw4EBcE8EVPu26W8f3Ea3L_n-QmKop1ht0ayKXvq8JoyZrWaSds8cbIzUZW0dnnjNz89_g", // 👈 Your actual VAPID key
    });

    if (currentToken) {
      console.log("✅ FCM Token:", currentToken);
      return currentToken;
    } else {
      console.warn("⚠️ No registration token available. Ask user to allow notifications.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
    return null;
  }
};

// 🔔 Listen for foreground (in-app) messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("📩 Foreground message:", payload);
      resolve(payload);
    });
  });
