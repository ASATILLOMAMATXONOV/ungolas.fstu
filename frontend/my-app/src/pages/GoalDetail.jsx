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
        const res = await fetch(`${BASE_API_URL}/pages`);
        const data = await res.json();

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ✅ Navbar har doim ko‘rinadi */}
      <Navbar />

      {/* ✅ Banner har doim ko‘rinadi */}
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
        <Box
          component="img"
          src={backgroundImage}
          alt="Banner background"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.7)",
          }}
        />

        {/* Banner title (agar ma'lumot bo'lsa) */}
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
          {page?.[`title_${lang}`]
            ?.replace(/<[^>]*>/g, "")
            ?.replace(/&nbsp;/g, " ")
            ?.trim() || "Ma'lumot topilmadi"}
        </Typography>
      </Box>

      {/* 📄 CONTENT */}
      <Container sx={{ my: 8, maxWidth: "950px" }}>
        {loading ? (
          <Box
            sx={{
              height: "40vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress color="success" />
          </Box>
        ) : page ? (
          <Box
            sx={{
              color: "#333",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              textAlign: "justify",
              "& p": { mb: 2 },
              "& img": {
                maxWidth: "100%",
                borderRadius: 2,
                my: 2,
              },
            }}
            dangerouslySetInnerHTML={{
              __html: page[`content_${lang}`] || "<p>No content available.</p>",
            }}
          />
        ) : (
          <Typography
            align="center"
            sx={{ mt: 5, fontSize: "22px", fontWeight: 500, color: "#777" }}
          >
            ❌ Ma’lumot topilmadi
          </Typography>
        )}
      </Container>

      {/* ✅ Footer ham har doim ko‘rinadi */}
      <Footer />
    </Box>
  );
}
