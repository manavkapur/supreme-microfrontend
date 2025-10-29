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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/user-service/api/users/login`, {
        email,
        password,
      });

      const { token, userId, email: userEmail } = res.data;

      // Save core items
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userId", userId);

      // Try to decode role from JWT; fallback to 'USER'
      let role = "USER";
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        role = payload.role || role;
      } catch (err) {
        console.warn("⚠️ Could not decode token role:", err);
      }
      localStorage.setItem("role", role);

      // Set axios header immediately
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast.success("✅ Login successful!");

      // Trigger parent to update userEmail (this causes App to refresh role)
      onLogin(userEmail);

      // Optionally navigate immediately (admins go to admin dashboard)
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/quotes");
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      toast.error("Invalid email or password");
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
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: isMobile ? "100%" : 400,
          maxWidth: 500,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          textAlign: "center",
          mx: "auto",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          🔐 Login
        </Typography>

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3 }}>
          Don’t have an account?{" "}
          <Link
            component={RouterLink}
            to="/register"
            variant="body2"
            underline="hover"
            sx={{ color: "primary.main", fontWeight: 500, cursor: "pointer" }}
          >
            Register here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
