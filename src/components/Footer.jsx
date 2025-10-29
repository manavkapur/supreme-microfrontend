// src/components/Footer.jsx
import React from "react";
import { Box, Typography, IconButton, Stack, Link } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1f1f1f" : "#1976d2",
        color: "white",
        py: 4,
        mt: 6,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, mb: 1, fontSize: { xs: "1.1rem", sm: "1.3rem" } }}
      >
        Supreme Build Solutions
      </Typography>

      {/* 🌐 Quick Links */}
      <Stack
        direction="row"
        justifyContent="center"
        spacing={3}
        sx={{ mb: 2, flexWrap: "wrap" }}
      >
        <Link href="/" underline="hover" color="inherit">
          Home
        </Link>
        <Link href="/contact" underline="hover" color="inherit">
          Contact
        </Link>
        <Link href="/quote/new" underline="hover" color="inherit">
          New Quote
        </Link>
        <Link href="/quotes" underline="hover" color="inherit">
          Live Updates
        </Link>
      </Stack>

      {/* 📱 Social Icons */}
      <Stack direction="row" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
        <IconButton
          href="tel:+919999999999"
          color="inherit"
          sx={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <PhoneIcon />
        </IconButton>
        <IconButton
          href="https://wa.me/919999999999"
          target="_blank"
          color="inherit"
          sx={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <WhatsAppIcon />
        </IconButton>
        <IconButton
          href="mailto:info@supremesolutions.com"
          color="inherit"
          sx={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <EmailIcon />
        </IconButton>
      </Stack>

      <Typography
        variant="body2"
        sx={{
          opacity: 0.8,
          fontSize: "0.9rem",
        }}
      >
        © {new Date().getFullYear()} Supreme Build Solutions. All Rights Reserved.
      </Typography>
    </Box>
  );
}
