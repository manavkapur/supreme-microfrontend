import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  Paper,
  Stack,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";

export default function Home() {
  return (
    <Box
      sx={{
        backgroundColor: "#f7f9fc",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* 🦸 HERO SECTION */}
      <Box
        sx={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.4)), url('https://plus.unsplash.com/premium_photo-1754030525795-e872b9b37d55?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          py: { xs: 8, sm: 12, md: 14 },
          textAlign: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3rem" },
              lineHeight: 1.2,
              textShadow: "0 3px 6px rgba(0,0,0,0.4)",
            }}
          >
            Safe, Secure & Reliable
            <br />
            Temporary Fencing Solutions
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 4,
              fontSize: { xs: "1rem", sm: "1.2rem" },
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              px: { xs: 2, sm: 0 },
            }}
          >
            Serving construction, event, and crowd control needs with strength & safety.
          </Typography>

          {/* 📞 QUICK CONTACT BUTTONS */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ px: { xs: 3, sm: 0 } }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PhoneIcon />}
              href="tel:+17803273111"
              sx={{
                borderRadius: 2,
                width: { xs: "100%", sm: "auto" },
                fontWeight: 600,
              }}
            >
              Call Us
            </Button>

            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<WhatsAppIcon />}
              href="https://wa.me/+17803273111"
              target="_blank"
              sx={{
                borderRadius: 2,
                width: { xs: "100%", sm: "auto" },
                fontWeight: 600,
              }}
            >
              WhatsApp
            </Button>

            <Button
              variant="contained"
              color="info"
              size="large"
              startIcon={<EmailIcon />}
              href="mailto:info@supremebuildsolutions.com"
              sx={{
                borderRadius: 2,
                width: { xs: "100%", sm: "auto" },
                fontWeight: 600,
              }}
            >
              Email Us
            </Button>
          </Stack>
        </Container>
      </Box>


<Grid
  container
  justifyContent="center"
  alignItems="stretch"
  spacing={3}
  sx={{
    mx: "auto",
    maxWidth: "1200px",
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
    },
    gap: "24px", // ✅ replaces spacing for more precise control
  }}
>
  {[
    {
      title: "🏗️ Construction Fencing",
      desc: "Durable, galvanized fencing solutions that secure your construction sites and heavy equipment efficiently.",
      img: "https://images.unsplash.com/photo-1642553204922-bbbe0fe55749?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=991",
    },
    {
      title: "🎉 Event Barriers",
      desc: "Aesthetic and easy-to-install barriers that maintain crowd flow while blending seamlessly into event spaces.",
      img: "https://images.unsplash.com/photo-1759782180786-5cd4b05e3b6c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1973",
    },
    {
      title: "🚧 Crowd Control Solutions",
      desc: "Reliable and portable control systems ideal for public gatherings, ensuring both order and safety.",
      img: "https://images.unsplash.com/photo-1574353788609-6c2bda745ac4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
    },
  ].map((item, idx) => (
    <Paper
      key={idx}
      elevation={6}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        height: 340,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box
        sx={{
          height: 150,
          width: "100%",
          backgroundImage: `url(${item.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Box
        sx={{
          p: 3,
          textAlign: "center",
          flexGrow: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: "primary.main",
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          {item.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem" },
            lineHeight: 1.5,
          }}
        >
          {item.desc}
        </Typography>
      </Box>
    </Paper>
  ))}
</Grid>



    </Box>
  );
}
