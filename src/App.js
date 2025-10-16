// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import QuoteForm from "./components/QuoteForm";
import QuoteUpdates from "./components/QuoteUpdates";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <NotificationProvider>
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
        </Routes>
      </Router>

      {/* Toast notification container */}
      <ToastContainer />
    </NotificationProvider>
  );
}
