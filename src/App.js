// src/App.js
import React, { useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { requestFcmToken, onMessageListener } from "./firebase";
import QuoteForm from "./components/QuoteForm";
import QuoteUpdates from "./components/QuoteUpdates";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";



export default function App() {
  useEffect(() => {
    // ✅ Ask for notification permission + send token to backend
    const registerFcm = async () => {
      const token = await requestFcmToken();
      if (token) {
        try {
          await axios.post("http://localhost:8086/api/users/register-fcm", {
            userId: 1, // TODO: dynamically replace with logged-in user ID
            fcmToken: token,
          });
          console.log("✅ Registered FCM token with backend");
        } catch (err) {
          console.error("❌ Failed to register FCM token:", err);
        }
      }
    };

    registerFcm();

    // 🔔 Listen for foreground notifications
    onMessageListener().then((payload) => {
      const { title, body } = payload.notification;
      toast.info(`🔔 ${title}: ${body}`, {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
      });
    });
  }, []);

  return (
    <Router>
      <nav
        style={{
          background: "#222",
          color: "#fff",
          padding: "10px 20px",
          marginBottom: "20px",
        }}
      >
        <Link to="/quote/new" style={{ color: "#fff", marginRight: "15px" }}>
          ✍️ New Quote
        </Link>
        <Link to="/quotes" style={{ color: "#fff" }}>
          🔔 Live Updates
        </Link>
      </nav>

      <Routes>
        <Route path="/quote/new" element={<QuoteForm />} />
        <Route path="/quotes" element={<QuoteUpdates />} />
        <Route path="/" element={<Navigate to="/quote/new" />} />
      </Routes>

      <ToastContainer />
    </Router>
  );
}
