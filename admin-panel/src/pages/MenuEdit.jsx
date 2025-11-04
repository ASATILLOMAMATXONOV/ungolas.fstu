import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../config";

const MenuEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menuData, setMenuData] = useState({
    uz: { title: "", content: "" },
    ru: { title: "", content: "" },
    en: { title: "", content: "" },
  });

  const [hasContent, setHasContent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", type: "info" });

  const editorRefs = { uz: useRef(null), ru: useRef(null), en: useRef(null) };

  /* ----------------------- 🟢 Ma’lumotni olish ----------------------- */
  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/menus/${id}`);
      const data = await res.json();
      setMenuData({
        uz: { title: data.title_uz || "", content: data.content_uz || "" },
        ru: { title: data.title_ru || "", content: data.content_ru || "" },
        en: { title: data.title_en || "", content: data.content_en || "" },
      });
      setHasContent(data.has_content);
    } catch (err) {
      setAlert({
        open: true,
        message: "❌ Ma’lumotni olishda xatolik: " + err.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [id]);

  /* ----------------------- ✏️ Input o‘zgarishlari ----------------------- */
  const handleChange = (lang, field, value) => {
    setMenuData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  /* ----------------------- 💾 Yangilash (saqlash) ----------------------- */
  const handleUpdate = async () => {
    setLoading(true);

    const payload = {
      title_uz: menuData.uz.title,
      title_ru: menuData.ru.title,
      title_en: menuData.en.title,
      content_uz: hasContent ? menuData.uz.content : null,
      content_ru: hasContent ? menuData.ru.content : null,
      content_en: hasContent ? menuData.en.content : null,
      has_content: hasContent,
    };

    try {
      const res = await fetch(`${BASE_API_URL}/menus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setAlert({
          open: true,
          message: "✅ Menu muvaffaqiyatli yangilandi!",
          type: "success",
        });
        setTimeout(() => navigate("/menu"), 800);
      } else {
        setAlert({
          open: true,
          message: "❌ Server xatosi!",
          type: "error",
        });
      }
    } catch (err) {
      setAlert({
        open: true,
        message: "❌ Tarmoq xatosi: " + err.message,
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
          cb(`${BASE_API_URL.replace("/api", "")}${data.location}`, {
            title: file.name,
          });
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

  /* ----------------------- 🧩 JSX Rendering ----------------------- */
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        ✏️ Menuni tahrirlash
      </Typography>

      {/* --- Sarlavhalar --- */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Sarlavhalar
        </Typography>

        <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
          {["uz", "ru", "en"].map((lang) => (
            <TextField
              key={lang}
              label={`Sarlavha (${lang.toUpperCase()})`}
              variant="outlined"
              fullWidth
              value={menuData[lang].title}
              onChange={(e) => handleChange(lang, "title", e.target.value)}
            />
          ))}
        </Stack>
      </Paper>

      {/* --- Kontent mavjudligi belgisi --- */}
      <FormControlLabel
        control={
          <Switch
            checked={hasContent}
            onChange={(e) => setHasContent(e.target.checked)}
            color="primary"
          />
        }
        label="Bu menyuda kontent mavjud"
        sx={{ mb: 3 }}
      />

      {/* --- Kontent tahrirchilari --- */}
      {hasContent && (
        <Paper sx={{ p: 3 }} elevation={3}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Kontentlar
          </Typography>

          <Stack direction="column" spacing={4}>
            {["uz", "ru", "en"].map((lang) => (
              <Box key={lang}>
                <Typography
                  variant="subtitle2"
                  fontWeight="medium"
                  sx={{ mb: 1 }}
                >
                  Content ({lang.toUpperCase()})
                </Typography>

                <Editor
                  apiKey="oz1anr2rkjjim9zxiypl9te00gazqqq43epqosng505m0ddf"
                  value={menuData[lang].content}
                  init={editorConfig}
                  onEditorChange={(content) =>
                    handleChange(lang, "content", content)
                  }
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      {/* --- Tugmalar --- */}
      <Box
        textAlign="right"
        mt={4}
        display="flex"
        justifyContent="right"
        gap={2}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={() => navigate("/menu")}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.2,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          🔙 Bekor qilish
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Yangilanmoqda..." : "💾 Saqlash"}
        </Button>
      </Box>

      {/* --- Snackbar --- */}
      <Snackbar
        open={alert.open}
        autoHideDuration={2000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuEdit;
