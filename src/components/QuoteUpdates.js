// src/components/QuoteUpdates.js
import React, { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

export default function QuoteUpdates() {
  const { messages } = useContext(NotificationContext);

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", fontFamily: "Arial" }}>
      <h2>🔔 Live Quote Updates</h2>

      {messages.length === 0 ? (
        <p style={{ color: "#777" }}>No updates yet...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {messages.map((msg, i) => {
            let parsed;
            try {
              parsed = typeof msg === "string" ? JSON.parse(msg) : msg;
            } catch {
              parsed = { message: msg };
            }

            return (
              <li
                key={i}
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #ddd",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              >
                <strong>Event:</strong> {parsed.event || "quote.updated"} <br />
                <strong>Status:</strong> {parsed.status || "N/A"} <br />
                <strong>Message:</strong> {parsed.message || "—"} <br />
                {parsed.user && (
                  <>
                    <strong>User:</strong> {parsed.user}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
