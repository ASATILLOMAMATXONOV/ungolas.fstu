import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageIcon from "@mui/icons-material/Language";
import { Link, useLocation, useNavigate } from "react-router-dom";

import CustomContainer from "./CustomContainer";
import logo from "../assets/logo (3).png";
import { BASE_API_URL } from "../config";
import { useLanguage } from "../context/LanguageContext";

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menus, setMenus] = useState([]);
  const [submenus, setSubmenus] = useState([]);
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const { lang } = useLanguage(); // ✅ always "en"

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const location = useLocation();
  const navigate = useNavigate();

  /** ✅ Scroll effect */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /** ✅ Menus from backend */
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const [menuRes, subRes] = await Promise.all([
          fetch(`${BASE_API_URL}/menus`),
          fetch(`${BASE_API_URL}/submenus`),
        ]);

        setMenus(await menuRes.json());
        setSubmenus(await subRes.json());
      } catch (err) {
        console.error("❌ Menyu olishda xatolik:", err);
      }
    };
    fetchMenus();
  }, []);

  /** ✅ Mobile drawer control */
  const toggleDrawer = (open) => () => setOpenDrawer(open);

  /** ✅ Submenus */
  const getSubmenusByMenuId = (menuId) =>
    submenus.filter((sm) => sm.menu_id === menuId);

  /** ✅ Language dropdown icon */
  const handleLangClick = (event) => setAnchorEl(event.currentTarget);
  const handleLangClose = () => setAnchorEl(null);

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
          transition: "all 0.3s ease-in-out",
        }}
      >
        <CustomContainer>
          <Toolbar disableGutters sx={{ minHeight: 70 }}>
            {/* ✅ LOGO */}
            <Box
              onClick={() => navigate("/")}
              sx={{
                display: "flex",
                alignItems: "center",
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

            {/* ✅ Desktop menus */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, position: "relative" }}>
              <Button sx={{ color: "white", fontWeight: 600 }} onClick={() => navigate("/")}>
                Home
              </Button>

              {menus.map((menu) => {
                const subList = getSubmenusByMenuId(menu.id);
                const hasSubmenu = subList.length > 0;

                return (
                  <Box
                    key={menu.id}
                    sx={{ position: "relative" }}
                    onMouseEnter={() => setHoveredMenu(menu.id)}
                    onMouseLeave={() => setHoveredMenu(null)}
                  >
                    <Button
                      onClick={() => !hasSubmenu && navigate(`/menu/${menu.id}`)}
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        textTransform: "none",
                      }}
                    >
                      {menu.title_en}
                    </Button>

                    {hasSubmenu && hoveredMenu === menu.id && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          backgroundColor: "rgba(13, 71, 161, 0.95)",
                          minWidth: 180,
                          borderRadius: "0 0 8px 8px",
                          zIndex: 1000,
                        }}
                      >
                        {subList.map((sub) => (
                          <MenuItem
                            key={sub.id}
                            onClick={() => navigate(`/submenu/${sub.id}`)}
                            sx={{ color: "white" }}
                          >
                            {sub.title_en}
                          </MenuItem>
                        ))}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* ✅ LANGUAGE ICON (FAKAT EN) */}
            <IconButton color="inherit" sx={{ ml: 1 }} onClick={handleLangClick}>
              <LanguageIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleLangClose}
              PaperProps={{
                sx: {
                  bgcolor: "#0d47a1",
                  color: "white",
                  borderRadius: 2,
                  mt: 1,
                },
              }}
            >
              <MenuItem sx={{ fontWeight: 700, color: "#ffeb3b" }}>EN</MenuItem>
            </Menu>

            {/* ✅ MOBILE MENU */}
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

      {/* ✅ Drawer (Mobile Menu) */}
      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 260, bgcolor: "#0d47a1", height: "100%", color: "white" }}>
          <List>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemText primary="Home" />
            </ListItemButton>

            {menus.map((menu) => (
              <ListItemButton key={menu.id} onClick={() => navigate(`/menu/${menu.id}`)}>
                <ListItemText primary={menu.title_en} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;



// import React, { useState, useEffect } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Button,
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import LanguageIcon from "@mui/icons-material/Language";
// import { useLanguage } from "../context/LanguageContext";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import CustomContainer from "./CustomContainer";
// import logo from "../assets/logo (3).png";
// import { BASE_API_URL } from "../config";

// const Navbar = () => {
//   const [openDrawer, setOpenDrawer] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [menus, setMenus] = useState([]);
//   const [submenus, setSubmenus] = useState([]);
//   const { lang, setLang } = useLanguage();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [hoveredMenu, setHoveredMenu] = useState(null); // 🟩 Hover qilingan menu
//   const open = Boolean(anchorEl);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // 📜 Scroll holati
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // 🔹 Menyularni olish
//   useEffect(() => {
//     const fetchMenus = async () => {
//       try {
//         const [menuRes, subRes] = await Promise.all([
//           fetch(`${BASE_API_URL}/menus`),
//           fetch(`${BASE_API_URL}/submenus`),
//         ]);
//         const menuData = await menuRes.json();
//         const subData = await subRes.json();
//         setMenus(menuData);
//         setSubmenus(subData);
//       } catch (err) {
//         console.error("❌ Menyu/Submenyu olishda xato:", err);
//       }
//     };
//     fetchMenus();
//   }, []);

//   // 🔹 Drawer boshqaruvi
//   const toggleDrawer = (open) => (event) => {
//     if (
//       event.type === "keydown" &&
//       (event.key === "Tab" || event.key === "Shift")
//     )
//       return;
//     setOpenDrawer(open);
//   };

//   // 🌐 Til menyusi
//   const handleLangClick = (event) => setAnchorEl(event.currentTarget);
//   const handleLangClose = (langCode) => {
//     if (langCode) setLang(langCode);
//     setAnchorEl(null);
//   };

//   // 🏠 Home
//   const goHome = () => navigate("/");

//   // 🔹 Submenu olish (menu.id bo‘yicha)
//   const getSubmenusByMenuId = (menuId) =>
//     submenus.filter((sm) => sm.menu_id === menuId);

//   return (
//     <>
//       <AppBar
//         position="fixed"
//         elevation={0}
//         sx={{
//           zIndex: (theme) => theme.zIndex.modal + 20,
//           backgroundColor: scrolled
//             ? "rgba(67, 137, 241, 0.97)"
//             : "rgba(255, 255, 255, 0.15)",
//           color: "white",
//           backdropFilter: "blur(12px)",
//           transition: "all 0.3s ease-in-out",
//         }}
//       >
//         <CustomContainer>
//           <Toolbar disableGutters sx={{ minHeight: 70 }}>
//             {/* ✅ Logo */}
//             <Box
//               onClick={goHome}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 flexGrow: 1,
//                 cursor: "pointer",
//               }}
//             >
//               <Box
//                 component="img"
//                 src={logo}
//                 alt="FTU Logo"
//                 sx={{
//                   width: 140,
//                   height: "auto",
//                   transition: "transform 0.3s ease",
//                   "&:hover": { transform: "scale(1.05)" },
//                 }}
//               />
//             </Box>

//             {/* 🖥️ Desktop menyu */}
//             <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, position: "relative" }}>
//               {/* 🔹 Home */}
//               <Button
//                 onClick={goHome}
//                 sx={{
//                   color: "white",
//                   fontWeight: 600,
//                   textTransform: "none",
//                   "&:hover": { transform: "translateY(-1px)" },
//                 }}
//               >
//                 {lang === "uz" ? "Bosh sahifa" : lang === "ru" ? "Главная" : "Home"}
//               </Button>

//               {/* 🔹 Backenddan kelgan menyular */}
//               {menus.map((menu) => {
//                 const subList = getSubmenusByMenuId(menu.id);
//                 const hasSubmenu = subList.length > 0;
//                 const active = location.pathname === `/page/${menu.id}`;
//                 return (
//                   <Box
//                     key={menu.id}
//                     sx={{ position: "relative" }}
//                     onMouseEnter={() => setHoveredMenu(menu.id)}
//                     onMouseLeave={() => setHoveredMenu(null)}
//                   >
//                  <Button
//   onClick={() => {
//     if (!hasSubmenu) navigate(`/menu/${menu.id}`);
//   }}
//   sx={{
//     color: "white",
//     fontWeight: 600,
//     textTransform: "none",
//     position: "relative",
//     cursor: hasSubmenu ? "default" : "pointer",
//     "&::after": {
//       content: '""',
//       position: "absolute",
//       bottom: 0,
//       left: 0,
//       width: active ? "100%" : "0%",
//       height: "2px",
//       backgroundColor: "#fff",
//       transition: "width 0.3s",
//     },
//     "&:hover::after": { width: "100%" },
//   }}
// >
//   {menu[`title_${lang}`]}
// </Button>


//                     {/* 🔽 Submenu chiqishi (hoverda) */}
//                     {hasSubmenu && hoveredMenu === menu.id && (
//                       <Box
//                         sx={{
//                           position: "absolute",
//                           top: "100%",
//                           left: 0,
//                           backgroundColor: "rgba(13, 71, 161, 0.95)",
//                           borderRadius: "0 0 8px 8px",
//                           boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
//                           minWidth: 180,
//                           animation: "fadeIn 0.3s ease",
//                           zIndex: 1000,
//                         }}
//                       >
//                         {subList.map((sub) => (
//                           <MenuItem
//                             key={sub.id}
//                             onClick={() => navigate(`/submenu/${sub.id}`)}
//                             sx={{
//                               color: "white",
//                               fontSize: "0.95rem",
//                               fontWeight: 500,
//                               px: 2,
//                               py: 1,
//                               "&:hover": {
//                                 backgroundColor: "rgba(255,255,255,0.15)",
//                               },
//                             }}
//                           >
//                             {sub[`title_${lang}`]}
//                           </MenuItem>
//                         ))}
//                       </Box>
//                     )}
//                   </Box>
//                 );
//               })}
//             </Box>

//             {/* 🌐 Til tanlash */}
//             <IconButton onClick={handleLangClick} color="inherit" sx={{ ml: 1 }}>
//               <LanguageIcon />
//             </IconButton>

//             <Menu
//               anchorEl={anchorEl}
//               open={open}
//               onClose={() => handleLangClose()}
//               disableScrollLock
//               anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//               transformOrigin={{ vertical: "top", horizontal: "right" }}
//               PaperProps={{
//                 sx: {
//                   bgcolor: "#0d47a1",
//                   color: "white",
//                   borderRadius: 2,
//                   mt: 1,
//                 },
//               }}
//             >
//               {["uz", "ru", "en"].map((code) => (
//                 <MenuItem
//                   key={code}
//                   onClick={() => handleLangClose(code)}
//                   sx={{
//                     textTransform: "uppercase",
//                     color: lang === code ? "#ffeb3b" : "white",
//                   }}
//                 >
//                   {code.toUpperCase()}
//                 </MenuItem>
//               ))}
//             </Menu>

//             {/* 📱 Mobil menyu tugmasi */}
//             <IconButton
//               edge="end"
//               color="inherit"
//               sx={{ display: { xs: "block", md: "none" }, ml: 1 }}
//               onClick={toggleDrawer(true)}
//             >
//               <MenuIcon />
//             </IconButton>
//           </Toolbar>
//         </CustomContainer>
//       </AppBar>
//     </>
//   );
// };

// export default Navbar;

