import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageIcon from "@mui/icons-material/Language";
import { useLanguage } from "../context/LanguageContext";
import { Link, useLocation, useNavigate } from "react-router-dom"; // 🟢 useNavigate qo‘shildi
import CustomContainer from "./CustomContainer";
import logo from "../assets/logo (3).png";
import { BASE_API_URL } from "../config";

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menus, setMenus] = useState([]);
  const { lang, setLang } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const navigate = useNavigate(); // 🟢 Navigatsiya uchun

  // 📜 Scroll holati
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Menyularni olish
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/menus`);
        const data = await res.json();
        setMenus(data);
      } catch (err) {
        console.error("❌ Menyularni olishda xato:", err);
      }
    };
    fetchMenus();
  }, []);

  // 🔹 Drawer boshqaruvi
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;
    setOpenDrawer(open);
  };

  // 🔹 Til menyusi boshqaruvi
  const handleLangClick = (event) => setAnchorEl(event.currentTarget);
  const handleLangClose = (langCode) => {
    if (langCode) setLang(langCode);
    setAnchorEl(null);
  };

  // 🏠 Asosiy sahifaga yo‘naltirish
  const goHome = () => navigate("/");

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 20,
          backgroundColor: scrolled
            ? "rgba(67, 137, 241, 0.97)"
            : "rgba(255, 255, 255, 0.15)",
          color: "white",
          backdropFilter: "blur(12px)",
          boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <CustomContainer>
          <Toolbar disableGutters sx={{ minHeight: 70 }}>
            {/* ✅ Logo (asosiy sahifaga olib boradi) */}
            <Box
              onClick={goHome}
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                flexGrow: 1,
                cursor: "pointer",
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="FTU Logo"
                sx={{
                  width: 140,
                  height: "auto",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
            </Box>

            {/* 🖥️ Desktop menyular */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {/* 🔹 Home tugmasi */}
              <Button
                onClick={goHome}
                sx={{
                  position: "relative",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "none",
                  letterSpacing: "0.4px",
                  px: 2,
                  py: 1,
                  "&:hover": { transform: "translateY(-1px)" },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: location.pathname === "/" ? "100%" : "0%",
                    height: "2px",
                    backgroundColor: "#ffffff",
                    transition: "width 0.3s ease",
                  },
                  "&:hover::after": { width: "100%" },
                }}
              >
                {lang === "uz" ? "Bosh sahifa" : lang === "ru" ? "Главная" : "Home"}
              </Button>

              {/* 🔹 Backenddan kelgan menyular */}
              {menus.map((menu) => {
                const active = location.pathname === `/page/${menu.id}`;
                return (
                  <Button
                    key={menu.id}
                    component={Link}
                    to={`/page/${menu.id}`}
                    sx={{
                      position: "relative",
                      color: "white",
                      fontWeight: 600,
                      textTransform: "none",
                      letterSpacing: "0.4px",
                      px: 2,
                      py: 1,
                      "&:hover": { transform: "translateY(-1px)" },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: active ? "100%" : "0%",
                        height: "2px",
                        backgroundColor: "#ffffff",
                        transition: "width 0.3s ease",
                      },
                      "&:hover::after": { width: "100%" },
                    }}
                  >
                    {menu[`title_${lang}`]}
                  </Button>
                );
              })}
            </Box>

            {/* 🌐 Til icon */}
            <IconButton
              onClick={handleLangClick}
              color="inherit"
              sx={{
                ml: 1,
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "50%",
                p: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  transform: "rotate(15deg)",
                },
              }}
            >
              <LanguageIcon />
            </IconButton>

            {/* 🌐 Til menyusi */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => handleLangClose()}
              disableScrollLock
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                sx: {
                  bgcolor: "#0d47a1",
                  color: "white",
                  borderRadius: 2,
                  mt: 1,
                  minWidth: 120,
                  boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
                },
              }}
            >
              {["uz", "ru", "en"].map((code) => (
                <MenuItem
                  key={code}
                  onClick={() => handleLangClose(code)}
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: lang === code ? "bold" : "normal",
                    color: lang === code ? "#ffeb3b" : "white",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                  }}
                >
                  {code.toUpperCase()}
                </MenuItem>
              ))}
            </Menu>

            {/* 📱 Mobil menyu tugmasi */}
            <IconButton
              edge="end"
              color="inherit"
              sx={{ display: { xs: "block", md: "none" }, ml: 1 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </CustomContainer>
      </AppBar>

      {/* 📱 Drawer menyu (mobil) */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 260,
            backgroundColor: "#0d47a1",
            color: "white",
          },
        }}
      >
        <Box
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {/* ✅ Drawer ichidagi logo (ham Home ga olib boradi) */}
          <Box
            sx={{
              textAlign: "center",
              py: 2,
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              cursor: "pointer",
            }}
            onClick={goHome}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ width: 100, mx: "auto" }}
            />
          </Box>

          <List>
            {/* Home tugmasi */}
            <ListItem disablePadding>
              <ListItemButton onClick={goHome} sx={{ textAlign: "center" }}>
                <ListItemText
                  primary={
                    lang === "uz"
                      ? "Bosh sahifa"
                      : lang === "ru"
                      ? "Главная"
                      : "Home"
                  }
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    letterSpacing: "0.5px",
                  }}
                />
              </ListItemButton>
            </ListItem>

            {/* Boshqa menyular */}
            {menus.map((menu) => (
              <ListItem key={menu.id} disablePadding>
                <ListItemButton
                  component={Link}
                  to={`/page/${menu.id}`}
                  sx={{
                    textAlign: "center",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <ListItemText
                    primary={menu[`title_${lang}`]}
                    primaryTypographyProps={{
                      fontWeight: "bold",
                      letterSpacing: "0.5px",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
