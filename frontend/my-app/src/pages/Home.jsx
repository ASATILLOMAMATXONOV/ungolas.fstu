import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";
import bgVideo from "../assets/video/1.mp4";
import { BASE_API_URL } from "../config";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage(); // 🌐 kontekstdan tilni olish

  // 🔹 HomeTitle ma’lumotini olish
  useEffect(() => {
    const fetchHomeTitle = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/home-titles/latest`);
        if (!res.ok) throw new Error("Serverdan xato javob keldi");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("❌ HomeTitle olishda xato:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeTitle();
  }, []); // faqat bir marta yuklanadi

  // 🌐 Til o‘zgarganda kontentni yangilash
  useEffect(() => {
    if (!data) return;
    // Faqat rerender bo‘ladi, yangi fetch shart emas
  }, [lang]);

  if (loading)
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
        height: "80vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#000",
        textAlign: "center",
      }}
    >
      {/* 🎬 Video background */}
      <Box
        component="video"
        src={bgVideo}
        autoPlay
        muted
        loop
        playsInline
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
        }}
      />

      {/* 🌫️ Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(255,255,255,1) 100%)",
          zIndex: -1,
        }}
      />

      {/* 🪄 Animatsiyali matn */}
      <Box sx={{ px: 2, maxWidth: "1000px" }}>
        {/* 🔹 Sarlavha */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontSize: { xs: "30px", md: "50px" },
              fontWeight: 600,
              color: "#020202",
            }}
          >
            {data?.[`title_${lang}`] || "No title"}
          </Typography>
        </motion.div>

        {/* 🔹 Kontent (desc_*) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 1,
            ease: "easeOut",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "18px",
              fontWeight: "400",
              lineHeight: 1.8,
              maxWidth: "800px",
              mx: "auto",
              color: "#000",
            }}
            component="div"
            dangerouslySetInnerHTML={{
              __html: data?.[`desc_${lang}`] || "",
            }}
          />
        </motion.div>
      </Box>
    </Box>
  );
}
