import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Paper, Stack, Divider, Chip } from "@mui/material";

export default function QuoteHistory({ userEmail }) {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    if (!userEmail) return;
    axios
      .get(`http://localhost:8087/api/quotes/user/${userEmail}`)
      .then((res) => setQuotes(res.data))
      .catch((err) => console.error("Failed to load quote history:", err));
  }, [userEmail]);

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "created":
        return "default";
      case "reviewed":
        return "info";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "warning";
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
                  Date: {new Date(quote.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Chip
                label={quote.status || "Created"}
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
