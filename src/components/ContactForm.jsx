// src/components/ContactForm.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/contact-service/api/contact`, form, {
        headers,
      });
      toast.success("📩 Contact form submitted successfully!");
      console.log("✅ Contact submitted:", res.data);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("❌ Failed to submit contact:", err);
      toast.error("❌ Failed to submit contact form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      sx={{ backgroundColor: "#f7f9fc", px: 2 }}
    >
      <Paper
        elevation={4}
        sx={{
          width: isMobile ? "100%" : 500,
          maxWidth: 600,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          mx: "auto",
        }}
      >
        <Typography variant="h5" gutterBottom textAlign="center" sx={{ fontWeight: 600 }}>
          📞 Contact Us
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Message"
            name="message"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={form.message}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.2, borderRadius: 2, textTransform: "none" }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
