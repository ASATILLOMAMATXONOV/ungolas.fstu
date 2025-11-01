import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import { BASE_API_URL } from "../config";
import backgroundImage from "../assets/iStock-Boonyachoat1.jpg";

export default function GoalDetail() {
  const { id } = useParams(); // URL orqali kelgan banner_id
  const { lang } = useLanguage();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Faqat shu banner_id ga tegishli sahifalarni olish
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/pages`);
        const data = await res.json();

        // ✅ Faqat shu ID (banner_id) bo‘yicha filterlash
        const filtered = Array.isArray(data)
          ? data.filter((item) => String(item.banner_id) === String(id))
          : [];

        setPages(filtered);
      } catch (err) {
        console.error("❌ Ma’lumot olishda xato:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, [id]);

  // ⏳ Yuklanish holati
  if (loading)
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );

  // ❌ Agar ma’lumot topilmasa
  if (!pages || pages.length === 0)
    return (
      <Typography align="center" sx={{ color: "white", mt: 10 }}>
        ❌ Ushbu banner_id ({id}) uchun ma’lumot topilmadi
      </Typography>
    );

  // ✅ Sahifa chiqishi
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f9faf9",
      }}
    >
      <Navbar />

      {/* 🏞️ Banner orqa fon */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "40vh", md: "50vh" },
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={backgroundImage}
          alt="Banner background"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scale(1.05)",
            animation: "zoomIn 10s ease-in-out infinite alternate",
            "@keyframes zoomIn": {
              "0%": { transform: "scale(1.05)" },
              "100%": { transform: "scale(1.15)" },
            },
          }}
        />
        {/* 🌈 Gradient */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.75) 100%)",
          }}
        />
      </Box>

      {/* 📘 Shu banner_id ga tegishli barcha page-lar */}
      <Container sx={{ my: 8 }}>
        {pages.map((page, index) => (
          <Paper
            key={page.id || index}
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              bgcolor: "white",
              maxWidth: "900px",
              mx: "auto",
              mb: 4,
              textAlign: "center",
              transform: "translateY(0)",
              animation: `fadeInUp 0.9s ease ${index * 0.15}s both`,
              "@keyframes fadeInUp": {
                "0%": { opacity: 0, transform: "translateY(20px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
              transition: "all 0.4s ease",
              "&:hover": {
                boxShadow: "0 8px 25px rgba(0, 161, 82, 0.25)",
                transform: "translateY(-5px)",
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#009f5d",
                mb: 1,
                textShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#007a45",
                  textShadow: "0 0 12px rgba(0,161,82,0.5)",
                  transform: "scale(1.03)",
                },
              }}
            >
              {page[`title_${lang}`]}
            </Typography>
          </Paper>
        ))}
      </Container>

      {/* ⚪ Footer */}
      <Box sx={{ flexShrink: 0, mt: "auto" }}>
        <Footer />
      </Box>
    </Box>
  );
}
