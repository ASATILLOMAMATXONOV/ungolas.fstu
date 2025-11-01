import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Button, CircularProgress } from "@mui/material";
import backgroundImage from "../assets/iStock-Boonyachoat1.jpg";
import { BASE_URL, BASE_API_URL } from "../config";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom"; // ✅ qo‘shildi

export default function GoalsSection() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const navigate = useNavigate(); // ✅ yo‘naltirish uchun

  const buttonText = {
    uz: "Kirish",
    ru: "Войти",
    en: "Enter",
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/banners`);
        const data = await res.json();
        setBanners(data);
      } catch (err) {
        console.error("❌ Bannerlarni olishda xato:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "white",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );

  return (
    <Box
      sx={{
        position: "relative",
        py: 10,
        px: 2,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(0deg, rgba(255,255,255,0) 30%, rgba(255,255,255,1) 100%)",
          zIndex: 0,
        },
      }}
    >
      {/* 🟢 Sarlavha */}
      <Box sx={{ position: "relative", zIndex: 2, mb: 6 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            backgroundColor: "#1abc9c",
            transform: "rotate(45deg)",
            margin: "0 auto 16px auto",
          }}
        />
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#0d47a1",
            mb: 1,
          }}
        >
          {lang === "uz" && "Ushbu tashabbus orqali biz qo‘llab-quvvatlayotgan"}
          {lang === "ru" && "Инициатива, которую мы поддерживаем через эти цели"}
          {lang === "en" && "The goals we support through this initiative"}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#1abc9c",
          }}
        >
          {lang === "uz" && "Maqsadlar"}
          {lang === "ru" && "Цели"}
          {lang === "en" && "Goals"}
        </Typography>
      </Box>

      {/* 🖼 Rasmli grid */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
        sx={{ maxWidth: 1200, position: "relative", zIndex: 2 }}
      >
        {banners.map((goal) => (
          <Grid
            item
            key={goal.id}
            xs={12}
            sm={6}
            md={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                height: 250,
                width: "100%",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.03)" },
                "&:hover .overlay": { opacity: 1, transform: "scale(1)" },
                "&:hover img": {
                  transform: "scale(1.05)",
                  filter: "brightness(0.7)",
                },
              }}
            >
              <Box
                component="img"
                src={`${BASE_URL}${goal[`image_${lang}`]}`}
                alt={goal[`title_${lang}`]}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "all 0.4s ease",
                }}
              />

              {/* ✨ Overlay */}
              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0, 0, 0, 0.55)",
                  color: "white",
                  opacity: 0,
                  transform: "scale(1.2)",
                  transition: "all 0.4s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/goal/${goal.id}`)} // ✅ yangi sahifaga o'tish
                  sx={{
                    borderColor: "white",
                    color: "white",
                    borderRadius: 5,
                    px: 3,
                    py: 1,
                    fontWeight: "bold",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "#000",
                    },
                  }}
                >
                  {buttonText[lang]}
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
