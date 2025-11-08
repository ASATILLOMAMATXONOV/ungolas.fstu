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
import { motion } from "framer-motion";
import defaultBanner from "../assets/iStock-Boonyachoat1.jpg"; // fallback rasm
import { useNavigate } from "react-router-dom";

export default function GoalList() {
  const { id } = useParams();
  const { lang } = useLanguage();

  const [componentData, setComponentData] = useState([]);
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // 🔹 Banner va Component ma’lumotlarini olish
// ✅ Ma'lumotni olish
useEffect(() => {
  const fetchComponent = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/components`);
      const data = await res.json();
      const filtered = data.filter(
        (item) => String(item.banner_id) === String(id)
      );
      setComponentData(filtered);
    } catch (err) {
      console.error("❌ Ma'lumot olishda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchComponent();
}, [id]);

// ✅ Agar ma'lumot bo'lmasa → asosiy sahifaga o'tkazish
useEffect(() => {
  if (!loading && componentData.length === 0) {
    navigate("/");  // 🔹 Home ga redirect
  }
}, [loading, componentData, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* 🔹 Navbar */}
      <Navbar />

      {/* 🏞️ Banner Sektsiyasi */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 250, md: 400 },
          backgroundImage: `url(${
            bannerData?.image
              ? BASE_API_URL.replace("/api", "") + bannerData.image
              : defaultBanner
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.55)",
          },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            position: "relative",
            zIndex: 1,
            color: "#fff",
            fontWeight: 700,
            textAlign: "center",
            textShadow: "0 4px 10px rgba(0,0,0,0.5)",
          }}
        >
          {bannerData?.[`title_${lang}`] ||
            bannerData?.title_uz ||
            "SDG Maqsadlari"}
        </Typography>
      </Box>

      {/* 📄 Kontentlar bo‘limi */}
      <Container sx={{ my: 8 }}>
        {componentData.length > 0 ? (
          componentData.map((item, index) => {
            const imageUrl = item[`image_${lang}`] || item.image_uz || "";
            const finalImage = imageUrl.replace(/\\/g, "/");
            const hasImage = Boolean(finalImage);

            return (
       <Paper
  key={item.id}
  component={motion.div}
  onClick={() => navigate(`/goal-list/${item.id}`)}   // ➤ bosganda GoalDetail ga o‘tadi
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: index * 0.1 }}
  viewport={{ once: true }}
  sx={{
    p: { xs: 3, md: 6 },
    borderRadius: 5,
    mb: 6,
    cursor: "pointer",                  // 🔹 Hover-da ko‘rsatkich bo‘ladi
    background: "#ffffff",
    boxShadow: "0px 12px 40px rgba(0,0,0,0.09)",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0px 18px 45px rgba(0,0,0,0.12)",
      transition: "0.3s",
    },
  }}
>

  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: hasImage ? "1.2fr 1fr" : "1fr" },
      gap: 5,
      alignItems: "center",
    }}
  >
    {hasImage && (
      <Box sx={{ position: "relative" }}>
        <Box
          component={motion.img}
          src={`${BASE_API_URL.replace("/api", "")}${finalImage.startsWith("/") ? finalImage : "/" + finalImage}`}
          alt={item[`title_${lang}`]}
          sx={{
            width: "100%",
            height: { xs: 240, md: 360 },
            borderRadius: 4,
            objectFit: "cover",
            boxShadow: "0 8px 25px rgba(0,0,0,0.16)",
          }}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.35 }}
        />
      </Box>
    )}

    <Box>
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "28px", md: "34px" },
          mb: 3,
          color: "#009f5d",
        }}
      >
        {item[`title_${lang}`]}
      </Typography>

      {/* Content */}
      <Box
        sx={{
          fontSize: "18px",
          lineHeight: "32px",
          color: "#3a3a3a",
          "& *": {
            color: "#3a3a3a !important",
            fontFamily: "Inter, sans-serif !important",
          },
        }}
        dangerouslySetInnerHTML={{
          __html: item[`content_${lang}`] || "",
        }}
      />
    </Box>
  </Box>
</Paper>

            );
          })
        ) : (
          <Typography
            align="center"
            sx={{
              color: "#888",
              mt: 10,
              fontSize: "20px",
              fontWeight: 500,
              fontStyle: "italic",
            }}
          >
            ❌ Ma’lumot topilmadi
          </Typography>
        )}
      </Container>

      <Footer />
    </Box>
  );
}
