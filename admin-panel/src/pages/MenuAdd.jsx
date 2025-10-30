import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../config";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
} from "@mui/material";

const MenuAdd = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title_uz: "",
    title_ru: "",
    title_en: "",

  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };



  console.log("Yuborilayotgan form:", form);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_API_URL}/menus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        navigate("/menus");
      } else {
        alert("❌ Saqlashda xato");
      }
    } catch (err) {
      console.error("❌ Server xatosi:", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6, borderRadius: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          textAlign="center"
          fontWeight="bold"
          color="primary"
          gutterBottom
        >
          ➕ Yangi Menu Qo‘shish
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Menu nomi (UZ)"
            name="title_uz"
            value={form.title_uz}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Menu nomi (RU)"
            name="title_ru"
            value={form.title_ru}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Menu nomi (EN)"
            name="title_en"
            value={form.title_en}
            onChange={handleChange}
            margin="normal"
          />

      

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 3, py: 1.2, fontWeight: "bold", borderRadius: 2 }}
          >
            Saqlash
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default MenuAdd;
