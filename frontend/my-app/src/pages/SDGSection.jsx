import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import sdgLogo from "../assets/123124124.jpg";

export default function SDGSection() {
  const { lang } = useLanguage();

  // 🌍 3 tildagi matnlar
  const texts = {
    uz: {
      title: "Barqaror Rivojlanish Maqsadlari nashr qilingan!",
      downloadUz: "📥 Yuklash O‘zbek tilida",
      downloadRu: "📥 Yuklash Rus tilida",
    },
    ru: {
      title: "Опубликованы Цели устойчивого развития!",
      downloadUz: "📥 Скачать на узбекском",
      downloadRu: "📥 Скачать на русском",
    },
    en: {
      title: "The Sustainable Development Goals have been published!",
      downloadUz: "📥 Download in Uzbek",
      downloadRu: "📥 Download in Russian",
    },
  };

  const t = texts[lang]; // tanlangan til bo‘yicha

  return (
    <Box
      sx={{
        py: 10,
        background: "linear-gradient(180deg, #ffffff 0%, #f2f4f3 100%)",
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        {/* ✅ Chap tomonda matn (chapdan chiqib keladi) */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          style={{ flex: "1 1 400px", textAlign: "left" }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#2c3e50",
              mb: 3,
              lineHeight: 1.3,
            }}
          >
            {t.title}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              href="https://drive.google.com/file/d/1vk6bi5bGuMprU22gCF2i2MzTthWHz5OZ/view?usp=sharing"
              target="_blank"
              sx={{
                backgroundColor: "#1abc9c",
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
                px: 3,
                py: 1.2,
                "&:hover": { backgroundColor: "#16a085" },
              }}
            >
              {t.downloadUz}
            </Button>

            <Button
              variant="contained"
              href="https://drive.google.com/file/d/1hJt4nrCZJ-I3441mEBvxY4bkEJB0i_5V/view?usp=sharing"
              target="_blank"
              sx={{
                backgroundColor: "#5d6679",
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
                px: 3,
                py: 1.2,
                "&:hover": { backgroundColor: "#4a5568" },
              }}
            >
              {t.downloadRu}
            </Button>
          </Box>
        </motion.div>

        {/* 🌍 O‘ng tomonda tebranuvchi va o‘ngdan kiruvchi rasm */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
          style={{
            flex: "1 1 300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <motion.img
            src={sdgLogo}
            alt="Sustainable Development Goals"
            style={{
              width: "380px",
              height: "auto",
            }}
            animate={{
              y: [0, -15, 0, 15, 0],
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </motion.div>
      </Container>
    </Box>
  );
}
