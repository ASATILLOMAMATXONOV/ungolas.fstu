// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Container,
//   Paper,
// } from "@mui/material";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { useLanguage } from "../context/LanguageContext";
// import { BASE_API_URL, BASE_URL } from "../config";
// import backgroundImage from "../assets/iStock-Boonyachoat1.jpg";

// export default function GoalDetail() {
//   const { id } = useParams();
//   const { lang } = useLanguage();
//   const [page, setPage] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPage = async () => {
//       try {
//         const res = await fetch(`${BASE_API_URL}/pages?banner_id=${id}`);
//         const data = await res.json();
//         if (Array.isArray(data)) setPage(data[0]);
//         else setPage(data);
//       } catch (err) {
//         console.error("❌ Ma’lumot olishda xato:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPage();
//   }, [id]);

//   if (loading)
//     return (
//       <Box
//         sx={{
//           height: "80vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           background: "#000",
//         }}
//       >
//         <CircularProgress color="success" />
//       </Box>
//     );

//   if (!page)
//     return (
//       <Typography align="center" sx={{ color: "white", mt: 10 }}>
//         ❌ Ma’lumot topilmadi (banner_id: {id})
//       </Typography>
//     );

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         minHeight: "100vh",
//         backgroundColor: "#f9faf9",
//       }}
//     >
//       <Navbar />

//       {/* 🏞️ Banner rasmi */}
//       <Box
//         sx={{
//           position: "relative",
//           height: { xs: "50vh", md: "65vh" },
//           overflow: "hidden",
//         }}
//       >
//         {/* 🖼️ Animatsiyali rasm */}
//         <Box
//           component="img"
//           src={backgroundImage}
//           alt={page[`title_${lang}`]}
//           sx={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             display: "block",
//             transform: "scale(1)",
//             transition: "transform 6s ease",
//             "&:hover": {
//               transform: "scale(1.08)",
//             },
//           }}
//         />

//         {/* 🌈 Gradient qoplama */}
//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background: `
//               linear-gradient(
//                 180deg,
//                 rgba(0, 0, 0, 0.5) 0%,
//                 rgba(0, 0, 0, 0.3) 40%,
//                 rgba(0, 0, 0, 0.7) 100%
//               )
//             `,
//           }}
//         />

//         {/* 📘 Banner sarlavha */}
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: "20%",
//             left: "50%",
//             transform: "translateX(-50%)",
//             color: "white",
//             textAlign: "center",
//             zIndex: 2,
//             px: 2,
//           }}
//         >
//           <Typography
//             variant="h3"
//             sx={{
//               fontWeight: 700,
//               textShadow: "0 3px 10px rgba(0,0,0,0.6)",
//             }}
//           >
//             {page[`title_${lang}`]}
//           </Typography>
//         </Box>
//       </Box>

//       {/* 📄 Ma’lumot (banner ostida) */}
//       <Container sx={{ my: 6 }}>
//         <Paper
//           elevation={4}
//           sx={{
//             p: { xs: 3, md: 5 },
//             borderRadius: 3,
//             bgcolor: "white",
//             maxWidth: "1000px",
//             mx: "auto",
//             overflow: "hidden",
//           }}
//         >
//           {/* 🔹 Title */}
//           <Typography
//             variant="h4"
//             sx={{
//               fontWeight: 700,
//               mb: 3,
//               color: "#1a4d2e",
//               textAlign: "center",
//             }}
//           >
//             {page[`title_${lang}`]}
//           </Typography>

//           {/* 🔹 Content (HTML original ko‘rinishda chiqadi) */}
//           <Box
//             sx={{
//               color: "#333",
//               lineHeight: 1.8,
//               fontSize: "18px",
//               "& table": {
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 marginY: 3,
//               },
//               "& th, & td": {
//                 border: "1px solid #ccc",
//                 padding: "10px 15px",
//                 textAlign: "left",
//                 transition: "all 0.3s ease",
//               },
//               "& tr:hover": {
//                 backgroundColor: "rgba(0, 128, 0, 0.08)",
//               },
//               "& th": {
//                 backgroundColor: "#f0f4f0",
//                 fontWeight: "bold",
//               },
//               "& img": {
//                 maxWidth: "100%",
//                 borderRadius: "10px",
//                 display: "block",
//                 marginY: "20px",
//               },
//               "& p": {
//                 marginBottom: "16px",
//               },
//               "& h2, & h3": {
//                 marginTop: "24px",
//                 marginBottom: "12px",
//                 color: "#1a4d2e",
//               },
//             }}
//             dangerouslySetInnerHTML={{
//               __html:
//                 page[`content_${lang}`] ||
//                 "<p>📄 Ma’lumot topilmadi</p>",
//             }}
//           />
//         </Paper>
//       </Container>

//       {/* ⚪ Footer */}
//       <Box sx={{ flexShrink: 0, mt: "auto" }}>
//         <Footer />
//       </Box>
//     </Box>
//   );
// }
