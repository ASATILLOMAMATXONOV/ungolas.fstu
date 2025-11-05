import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Container } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import { BASE_API_URL } from "../config";
import backgroundImage from "../assets/iStock-Boonyachoat1.jpg";

export default function GoalDetail() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchPage = async () => {
      try {
        // ✅ Pages jadvalidagi barcha ma’lumotlarni olish
        const res = await fetch(`${BASE_API_URL}/pages`);
        const data = await res.json();

        // ✅ component_id bo‘yicha qidirish
        const found = data.find(
          (item) => Number(item.component_id) === Number(id)
        );

        setPage(found || null);
      } catch (err) {
        console.error("❌ Ma’lumot olishda xato:", err);
      } finally {
        setLoading(false);
      }
    };
        fetchPage();
  }, [id]);

  if (loading)
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f9faf9",
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );

  if (!page)
    return (
      <Typography align="center" sx={{ mt: 10, color: "#777" }}>
        ❌ Ma’lumot topilmadi
      </Typography>
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* 🔹 Navbar */}
      <Navbar />

      {/* 🏞️ Statik banner */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "45vh", md: "55vh" },
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 🟩 Fon rasmi */}
        <Box
          component="img"
          src={backgroundImage}
          alt="Banner background"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.7)",
            animation: "fadeIn 2s ease-out",
          }}
        />

        {/* 🔹 Title */}
        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            color: "#ffffff",
            fontWeight: 700,
            textAlign: "center",
            px: 2,
            maxWidth: "80%",
            textShadow: "0 3px 10px rgba(0,0,0,0.6)",
          }}
        >
          {page[`title_${lang}`]
            ?.replace(/<[^>]*>/g, "")
            ?.replace(/&nbsp;/g, " ")
            ?.trim()}
        </Typography>
      </Box>

      {/* 📄 Content qismi */}
      <Container sx={{ my: 8, maxWidth: "950px" }}>
        <Box
          sx={{
            color: "#333",
            fontSize: "1.05rem",
            lineHeight: 1.8,
            textAlign: "justify",
            "& p": { mb: 2 },
            "& ul": { pl: 3, mb: 2 },
            "& li": { mb: 1 },
            /* 🔹 IMG uchun animatsiyalar */
            "& img": {
              maxWidth: "100%",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              my: 2,
              opacity: 0,
              transform: "scale(0.98)",
              animation: "fadeZoomIn 1.2s ease forwards",
              transition: "transform 0.4s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
              },
            },
            "& a": {
              color: "#007b4e",
              textDecoration: "underline",
              "&:hover": { color: "#004f2b" },
            },
            /* 🔹 Animatsiya kalitlari */
            "@keyframes fadeZoomIn": {
              "0%": { opacity: 0, transform: "scale(0.95)" },
              "100%": { opacity: 1, transform: "scale(1)" },
            },
          }}
          dangerouslySetInnerHTML={{
            __html: page[`content_${lang}`] || "<p>No content available.</p>",
          }}
        />
      </Container>

      <Footer />
    </Box>
  );
}
