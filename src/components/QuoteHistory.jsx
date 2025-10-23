// src/components/QuoteHistory.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Box, Typography, Paper, Stack, Chip } from "@mui/material";
import { NotificationContext } from "../context/NotificationContext";
import { toast } from "react-toastify";

export default function QuoteHistory({ userEmail }) {
  const [quotes, setQuotes] = useState([]);
  const { events } = useContext(NotificationContext); // 👈 Access live updates

  // 🔹 Initial load
  useEffect(() => {
    if (!userEmail) return;
    axios
      .get(`http://localhost:8087/api/quotes/user/${userEmail}`)
      .then((res) => setQuotes(res.data))
      .catch((err) => console.error("Failed to load quote history:", err));
  }, [userEmail]);

  // 🔹 React to WebSocket updates
  useEffect(() => {
    if (!events || events.length === 0) return;
    const latest = events[events.length - 1];
    if (!latest || !latest.event) return;

    // 🧹 Normalize quoteId (handles ["java.lang.Long", 46] from backend)
    const quoteId = Array.isArray(latest.quoteId) ? latest.quoteId[1] : latest.quoteId;
    const emailMatch =
      latest.email?.toLowerCase() === userEmail?.toLowerCase();

    if (!emailMatch) return;

    // ✅ Handle quote.created
    if (latest.event === "quote.created") {
      toast.success(`🆕 New quote submitted (#${quoteId})`);
      setQuotes((prev) => [
        {
          id: quoteId,
          message: latest.message,
          status: latest.status || "Pending",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    // ✅ Handle quote.updated
    if (latest.event === "quote.updated") {
      toast.info(`🔄 Quote #${quoteId} updated to "${latest.status}"`);
      setQuotes((prev) =>
        prev.map((q) =>
          q.id === quoteId ? { ...q, status: latest.status } : q
        )
      );
    }
  }, [events, userEmail]);

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "reviewed":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3, color: "white" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        🧾 Your Quote History
      </Typography>

      {quotes.length === 0 ? (
        <Typography variant="body1" sx={{ color: "gray" }}>
          You haven’t submitted any quotes yet.
        </Typography>
      ) : (
        quotes.map((quote) => (
          <Paper
            key={quote.id}
            elevation={3}
            sx={{
              mb: 2,
              p: 2,
              backgroundColor: "#1e1e1e",
              border: "1px solid #333",
              borderRadius: 2,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Quote ID: #{quote.id}
                </Typography>
                <Typography variant="body2">
                  Message: {quote.message || "—"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                  Date:{" "}
                  {quote.createdAt
                    ? new Date(quote.createdAt).toLocaleString()
                    : "—"}
                </Typography>
              </Box>

              <Chip
                label={quote.status || "Pending"}
                color={statusColor(quote.status)}
                sx={{ fontWeight: "bold" }}
              />
            </Stack>
          </Paper>
        ))
      )}
    </Box>
  );
}
