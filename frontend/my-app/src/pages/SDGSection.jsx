import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import sdgLogo from "../assets/123124124.jpg"; // 📘 O‘zingizdagi rasm

export default function SDGSection() {
  return (
    <Box
      sx={{
        py: 10,
        background: "linear-gradient(180deg, #ffffffff 0%, #f2f4f3 100%)",
        overflow: "hidden", // ✨ chiqib ketgan animatsiyani yashirish
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
          initial={{ opacity: 0, x: -100 }} // ✨ chapdan
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
            Barqaror Rivojlanish Maqsadlari nashr qilingan!
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
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
              📥 Yuklash O‘zbek tilida
            </Button>

            <Button
              variant="contained"
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
              📥 Yuklash Rus tilida
            </Button>
          </Box>
        </motion.div>

        {/* 🌍 O‘ng tomonda tebranuvchi va o‘ngdan kiruvchi rasm */}
        <motion.div
          initial={{ opacity: 0, x: 100 }} // ✨ o‘ngdan chiqadi
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
              y: [0, -15, 0, 15, 0], // 🔼🔽 tebranish animatsiyasi
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
