import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../config";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { CKEditor } from "ckeditor4-react";

const MenuForm = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]); // SQL-dagi asosiy menyular
  const [form, setForm] = useState({
    parent_id: "",
    title_uz: "",
    title_ru: "",
    title_en: "",
    content_uz: "",
    content_ru: "",
    content_en: "",
  });

  // 📌 Backenddan asosiy menularni olish
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/menuform/list`);
        const data = await res.json();
        setMenus(data);
      } catch (err) {
        console.error("❌ Menyularni olishda xato:", err);
      }
    };
    fetchMenus();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (name, evt) => {
    setForm((prev) => ({ ...prev, [name]: evt.editor.getData() }));
  };

  // 📌 Yangi submenu yuborish
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_API_URL}/menuform/item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        // ✅ Formani tozalash
        setForm({
          parent_id: "",
          title_uz: "",
          title_ru: "",
          title_en: "",
          content_uz: "",
          content_ru: "",
          content_en: "",
        });
        navigate("/menus");
      } else {
        alert("❌ Saqlashda xato");
      }
    } catch (err) {
      console.error("❌ Server xatosi:", err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 6, borderRadius: 3 }}>
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="bold"
          color="primary"
          gutterBottom
        >
          ➕ Yangi Submenu Qo‘shish
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          {/* Asosiy Menu select */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="parent-label">Asosiy Menu</InputLabel>
            <Select
              labelId="parent-label"
              name="parent_id"
              value={form.parent_id}
              onChange={handleChange}
              required
            >
              {menus.map((menu) => (
                <MenuItem key={menu.id} value={menu.id}>
                  {menu.title_uz}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Title-lar */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Title Uz"
                name="title_uz"
                value={form.title_uz}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Title Ru"
                name="title_ru"
                value={form.title_ru}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Title En"
                name="title_en"
                value={form.title_en}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Content Uz */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Content Uz</Typography>
            <CKEditor
              data={form.content_uz}
              onChange={(evt) => handleEditorChange("content_uz", evt)}
            />
          </Box>

          {/* Content Ru */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Content Ru</Typography>
            <CKEditor
              data={form.content_ru}
              onChange={(evt) => handleEditorChange("content_ru", evt)}
            />
          </Box>

          {/* Content En */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Content En</Typography>
            <CKEditor
              data={form.content_en}
              onChange={(evt) => handleEditorChange("content_en", evt)}
            />
          </Box>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 4, py: 1.2, fontWeight: "bold", borderRadius: 2 }}
          >
            Saqlash
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default MenuForm;
