// src/components/Register.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";

export default function Register({ onRegistered }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // ✅ Detect small screens

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/user-service/api/users/register`, form);
      console.log("✅ Registered successfully:", res.data);
      toast.success("✅ Registration successful! You can now login.");
      onRegistered?.();
    } catch (err) {
      console.error("❌ Registration failed:", err);
      toast.error("❌ Something went wrong during registration");
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
      sx={{
        backgroundColor: "#f7f9fc",
        px: 2, // ✅ padding for small devices
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: isMobile ? "100%" : 400, // ✅ full width on mobile, fixed on desktop
          maxWidth: 500,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          textAlign: "center",
          mx: "auto",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          📝 Register
        </Typography>

        <Box component="form" onSubmit={handleRegister}>
          <TextField
            label="Full Name"
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
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{
              mt: 2,
              py: 1.2,
              fontSize: "1rem",
              borderRadius: 2,
              textTransform: "none",
            }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3 }}>
          Already have an account?{" "}
          <Link
            href="/login"
            variant="body2"
            underline="hover"
            sx={{ color: "primary.main", fontWeight: 500 }}
          >
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
