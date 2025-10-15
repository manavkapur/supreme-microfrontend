// src/components/QuoteForm.js
import React, { useState } from "react";
import { createQuote } from "../api/quoteService";

export default function QuoteForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createQuote(form);
      alert("✅ Quote Submitted Successfully!");
      console.log("📦 Server Response:", res.data);
    } catch (err) {
      console.error("❌ Failed to submit quote:", err);
      alert("❌ Failed to submit quote. Check console for details.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2>Request a Quotation</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          name="name"
          placeholder="Your Name"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Your Email"
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          onChange={handleChange}
          required
        ></textarea>
        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            background: "#007bff",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Send Quote
        </button>
      </form>
    </div>
  );
}
