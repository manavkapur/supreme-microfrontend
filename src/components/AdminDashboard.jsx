// src/components/AdminDashboard.jsx
import React, { useContext, useEffect, useState, useCallback } from "react";
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
  TableContainer,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { NotificationContext } from "../context/NotificationContext";

/**
 * Utility: normalize backend ids which sometimes come as:
 *  - number
 *  - string
 *  - ["java.lang.Long", 46]
 */
const normalizeId = (raw) => {
  if (raw == null) return null;
  if (Array.isArray(raw)) return raw[raw.length - 1];
  if (typeof raw === "object") {
    // e.g. { "@class": "...", "quoteId": ["java.lang.Long", 46] }
    // If object has numeric value inside, try to extract
    if (raw.hasOwnProperty("value")) return raw.value;
    return JSON.stringify(raw);
  }
  return raw;
};

export default function AdminDashboard() {
  const { events } = useContext(NotificationContext);
  const [logs, setLogs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchPendingQuotes = useCallback(async (pageNumber = 0) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/quote-service/api/quotes/admin/pending?page=${pageNumber}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;
      setQuotes((data.content || []).map((q) => ({ ...q, id: q.id })));
      setTotalPages(data.totalPages || 1);
      setPage(data.number || pageNumber);
    } catch (err) {
      console.error("❌ Failed to fetch pending quotes:", err);
      toast.error("Failed to load pending quotes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingQuotes(0);
  }, [fetchPendingQuotes]);

  // When REST list is loaded and events arrive, update both logs & pending list
  useEffect(() => {
    if (!events || events.length === 0) return;
    const latest = events[events.length - 1];
    setLogs((prev) => [latest, ...prev]);

    try {
      const ev = latest;
      const eventType = ev.event || ev.type || "";
      // extract quoteId flexibly (quoteId, id, or nested)
      const rawId = ev.quoteId ?? ev.quoteID ?? ev.id ?? ev.quote_id;
      const id = normalizeId(rawId);

      if (eventType === "quote.created") {
        // only add if Pending
        const status = (ev.status || "Pending").toString();
        if (status.toLowerCase() === "pending") {
          // avoid duplicate
          setQuotes((prev) => {
            if (prev.some((q) => String(q.id) === String(id))) return prev;
            const newQ = {
              id,
              name: ev.name || ev.username || "—",
              email: ev.email || ev.username || "—",
              message: ev.message || "—",
              status: status,
            };
            toast.success(`🆕 Quote created (${id})`);
            return [newQ, ...prev];
          });
        }
      }

      if (eventType === "quote.updated") {
        // update or remove depending on status
        const status = ev.status || "";
        setQuotes((prev) => {
          const idx = prev.findIndex((q) => String(q.id) === String(id));
          if (idx === -1) {
            // not present in this page — if it's now pending, add it; otherwise ignore
            if (status.toLowerCase() === "pending") {
              const newQ = {
                id,
                name: ev.name || ev.username || "—",
                email: ev.email || ev.username || "—",
                message: ev.message || "—",
                status,
              };
              return [newQ, ...prev];
            }
            return prev;
          }
          // found in list
          if (status.toLowerCase() !== "pending") {
            toast.info(`🔄 Quote #${id} → ${status}`);
            const copy = [...prev];
            copy.splice(idx, 1); // remove if not pending
            return copy;
          }
          // otherwise update fields
          const copy = [...prev];
          copy[idx] = {
            ...copy[idx],
            message: ev.message ?? copy[idx].message,
            status: status ?? copy[idx].status,
            name: ev.name ?? copy[idx].name,
          };
          return copy;
        });
      }
    } catch (e) {
      console.warn("Event handling failed:", e);
    }
  }, [events]);

const updateQuoteStatus = async (id, newStatus) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      `${process.env.REACT_APP_API_URL}/quote-service/api/quotes/admin/${id}/status`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"   // 🔥 REQUIRED
        }
      }
    );

    toast.success(`✅ Quote #${id} ${newStatus}`);
    setQuotes((prev) => prev.filter((q) => String(q.id) !== String(id)));
    fetchPendingQuotes(page);

  } catch (err) {
    console.error("Failed to update quote:", err);
    toast.error("Failed to update quote");
  }
};


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
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        🧭 Live Admin Dashboard
      </Typography>

      <Paper sx={{ mb: 4, p: 3, backgroundColor: "#1e1e1e" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📋 Pending Quotes
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : quotes.length === 0 ? (
          <Typography>No pending quotes 🎉</Typography>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ background: "#191919" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "white" }}>ID</TableCell>
                    <TableCell sx={{ color: "white" }}>Name</TableCell>
                    <TableCell sx={{ color: "white" }}>Email</TableCell>
                    <TableCell sx={{ color: "white" }}>Message</TableCell>
                    <TableCell sx={{ color: "white" }}>Status</TableCell>
                    <TableCell sx={{ color: "white" }}>Actions</TableCell>
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
                        <Chip label={q.status || "Pending"} color="warning" />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
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
            </TableContainer>

            <Stack alignItems="center" sx={{ mt: 2 }}>
              <Pagination
                count={Math.max(1, totalPages)}
                page={page + 1}
                onChange={(e, val) => {
                  const newPage = val - 1;
                  setPage(newPage);
                  fetchPendingQuotes(newPage);
                }}
                color="primary"
              />
            </Stack>
          </>
        )}
      </Paper>

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
            sx={{ mb: 2, p: 2, backgroundColor: "#1e1e1e", border: "1px solid #333" }}
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
