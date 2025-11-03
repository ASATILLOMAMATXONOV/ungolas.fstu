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
import { motion } from "framer-motion";

export default function GoalDetail() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [pages, setPages] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Ma’lumotlarni olish
  useEffect(() => {
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

        // 🔹 Faqat shu banner_id ga tegishli sahifalar
        const filtered = Array.isArray(pagesData)
          ? pagesData.filter((item) => String(item.banner_id) === String(id))
          : [];

        setPages(filtered);
        setBanners(bannersData);
      } catch (err) {
        console.error("❌ Ma’lumot olishda xato:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* 🏞️ Banner orqa fon rasmi */}
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
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
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

      {/* 📄 Sahifa kontenti */}
      <Container sx={{ my: 8 }}>
        {pages && pages.length > 0 ? (
          pages.map((page, index) => (
            <Paper
              key={page.id || index}
              elevation={6}
              onClick={() => navigate(`/goal-list/${page.id}`)}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                bgcolor: "#f6fff8",
                maxWidth: "900px",
                mx: "auto",
                mb: 4,
                textAlign: "justify",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 25px rgba(0,161,82,0.25)",
                  transform: "translateY(-5px)",
                },
              }}
            >
              {/* 🔹 Sarlavha */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#009f5d",
                  mb: 2,
                  textAlign: "center",
                }}
              >
                {page[`title_${lang}`]}
              </Typography>

              {/* 🔹 Kontent — TinyMCE dan kelgan holatda to‘liq render */}
              <Box
                sx={{
                  color: "#333",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  mb: 2,
                  "& p": { mb: 1.5 },
                  "& img": {
                    maxWidth: "100%",
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                  "& a": {
                    color: "#009f5d",
                    textDecoration: "underline",
                    "&:hover": { color: "#006b40" },
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html: page[`content_${lang}`] || "",
                }}
              />

              {/* 🔹 Tegishli banner rasmlar */}
              {Array.isArray(page.banner_ids) && page.banner_ids.length > 0 && (
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={1.5}
                  sx={{ flexWrap: "wrap", mt: 3 }}
                >
                  {page.banner_ids.map((bannerId) => {
                    const banner = banners.find((b) => b.id === bannerId);
                    if (!banner) return null;

                    const imgSrc = banner[`image_${lang}`] || banner.image_uz;
                    return (
                      <motion.div
                        key={bannerId}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <Box
                          component="img"
                          src={`${BASE_API_URL.replace("/api", "")}${imgSrc}`}
                          alt={banner[`title_${lang}`]}
                          sx={{
                            width: 70,
                            height: 70,
                            borderRadius: 2,
                            objectFit: "cover",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </Stack>
              )}
            </Paper>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography
              align="center"
              sx={{
                color: "#777",
                mt: 10,
                fontSize: "20px",
                fontWeight: 500,
                fontStyle: "italic",
              }}
            >
              ❌ Ma’lumot to‘ldirilmoqda...
            </Typography>
          </motion.div>
        )}
      </Container>

      <Footer />
    </Box>
  );
}
