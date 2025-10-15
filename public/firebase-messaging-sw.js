/* public/firebase-messaging-sw.js */

importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js');

// 👇 Public web credentials (safe to expose)
firebase.initializeApp({
  apiKey: "AIzaSyBca234eieNwDHXTSw9hH5qMEhIDL8WuSA",
  authDomain: "supreme-microservices.firebaseapp.com",
  projectId: "supreme-microservices",
  storageBucket: "supreme-microservices.firebasestorage.appspot.com",
  messagingSenderId: "779394132777",
  appId: "1:779394132777:web:4ec73d23c14f178e4f2538",
});

const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message:", payload);
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/logo192.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
