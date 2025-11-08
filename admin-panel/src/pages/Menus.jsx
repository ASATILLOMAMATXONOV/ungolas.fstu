import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "@mui/icons-material";

import { Editor } from "@tinymce/tinymce-react";


import { BASE_API_URL } from "../config";

export default function MenuCrud() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", type: "info" });

  const [menuData, setMenuData] = useState({
    title_uz: "",
    title_ru: "",
    title_en: "",
    content_uz: "",
    content_ru: "",
    content_en: "",
    has_content: false,
  });

  useEffect(() => {
    if (id) {
      fetch(`${BASE_API_URL}/menus/${id}`)
        .then((res) => res.json())
        .then((data) =>
          setMenuData({
            title_uz: data.title_uz || "",
            title_ru: data.title_ru || "",
            title_en: data.title_en || "",
            content_uz: data.content_uz || "",
            content_ru: data.content_ru || "",
            content_en: data.content_en || "",
            has_content: data.has_content ?? false,
          })
        )
        .catch((err) => console.error("❌ Ma’lumot olishda xato:", err));
    }
  }, [id]);

  const handleChange = (field, value) => {
    setMenuData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        ...menuData,
        content_uz: menuData.has_content ? menuData.content_uz : null,
        content_ru: menuData.has_content ? menuData.content_ru : null,
        content_en: menuData.has_content ? menuData.content_en : null,
      };

      const method = id ? "PUT" : "POST";
      const url = id
        ? `${BASE_API_URL}/menus/${id}`
        : `${BASE_API_URL}/menus`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setAlert({
          open: true,
          message: id ? "✅ Menyu yangilandi!" : "✅ Yangi menyu saqlandi!",
          type: "success",
        });
        setTimeout(() => navigate("/menu"), 1200);
      } else {
        setAlert({
          open: true,
          message: "❌ Saqlashda xatolik!",
          type: "error",
        });
      }
    } catch (err) {
      console.error("❌ Xato:", err);
      setAlert({
        open: true,
        message: "❌ Server bilan aloqa yo‘q: " + err.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

    /* ----------------------- ⚙️ TinyMCE sozlamalari ----------------------- */
    const editorConfig = {
      height: 400,
      menubar: "file edit view insert format tools table help",
      plugins: [
        "advlist",
        "autolink",
        "lists",
        "link",
        "image",
        "charmap",
        "preview",
        "anchor",
        "searchreplace",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "help",
        "wordcount",
        "emoticons",
      ],
      toolbar:
        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough forecolor backcolor | " +
        "alignleft aligncenter alignright alignjustify lineheight | bullist numlist outdent indent | " +
        "link image media table | removeformat | code fullscreen preview help",
  
      automatic_uploads: true,
      file_picker_types: "image",
      paste_data_images: true,
  
     file_picker_callback: (cb) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async function () {
    const file = this.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      cb(data.location, { title: file.name }); // ✅ Faqat URL
    } catch (err) {
      console.error("❌ Yuklashda xato:", err);
    }
  };

  input.click();
},

  
      content_style: `
        body {
          font-family: Helvetica, Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #333;
        }
        img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
        }
      `,
    };
  

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }} elevation={3}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          {id ? "✏️ Menyuni tahrirlash" : "➕ Yangi menyu qo‘shish"}
        </Typography>

        <Typography variant="h6" mb={1}>
          Sarlavhalar
        </Typography>
        <Stack spacing={2} mb={3}>
          {["uz", "ru", "en"].map((lang) => (
            <TextField
              key={lang}
              label={`Sarlavha (${lang.toUpperCase()})`}
              fullWidth
              required
              value={menuData[`title_${lang}`]}
              onChange={(e) => handleChange(`title_${lang}`, e.target.value)}
            />
          ))}
        </Stack>

        <FormControlLabel
          control={
            <Checkbox
              checked={menuData.has_content}
              onChange={(e) => handleChange("has_content", e.target.checked)}
              color="success"
            />
          }
          label="Kontent mavjud"
          sx={{ mb: 2 }}
        />

        {menuData.has_content && (
          <>
            <Typography variant="h6" mb={2}>
              Kontentlar
            </Typography>

            <Stack spacing={3}>
            {["uz", "ru", "en"].map((lang) => (
  <Box key={lang}>
    <Typography variant="subtitle1" mb={1} fontWeight="bold">
      {lang.toUpperCase()} matni
    </Typography>

    <Editor
      apiKey="oz1anr2rkjjim9zxiypl9te00gazqqq43epqosng505m0ddf"
      value={menuData[`content_${lang}`]}   // ✅ To‘g‘ri
      init={editorConfig}
      onEditorChange={(content) => handleChange(`content_${lang}`, content)} // ✅ To‘g‘ri
    />
  </Box>
))}

            </Stack>
          </>
        )}

        <Box mt={4} display="flex" justifyContent="right" gap={2}>
          <Button variant="outlined" color="error" onClick={() => navigate("/menu")}>
            Bekor qilish
          </Button>
          <Button variant="contained" color="primary" startIcon={<Save />} onClick={handleSave}>
            {loading ? "⏳ Saqlanmoqda..." : "Saqlash"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={alert.open}
        autoHideDuration={2000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.type}>{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
}
