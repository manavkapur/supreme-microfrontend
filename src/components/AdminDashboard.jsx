// src/components/AdminDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { Box, Typography, Paper, Chip, Stack } from "@mui/material";

export default function AdminDashboard() {
  const { events } = useContext(NotificationContext);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!events.length) return;
    const latest = events[events.length - 1];
    setLogs((prev) => [latest, ...prev]);
  }, [events]);

  const colorForSource = (source) => {
    switch (source) {
      case "quotes":
        return "info";
      case "contacts":
        return "success";
      default:
        return "warning";
    }
  };

  return (
    <Box sx={{ p: 3, color: "white" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        🧭 Live Admin Dashboard
      </Typography>

      {logs.map((log, i) => (
        <Paper
          key={i}
          elevation={2}
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: "#1e1e1e",
            border: "1px solid #333",
            borderRadius: 2,
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="subtitle1">
                📢 {log.event || "Event"} — {log.message || "(No message)"}
              </Typography>
              <Typography variant="body2" sx={{ color: "gray" }}>
                {log.email || log.username || "N/A"} —{" "}
                {new Date(log.timestamp || Date.now()).toLocaleString()}
              </Typography>
            </Box>
            <Chip label={log.source || "unknown"} color={colorForSource(log.source)} />
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}
