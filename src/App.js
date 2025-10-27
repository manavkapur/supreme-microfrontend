import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { NotificationProvider } from "./context/NotificationContext";
import QuoteForm from "./components/QuoteForm";
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
import AdminDashboard from "./components/AdminDashboard.jsx";

export default function App() {
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [role, setRole] = useState(localStorage.getItem("role") || "USER");

  // Whenever userEmail changes (login/logout), update axios header and role
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const newRole = decoded.role || localStorage.getItem("role") || "USER";
        setRole(newRole);
        console.log("✅ User role set to:", newRole);
      } catch (err) {
        console.error("❌ Invalid JWT:", err);
        // fallback to whatever is stored
        setRole(localStorage.getItem("role") || "USER");
      }
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setRole("USER");
    }
  }, [userEmail]);

  const handleLogout = () => {
    localStorage.clear();
    setUserEmail(null);
    setRole("USER");
    window.location.href = "/contact"; // Redirect to contact page
  };

  return (
    <NotificationProvider role={role}>
      <Router>
        <Header userEmail={userEmail} role={role} onLogout={handleLogout} />

        {userEmail ? (
          <DashboardLayout userEmail={userEmail} onLogout={handleLogout} role={role}>
            <Routes>
              <Route path="/quote/new" element={<QuoteForm />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route path="/quotes" element={<QuoteHistory userEmail={userEmail} />} />
              {role === "ADMIN" && (
                <Route path="/admin/dashboard" element={<AdminDashboard userEmail={userEmail} />} />
              )}
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
    </NotificationProvider>
  );
}
