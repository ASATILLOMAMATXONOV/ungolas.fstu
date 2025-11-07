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
import { BASE_API_URL } from "../config";
import { motion } from "framer-motion";
import backgroundImage from "../assets/iStock-Boonyachoat1.jpg";

const NewPageView = () => {
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPage = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/new-pages/${id}`);
      if (!res.ok) throw new Error("Sahifa topilmadi");
      const data = await res.json();
      setPage(data);
    } catch (err) {
      console.error("❌ Sahifani olishda xato:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [id]);

  return (
    <>
      <Navbar />

      {/* ✅ Banner qismi */}
      <Box
        sx={{
          position: "relative",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: { xs: "220px", md: "350px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
          }}
        />
        {/* Title */}
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            position: "relative",
            zIndex: 2,
            textShadow: "0 3px 8px rgba(0,0,0,0.6)",
          }}
        >
          {page?.title_uz || "SDG Maqsadlari"}
        </Typography>
      </Box>

      {/* ✅ Kontent */}
      <Container sx={{ py: 6, minHeight: "50vh" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : !page ? (
          <Typography
            variant="h6"
            color="error"
            textAlign="center"
            mt={5}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
          >
            ❌ Ma’lumot topilmadi
          </Typography>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.1rem",
                  color: "#333",
                  lineHeight: 1.8,
                }}
                dangerouslySetInnerHTML={{
                  __html: page.content_uz || "<i>Ma’lumot mavjud emas</i>",
                }}
              />
            </Paper>
          </motion.div>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default NewPageView;
