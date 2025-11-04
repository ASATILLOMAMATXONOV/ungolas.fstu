import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Fade,
} from "@mui/material";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { BASE_API_URL } from "../config";
import backgroundImage from "../assets/iStock-Boonyachoat1.jpg"; // 🟢 Fon rasmi
import Footer from "./Footer";

export default function SubmenuDetail() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const [submenu, setSubmenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmenu = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/submenus/${id}`);
        const data = await res.json();
        setSubmenu(data);
      } catch (err) {
        console.error("❌ Xato:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmenu();
  }, [id]);

  if (loading)
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f5f8f7",
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );

  if (!submenu)
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <Typography color="text.secondary" variant="h6">
          ❌ Ma’lumot topilmadi
        </Typography>
      </Container>
    );

  return (
    <>
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* 🏞️ Banner qismi */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "35vh", md: "50vh" },
          overflow: "hidden",
        }}
      >
        {/* Fon rasmi */}
        <Box
          component="img"
          src={backgroundImage}
          alt="Banner"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.6)",
            transform: "scale(1.05)",
          }}
        />

        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgb(90 251 61 / 11%) 100%)",
          }}
        />

        {/* 🟢 Title animatsiya bilan */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: "absolute",
            bottom: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            color: "#fff",
            maxWidth: "90%",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              textShadow: "0 3px 8px rgba(0,0,0,0.6)",
            }}
          >
            {submenu[`title_${lang}`]}
          </Typography>
        </motion.div>
      </Box>

      {/* 📖 Kontent qismi */}
      <Fade in timeout={1000}>
        <Container
          sx={{
            my: 8,
            maxWidth: "900px",
            p: { xs: 2, md: 4 },
            bgcolor: "#ffffff",
            borderRadius: 3,
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Box
              sx={{
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "#333",
                "& p": { mb: 2 },
                "& ul": { pl: 3, mb: 2 },
                "& li": { mb: 1 },
                "& img": {
                  maxWidth: "100%",
                  borderRadius: 2,
                  my: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.03)" },
                },
                "& a": {
                  color: "#008b4f",
                  textDecoration: "underline",
                  "&:hover": { color: "#005c34" },
                },
              }}
              dangerouslySetInnerHTML={{
                __html:
                  submenu[`content_${lang}`] || "<p>No content available.</p>",
              }}
            />
          </motion.div>
        </Container>
      </Fade>
    </Box>

    <Footer />
    </>
  );
}
