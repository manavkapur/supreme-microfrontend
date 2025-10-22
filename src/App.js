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
import Header from "./components/Header.js";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Home from "./components/Home.jsx";
import Footer from "./components/Footer.jsx";
import QuoteHistory from "./components/QuoteHistory.jsx";

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
        <Header userEmail={userEmail} onLogout={handleLogout} />
        {userEmail ? (
          <DashboardLayout userEmail={userEmail} onLogout={handleLogout}>
            <Routes>
              <Route path="/quote/new" element={<QuoteForm />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route path="/quotes" element={<QuoteHistory userEmail={userEmail} />} />
            </Routes>
          </DashboardLayout>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={setUserEmail} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
        <Footer />
      </Router>
        <ToastContainer />
      </WebSocketProvider>
    </NotificationProvider>
  );
}
