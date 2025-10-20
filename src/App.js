import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import axios from "axios";
import { NotificationProvider } from "./context/NotificationContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import QuoteForm from "./components/QuoteForm";
import QuoteUpdates from "./components/QuoteUpdates";
import Login from "./components/Login";
import Register from "./components/Register.jsx";
import ContactForm from "./components/ContactForm.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [role, setRole] = useState("USER");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserEmail(null);
    window.location.href = "/contact"; // 👈 Redirect guest to Contact page
  };

  return (
    <NotificationProvider role={role}>
      <WebSocketProvider username={userEmail}>
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
            <Link to="/quotes" style={{ color: "#fff", marginRight: "15px" }}>
              🔔 Live Updates
            </Link>
            <Link to="/contact" style={{ color: "#fff", marginRight: "15px" }}>
              📞 Contact Us
            </Link>

            {userEmail ? (
              <span
                onClick={handleLogout}
                style={{ cursor: "pointer", color: "#ff6666" }}
              >
                🚪 Logout
              </span>
            ) : (
              <Link to="/login" style={{ color: "#fff" }}>
                🔑 Login
              </Link>
            )}
          </nav>

          <Routes>
            {/* ✅ Public routes */}
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/login" element={<Login onLogin={setUserEmail} />} />
            <Route path="/register" element={<Register />} />

            {/* ✅ Protected routes */}
            {userEmail ? (
              <>
                <Route path="/quote/new" element={<QuoteForm />} />
                <Route path="/quotes" element={<QuoteUpdates />} />
              </>
            ) : (
              <>
                <Route path="/quote/new" element={<Navigate to="/login" />} />
                <Route path="/quotes" element={<Navigate to="/login" />} />
              </>
            )}

            {/* Default route */}
            <Route path="*" element={<Navigate to="/contact" />} />
          </Routes>
        </Router>

        <ToastContainer />
      </WebSocketProvider>
    </NotificationProvider>
  );
}
