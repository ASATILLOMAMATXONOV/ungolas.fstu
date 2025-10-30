import React from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import backgroundImage from "../assets/iStock-Boonyachoat1.jpg"; // ✅ fon rasmi import
// ^ Bu eng muhim qadam — endi rasm to‘g‘ri yuklanadi

const goals = [
  { id: 1, image: new URL("../assets/goals-eng/goal1.png", import.meta.url).href },
  { id: 2, image: new URL("../assets/goals-eng/goal2.png", import.meta.url).href },
  { id: 3, image: new URL("../assets/goals-eng/goal3.png", import.meta.url).href },
  { id: 4, image: new URL("../assets/goals-eng/goal4.png", import.meta.url).href },
  { id: 5, image: new URL("../assets/goals-eng/goal5.png", import.meta.url).href },
  { id: 6, image: new URL("../assets/goals-eng/goal6.png", import.meta.url).href },
  { id: 7, image: new URL("../assets/goals-eng/goal7.png", import.meta.url).href },
  { id: 8, image: new URL("../assets/goals-eng/goal8.png", import.meta.url).href },
  { id: 9, image: new URL("../assets/goals-eng/goal9.png", import.meta.url).href },
  { id: 10, image: new URL("../assets/goals-eng/goal10.png", import.meta.url).href },
  { id: 11, image: new URL("../assets/goals-eng/goal11.png", import.meta.url).href },
  { id: 12, image: new URL("../assets/goals-eng/goal12.png", import.meta.url).href },
  { id: 13, image: new URL("../assets/goals-eng/goal13.png", import.meta.url).href },
  { id: 14, image: new URL("../assets/goals-eng/goal14.png", import.meta.url).href },
  { id: 15, image: new URL("../assets/goals-eng/goal15.png", import.meta.url).href },
  { id: 16, image: new URL("../assets/goals-eng/goal16.png", import.meta.url).href },
  { id: 17, image: new URL("../assets/goals-eng/goal17.png", import.meta.url).href },
];

export default function GoalsSection() {
  return (
    <Box
      sx={{
        position: "relative",
        py: 10,
        px: 2,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // backgroundAttachment: "fixed",
        "&::before": {
          // 🧊 Gradient overlay qo'shish
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `
            linear-gradient(0deg, hsla(0, 0%, 100%, 0.00) 29.9%,   rgba(255, 255, 255, 1)),
            linear-gradient(180deg, hsla(0, 8%, 95%, 0.00) 29.9%,   rgba(255, 255, 255, 1))
          `,
          zIndex: 0,
        },
      }}
    >

            {/* 🟢 Sarlavha qismi */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          mb: 6,
          textAlign: "center",
        }}
      >
        {/* 🔹 Yashil romb */}
        <Box
          sx={{
            width: 12,
            height: 12,
            backgroundColor: "#1abc9c",
            transform: "rotate(45deg)",
            margin: "0 auto 16px auto",
          }}
        />

        {/* 🔹 Kichik matn */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#0d47a1", // moviy matn
            fontSize: "1rem",
            mb: 1,
          }}
        >
          Ushbu tashabbus orqali biz qo'llab-quvvatlayotgan
        </Typography>

        {/* 🔹 Katta sarlavha */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#1abc9c", // yashil sarlavha
            fontSize: "2rem",
          }}
        >
          Maqsadlar
        </Typography>
      </Box>

      
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
        sx={{ maxWidth: 1200 }}
      >
        {goals.map((goal) => (
          <Grid
            item
            key={goal.id}
            xs={12}
            sm={6}
            md={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                height: 250,
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                },
                "&:hover .overlay": {
                  opacity: 1,
                  transform: "scale(1)",
                },
                "&:hover img": {
                  transform: "scale(1.05)",
                  filter: "brightness(0.7)",
                },
              }}
            >
              {/* 📸 Rasm */}
              <Box
                component="img"
                src={goal.image}
                alt={`Goal ${goal.id}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "all 0.4s ease",
                }}
              />

              {/* ✨ Hover overlay */}
              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0, 0, 0, 0.55)",
                  color: "white",
                  opacity: 0,
                  transform: "scale(1.2)",
                  transition: "all 0.4s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    borderRadius: 5,
                    px: 3,
                    py: 1,
                    fontWeight: "bold",
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "#000",
                    },
                  }}
                >
                  Kirish
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
