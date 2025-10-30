import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import bgVideo from "../assets/video/1.mp4"; // 🎥 o'z video faylingiz

export default function Home() {
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
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(255, 255, 255, 1) 100%)",
          zIndex: -1,
        }}
      />

      {/* 🪄 Animatsiyali matn qismi */}
      <Box sx={{ px: 2, maxWidth: "1000px" }}>
        {/* 🔹 Katta sarlavha */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontSize:"50px",
              fontWeight: "500",
              color: "#020202ff",
              // textShadow: "0px 3px 8px rgba(0,0,0,0.5)",
            }}
          >
            17 Sustainable Development Goals aimed at changing the world
          </Typography>
        </motion.div>

        {/* 🔹 Paragraf matn */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5, // sarlavhadan keyin chiqadi
            duration: 1,
            ease: "easeOut",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "18px",
              fontWeight: "500",
              lineHeight: 1.8,
              maxWidth: "800px",
              mx: "auto",
              color: "#000000ff",
              // textShadow: "0px 2px 6px rgba(0,0,0,0.4)",
            }}
          >
            The Sustainable Development Goals, also known as the Global Goals,
            are universal measures aimed at eradicating poverty, protecting the
            planet, and bringing peace and prosperity to all people. The goals
            were endorsed in September 2015 by all UN member states, including
            Uzbekistan. They include 17 goals and 169 targets that must be
            achieved by 2030.
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
}
