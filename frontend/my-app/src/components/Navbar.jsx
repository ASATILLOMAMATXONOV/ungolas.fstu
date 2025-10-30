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
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import CustomContainer from "./CustomContainer";
import logo from "../assets/logo (3).png";

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 📜 Scroll paytida backgroundni o‘zgartirish
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { text: "Home", path: "/" },
    { text: "Documents", path: "/documents" },
    { text: "Report", path: "/report" },
    { text: "Languages", path: "/languages" },
  ];

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;
    setOpenDrawer(open);
  };

  return (
    <>
      {/* 🧊 Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: scrolled
            ? "rgba(67, 137, 241, 0.95)" // scroll bo‘lganda to‘liq ko‘k
            : "rgba(255, 255, 255, 0.1)", // scroll bo‘lmaganda shaffof
          color: scrolled ? "white" : "white",
          backdropFilter: "blur(12px)",
          boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <CustomContainer>
          <Toolbar disableGutters sx={{ minHeight: 70 }}>
            {/* ✅ Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                flexGrow: 1,
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

            {/* 🖥️ Desktop menyu */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.text}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: "white",
                    fontWeight: "600",
                    textTransform: "none",
                    letterSpacing: "0.5px",
                    "&:hover": {
                      color: "#ffeb3b",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {link.text}
                </Button>
              ))}
            </Box>

            {/* 📱 Mobile menyu tugmasi */}
            <IconButton
              edge="end"
              color="inherit"
              sx={{ display: { xs: "block", md: "none" } }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </CustomContainer>
      </AppBar>

      {/* 📱 Drawer menyu (mobil versiya) */}
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
          <Box
            sx={{
              textAlign: "center",
              py: 2,
              borderBottom: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ width: 100, mx: "auto" }}
            />
          </Box>

          <List>
            {navLinks.map((link) => (
              <ListItem key={link.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.path}
                  sx={{
                    textAlign: "center",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <ListItemText
                    primary={link.text}
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
