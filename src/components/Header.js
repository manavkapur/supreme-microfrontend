// src/components/Header.js
import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Tooltip,
  FormControlLabel,
  Switch,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

export default function Header({ userEmail, role, onLogout }) {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);


  const navLinks = [
    { label: "✍️ New Quote", to: "/quote/new" },
    { label: "🔔 Live Updates", to: "/quotes" },
    { label: "📞 Contact", to: "/contact" },
  ];

  if (role === "ADMIN") {
    navLinks.push({ label: "🛠 Admin Dashboard", to: "/admin/dashboard" });
  }

  // ✅ Drawer menu for mobile screens
  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{ my: 2, fontWeight: 600, color: mode === "dark" ? "#fff" : "#1976d2" }}
      >
        Supreme Build Solutions
      </Typography>
      <Divider />
      <List>
        {navLinks.map((item) => (
          <ListItem key={item.to} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.to}
              onClick={handleDrawerToggle}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 1 }} />
        {userEmail ? (
          <ListItem disablePadding>
            <ListItemButton onClick={onLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/login" onClick={handleDrawerToggle}>
              <LoginIcon fontSize="small" sx={{ mr: 1 }} /> Login
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: mode === "dark" ? "#1f1f1f" : "#1976d2",
          color: "white",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {/* 🍔 Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* 🧱 Brand and Desktop Links */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              Supreme Build Solutions
            </Typography>

            {!isMobile &&
              navLinks.map((item) => (
                <Button
                  key={item.to}
                  color="inherit"
                  component={RouterLink}
                  to={item.to}
                  sx={{ fontSize: "0.95rem" }}
                >
                  {item.label}
                </Button>
              ))}
          </Box>

          {/* 👤 Right side: Profile + Theme */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {userEmail ? (
              <>
                <Tooltip title={userEmail}>
                  <Avatar
                    sx={{
                      bgcolor: mode === "dark" ? "#90caf9" : "#1565c0",
                      width: 32,
                      height: 32,
                      fontSize: "0.9rem",
                    }}
                  >
                    {userEmail.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
                {!isMobile && (
                  <Button
                    color="error"
                    onClick={onLogout}
                    startIcon={<LogoutIcon />}
                    sx={{ textTransform: "none" }}
                  >
                    Logout
                  </Button>
                )}
              </>
            ) : (
              !isMobile && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{ textTransform: "none" }}
                >
                  Login
                </Button>
              )
            )}

            {/* 🌗 Theme Toggle */}
            <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mode === "dark"}
                    onChange={toggleTheme}
                    icon={<LightModeIcon sx={{ color: "#fdd835" }} />}
                    checkedIcon={<DarkModeIcon sx={{ color: "#90caf9" }} />}
                  />
                }
                label=""
              />
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 📱 Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better performance on mobile
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
