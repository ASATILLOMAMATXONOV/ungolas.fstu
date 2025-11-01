import React from "react";
import {
  Box,
  Typography,
  Link,
  TextField,
  IconButton,
  Container,
} from "@mui/material";
import {
  Facebook,
  YouTube,
  Telegram,
  Email,
  Phone,
  Room,
} from "@mui/icons-material";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/logo (3).png";

export default function Footer() {
  const { lang } = useLanguage();

  // 🌍 Matnlar 3 tilda
  const texts = {
    uz: {
      usefulLinks: "Foydali havolalar",
      home: "Bosh sahifa",
      fstu: "FSTU",
      contact: "Aloqa",
      emailTitle: "Elektron pochta",
      emailPlaceholder: "Email manzilingiz...",
      phone: "Telefon",
      address: "Manzil",
      addressText: "150107, Farg‘ona shahar, Farg‘ona ko‘chasi 86-uy",
      bottom: "Farg‘ona davlat texnika universiteti Raqamli ta’lim texnologiyalari markazi - 2025",
    },
    ru: {
      usefulLinks: "Полезные ссылки",
      home: "Главная страница",
      fstu: "ФГТУ",
      contact: "Контакты",
      emailTitle: "Электронная почта",
      emailPlaceholder: "Ваш email...",
      phone: "Телефон",
      address: "Адрес",
      addressText: "150107, г. Фергана, ул. Фергана, дом 86",
      bottom:
        "Центр цифровых образовательных технологий Ферганского государственного технического университета - 2025",
    },
    en: {
      usefulLinks: "Useful Links",
      home: "Home",
      fstu: "FSTU",
      contact: "Contact",
      emailTitle: "Email",
      emailPlaceholder: "Email address...",
      phone: "Phone",
      address: "Address",
      addressText: "86 Fergana Street, Fergana city, 150107",
      bottom:
        "Fergana State Technical University Digital Education Technologies Center - 2025",
    },
  };

  const t = texts[lang]; // faqat tanlangan tilni olamiz

  return (
    <Box
      sx={{
        py: 8,
        background: "linear-gradient(180deg, #7acb83 0%, #5e8f7a 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Diagonal fon qismi */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "60%",
          height: "100%",
          backgroundColor: "#5e8f7a",
          clipPath: "polygon(0 0, 80% 0, 0 100%)",
          zIndex: 1,
        }}
      />

      <Container sx={{ position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 6,
          }}
        >
          {/* ✅ Logo qismi */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
              gap: 2,
              flex: "1 1 250px",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="FSTU Logo"
              sx={{ width: 130, mb: 1 }}
            />
          </Box>

          {/* 🔗 Foydali havolalar */}
          <Box
            sx={{
              flex: "1 1 200px",
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                borderBottom: "2px solid rgba(255,255,255,0.5)",
                display: "inline-block",
              }}
            >
              {t.usefulLinks}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
              <Link href="/" color="inherit" underline="hover">
                {t.home}
              </Link>
              <Link href="https://fstu.uz" color="inherit" underline="hover">
                {t.fstu}
              </Link>
            </Box>
          </Box>

          {/* 📞 Aloqa */}
          <Box
            sx={{
              flex: "1 1 250px",
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                borderBottom: "2px solid rgba(255,255,255,0.5)",
                display: "inline-block",
              }}
            >
              {t.contact}
            </Typography>
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone sx={{ fontSize: 20 }} /> 8 (371) 223 12 33
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email sx={{ fontSize: 20 }} /> info@fstu.uz
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Room sx={{ fontSize: 20 }} /> {t.addressText}
              </Box>
            </Box>
          </Box>

          {/* 📧 Elektron pochta */}
          <Box
            sx={{
              flex: "1 1 250px",
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                borderBottom: "2px solid rgba(255,255,255,0.5)",
                display: "inline-block",
              }}
            >
              {t.emailTitle}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t.emailPlaceholder}
              InputProps={{
                endAdornment: <Email sx={{ color: "gray" }} />,
                sx: {
                  bgcolor: "white",
                  borderRadius: "8px",
                },
              }}
            />

            {/* Ijtimoiy tarmoqlar */}
            <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
              <IconButton
                sx={{
                  bgcolor: "white",
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
              >
                <Facebook sx={{ color: "#0d47a1" }} />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: "white",
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
              >
                <YouTube sx={{ color: "#c4302b" }} />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: "white",
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
              >
                <Telegram sx={{ color: "#0088cc" }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* 🔻 Pastki yozuv */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.4)",
            mt: 6,
            pt: 2,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontWeight: 500 }}>{t.bottom}</Typography>
        </Box>
      </Container>
    </Box>
  );
}
