import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { Save } from "@mui/icons-material";
import { Editor } from "@tinymce/tinymce-react";
import { BASE_API_URL } from "../config";

const ComponentCrud = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", type: "info" });
  const [banners, setBanners] = useState([]);

  const editorRefs = { uz: useRef(null), ru: useRef(null), en: useRef(null) };

  const [data, setData] = useState({
    banner_id: "",
    title_uz: "",
    title_ru: "",
    title_en: "",
    content_uz: "",
    content_ru: "",
    content_en: "",
  });

  const [files, setFiles] = useState({ uz: null, ru: null, en: null });
  const [previews, setPreviews] = useState({ uz: "", ru: "", en: "" });

  useEffect(() => {
    fetchBanners();
    if (id) fetchData();
  }, [id]);

  const fetchBanners = async () => {
    const res = await fetch(`${BASE_API_URL}/banners`);
    const data = await res.json();
    setBanners(data);
  };

  const fetchData = async () => {
    const res = await fetch(`${BASE_API_URL}/components/${id}`);
    const result = await res.json();
    setData(result);

    setPreviews({
      uz: result.image_uz ? `${BASE_API_URL.replace("/api", "")}${result.image_uz}` : "",
      ru: result.image_ru ? `${BASE_API_URL.replace("/api", "")}${result.image_ru}` : "",
      en: result.image_en ? `${BASE_API_URL.replace("/api", "")}${result.image_en}` : "",
    });
  };

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (lang, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFiles((prev) => ({ ...prev, [lang]: file }));
    setPreviews((prev) => ({ ...prev, [lang]: URL.createObjectURL(file) }));
  };

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value || "");
    });

    ["uz", "ru", "en"].forEach((lang) => {
      if (files[lang]) formData.append(`file_${lang}`, files[lang]);
    });

    const res = await fetch(`${BASE_API_URL}/components${id ? "/" + id : ""}`, {
      method: id ? "PUT" : "POST",
      body: formData,
    });

    setLoading(false);

    if (!res.ok) {
      setAlert({ open: true, message: "❌ Saqlashda xatolik!", type: "error" });
      return;
    }

    setAlert({
      open: true,
      message: id ? "✏️ Komponent yangilandi!" : "✅ Yangi komponent qo‘shildi!",
      type: "success",
    });

    setTimeout(() => navigate("/components"), 1000);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }} elevation={3}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          {id ? "✏️ Komponentni tahrirlash" : "➕ Yangi komponent qo‘shish"}
        </Typography>

        {/* Banner tanlash */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Banner tanlang</InputLabel>
          <Select
            value={data.banner_id || ""}
            label="Banner tanlang"
            onChange={(e) => handleChange("banner_id", e.target.value)}
          >
            {banners.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.title_uz}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sarlavhalar */}
        <Stack spacing={2} mb={3}>
          {["uz", "ru", "en"].map((lang) => (
            <TextField
              key={lang}
              label={`Sarlavha (${lang.toUpperCase()})`}
              fullWidth
              value={data[`title_${lang}`] || ""}
              onChange={(e) => handleChange(`title_${lang}`, e.target.value)}
            />
          ))}
        </Stack>

        {/* Rasmlar */}
        <Typography variant="h6" mb={1}>
          Rasmlar (3 tilda)
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={4} mb={4}>
          {["uz", "ru", "en"].map((lang) => (
            <Box key={lang}>
              <Typography fontWeight="bold" mb={1}>
                Rasm ({lang.toUpperCase()})
              </Typography>
              <Button variant="contained" component="label" sx={{ mb: 1 }}>
                Fayl tanlash
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageChange(lang, e)}
                />
              </Button>

              {previews[lang] && (
                <img
                  src={previews[lang]}
                  alt={`${lang} preview`}
                  style={{
                    width: 150,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
              )}
            </Box>
          ))}
        </Stack>

        {/* TinyMCE Editor */}
        <Typography variant="h6" mb={2}>
          Kontent (3 tilda)
        </Typography>

        <Stack spacing={3}>
          {["uz", "ru", "en"].map((lang) => (
            <Box key={lang}>
              <Typography fontWeight="bold" mb={1}>
                {lang.toUpperCase()}
              </Typography>

              <Editor
                onInit={(evt, editor) => (editorRefs[lang].current = editor)}
                apiKey="oz1anr2rkjjim9zxiypl9te00gazqqq43epqosng505m0ddf"
                value={data[`content_${lang}`]}                  // ✅ To'g'ri bo‘ldi
                onEditorChange={(newValue) =>
                  handleChange(`content_${lang}`, newValue)
                }                                                // ✅ Statega yoziladi
                init={{
                  height: 400,
                  menubar: true,
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
                  images_upload_url: `${BASE_API_URL}/upload`,
                  automatic_uploads: true,
                }}
              />
            </Box>
          ))}
        </Stack>

        {/* Tugmalar */}
        <Box textAlign="right" mt={4} display="flex" justifyContent="right" gap={2}>
          <Button variant="outlined" color="error" onClick={() => navigate("/components")}>
            🔙 Bekor qilish
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "⏳ Saqlanmoqda..." : "Saqlash"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={alert.open}
        autoHideDuration={2500}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={alert.type} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ComponentCrud;
