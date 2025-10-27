// src/components/AdminDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Pagination,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { NotificationContext } from "../context/NotificationContext";

export default function AdminDashboard() {
  const { events } = useContext(NotificationContext);
  const [logs, setLogs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // 🧠 Fetch pending quotes (REST)
  const fetchPendingQuotes = async (pageNumber = 0) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8087/api/quotes/admin/pending?page=${pageNumber}&size=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuotes(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("❌ Failed to fetch pending quotes:", err);
      toast.error("Failed to load pending quotes");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Load quotes on mount
  useEffect(() => {
    fetchPendingQuotes();
  }, []);

  // 🧩 Handle new live event logs
  useEffect(() => {
    if (!events.length) return;
    const latest = events[events.length - 1];
    setLogs((prev) => [latest, ...prev]);
  }, [events]);

  // 🎨 Chip color by event source
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

  // 🟢 Approve / Reject actions
  const updateQuoteStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8087/api/quotes/admin/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`✅ Quote #${id} ${newStatus}`);
      fetchPendingQuotes(page); // refresh table
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quote status");
    }
  };

  // 🧭 Render
  return (
    <Box sx={{ p: 3, color: "white" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        🧭 Live Admin Dashboard
      </Typography>

      {/* 🔹 Section 1: Pending Quotes */}
      <Paper
        sx={{
          mb: 4,
          p: 3,
          backgroundColor: "#1e1e1e",
          border: "1px solid #333",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          📋 Pending Quotes
        </Typography>

        {loading ? (
          <CircularProgress color="inherit" size={28} />
        ) : quotes.length === 0 ? (
          <Typography>No pending quotes 🎉</Typography>
        ) : (
          <>
            <Table sx={{ color: "white" }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quotes.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>{q.id}</TableCell>
                    <TableCell>{q.name}</TableCell>
                    <TableCell>{q.email}</TableCell>
                    <TableCell>{q.message}</TableCell>
                    <TableCell>
                      <Chip label={q.status} color="warning" />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => updateQuoteStatus(q.id, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => updateQuoteStatus(q.id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <Stack alignItems="center" sx={{ mt: 2 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(e, val) => {
                  setPage(val - 1);
                  fetchPendingQuotes(val - 1);
                }}
                color="primary"
              />
            </Stack>
          </>
        )}
      </Paper>

      {/* 🔹 Section 2: Live Updates */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        🔴 Live Activity Feed
      </Typography>

      {logs.length === 0 ? (
        <Typography sx={{ color: "gray" }}>No live updates yet...</Typography>
      ) : (
        logs.map((log, i) => (
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
        ))
      )}
    </Box>
  );
}
