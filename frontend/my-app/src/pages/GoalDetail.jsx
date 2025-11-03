import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Paper,
  Stack,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import { BASE_API_URL } from "../config";
import backgroundImage from "../assets/iStock-Boonyachoat1.jpg";

export default function GoalDetail() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [pages, setPages] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [pagesRes, bannersRes] = await Promise.all([
          fetch(`${BASE_API_URL}/pages`),
          fetch(`${BASE_API_URL}/banners`),
        ]);

        const [pagesData, bannersData] = await Promise.all([
          pagesRes.json(),
          bannersRes.json(),
        ]);

        if (isMounted) {
          // 🔹 Faqat shu banner_id ga tegishli sahifalarni olish
          const filtered = Array.isArray(pagesData)
            ? pagesData.filter((item) => String(item.banner_id) === String(id))
            : [];

          // 🔹 Takrorlanishni oldini olish
          const uniquePages = filtered.filter(
            (v, i, a) => a.findIndex((t) => t.id === v.id) === i
          );

          setPages(uniquePages);
          setBanners(bannersData);
        }
      } catch (err) {
        console.error("❌ Ma’lumot olishda xato:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9faf9",
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f9faf9",
      }}
    >
      <Navbar />

      {/* 🏞️ Banner fon rasmi */}
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
          }}
        />
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

      {/* 📋 Ma’lumotlar */}
      <Container sx={{ my: 8 }}>
        {pages && pages.length > 0 ? (
          pages.map((page, index) => (
            <Paper
              key={page.id || index}
              elevation={4}
              // 🔹 bosilganda GoalList sahifasiga o‘tadi
              onClick={() => navigate(`/goal-list/${page.id}`)}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                bgcolor: "#f6fff8",
                maxWidth: "900px",
                mx: "auto",
                mb: 4,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 25px rgba(0,161,82,0.25)",
                  transform: "translateY(-5px)",
                },
              }}
            >
              {/* 🔹 Faqat Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#009f5d",
                  mb: 2,
                  wordBreak: "break-word",
                }}
              >
                {page[`title_${lang}`]
                  ? page[`title_${lang}`]
                      .replace(/<[^>]*>/g, "") // HTML teglardan tozalaydi
                      .replace(/&nbsp;/g, " ") // HTML probellarni olib tashlaydi
                      .trim()
                  : ""}
              </Typography>

              {/* 🔹 Faqat Banner Rasmlar */}
              {Array.isArray(page.banner_ids) && page.banner_ids.length > 0 && (
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={1.5}
                  sx={{ flexWrap: "wrap", mt: 1 }}
                >
                  {page.banner_ids.map((bannerId) => {
                    const banner = banners.find((b) => b.id === bannerId);
                    if (!banner) return null;

                    const imgSrc = banner[`image_${lang}`] || banner.image_uz;
                    return (
                      <Box
                        key={bannerId}
                        component="img"
                        src={`${BASE_API_URL.replace("/api", "")}${imgSrc}`}
                        alt={banner[`title_${lang}`]}
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 1.5,
                          objectFit: "cover",
                          transition: "0.3s",
                          "&:hover": { transform: "scale(1.08)" },
                        }}
                      />
                    );
                  })}
                </Stack>
              )}
            </Paper>
          ))
        ) : (
          <Typography align="center" sx={{ color: "#777", mt: 10 }}>
            ❌ Ma’lumot topilmadi
          </Typography>
        )}
      </Container>

      <Footer />
    </Box>
  );
}
