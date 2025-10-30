import React, { useState, useEffect } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { motion } from "framer-motion";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  // 🔹 Skroll kuzatuvchi
  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Tepaga chiqish funksiyasi
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    show && (
      <Tooltip title="Yuqoriga chiqish" placement="left">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
        >
          <Box
            sx={{
              position: "fixed",
              bottom: 25,
              right: 25,
              zIndex: 1000,
            }}
          >
            <IconButton
              onClick={scrollToTop}
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#0d47a1",
                color: "white",
                "&:hover": {
                  bgcolor: "#1565c0",
                },
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                borderRadius: "10px",
              }}
            >
              <KeyboardArrowUpIcon fontSize="large" />
            </IconButton>
          </Box>
        </motion.div>
      </Tooltip>
    )
  );
}
