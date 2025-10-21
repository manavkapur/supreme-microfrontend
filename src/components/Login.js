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
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8086/api/users/login", {
        email,
        password,
      });

      const { token, userId, email: userEmail } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userId", userId);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      toast.success("✅ Login successful!");
      onLogin(userEmail);
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
            to="/register"   // ✅ Now this navigates properly
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
