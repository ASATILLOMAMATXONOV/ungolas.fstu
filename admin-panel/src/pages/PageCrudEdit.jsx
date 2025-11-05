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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { Save } from "@mui/icons-material";
import { Editor } from "@tinymce/tinymce-react";
import { BASE_API_URL } from "../config";

const PageCrudEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", type: "info" });

  const [components, setComponents] = useState([]);
  const [banners, setBanners] = useState([]);

  const [pageData, setPageData] = useState({
    component_id: "",
    banner_ids: [],
    title_uz: "",
    title_ru: "",
    title_en: "",
    content_uz: "",
    content_ru: "",
    content_en: "",
  });

  const editorRefs = { uz: useRef(null), ru: useRef(null), en: useRef(null) };

  // ✅ Componentlarni olish
  const fetchComponents = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/components`);
      const data = await res.json();
      setComponents(data);
    } catch (err) {
      console.error("❌ Componentlarni olishda xato:", err);
    }
  };

  // ✅ Bannerlarni olish
  const fetchBanners = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/banners`);
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error("❌ Bannerlarni olishda xato:", err);
    }
  };

  // ✅ Sahifa ma'lumotini olish (tahrirlash)
  const fetchPage = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/pages/${id}`);
      const data = await res.json();

      setPageData({
        component_id: data.component_id || "",
        banner_ids: data.banner_ids || [],
        title_uz: data.title_uz || "",
        title_ru: data.title_ru || "",
        title_en: data.title_en || "",
        content_uz: data.content_uz || "",
        content_ru: data.content_ru || "",
        content_en: data.content_en || "",
      });
    } catch (err) {
      console.error("❌ Sahifani olishda xato:", err);
    }
  };

  useEffect(() => {
    fetchComponents();
    fetchBanners();
    fetchPage();
  }, [id]);

  // 🔹 Input o'zgarishi
  const handleChange = (field, value) => {
    setPageData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Banner checkbox boshqaruvi
  const handleCheckboxChange = (bannerId) => {
    setPageData((prev) => {
      const selected = new Set(prev.banner_ids);
      selected.has(bannerId) ? selected.delete(bannerId) : selected.add(bannerId);
      return { ...prev, banner_ids: Array.from(selected) };
    });
  };

  // ✅ Yangilash
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/pages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });

      if (res.ok) {
        setAlert({
          open: true,
          message: "✅ Sahifa muvaffaqiyatli yangilandi!",
          type: "success",
        });
        setTimeout(() => navigate("/pages"), 1000);
      } else {
        setAlert({
          open: true,
          message: "❌ Yangilashda xato!",
          type: "error",
        });
      }
    } catch (err) {
      setAlert({
        open: true,
        message: "❌ Server xatosi",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // TinyMCE sozlamalari
  const editorConfig = {
    height: 450,
    menubar: false,
    plugins: [
      "advlist autolink lists link image charmap preview anchor",
      "searchreplace visualblocks code fullscreen",
      "insertdatetime media table help wordcount",
    ],
    toolbar:
      "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image media | code",
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }} elevation={3}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          ✏️ Sahifani tahrirlash
        </Typography>

        {/* ✅ COMPONENT tanlash (faqat bitta) */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="component-select-label">Qaysi ma'lumotga tegishli</InputLabel>
          <Select
            labelId="component-select-label"
            value={pageData.component_id}
            label="Qaysi ma'lumotga tegishli"
            onChange={(e) => handleChange("component_id", e.target.value)}
          >
            {components.map((comp) => (
              <MenuItem key={comp.id} value={comp.id}>
                ➤ {comp.title_uz}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* ✅ Ko‘p banner checkboxlari */}
        <Typography variant="h6" mb={1}>
          Qaysi bannerlarda ko'rinsin?
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap"
          spacing={2}
          mb={3}
          sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2 }}
        >
          {banners.map((banner) => (
            <FormControlLabel
              key={banner.id}
              control={
                <Checkbox
                  checked={pageData.banner_ids.includes(banner.id)}
                  onChange={() => handleCheckboxChange(banner.id)}
                  sx={{ color: "#009f5d", "&.Mui-checked": { color: "#009f5d" } }}
                />
              }
              label={banner.title_uz}
            />
          ))}
        </Stack>

        {/* ✅ Sarlavha */}
        <Typography variant="h6" mb={1}>
          Sarlavhalar
        </Typography>
        {["uz", "ru", "en"].map((lang) => (
          <TextField
            key={lang}
            label={`Sarlavha (${lang.toUpperCase()})`}
            fullWidth
            sx={{ mb: 2 }}
            value={pageData[`title_${lang}`]}
            onChange={(e) => handleChange(`title_${lang}`, e.target.value)}
          />
        ))}

        {/* ✅ Kontent TinyMCE */}
        <Typography variant="h6" mt={3} mb={1}>
          Kontentlar
        </Typography>

      {["uz", "ru", "en"].map((lang) => (
  <Box key={lang} sx={{ mb: 3 }}>
    <Typography fontWeight="bold" mb={1}>
      {lang.toUpperCase()}
    </Typography>

    <Editor
      onInit={(evt, editor) => (editorRefs[lang].current = editor)}
      apiKey="oz1anr2rkjjim9zxiypl9te00gazqqq43epqosng505m0ddf"
      value={pageData[`content_${lang}`]}    // ✅ TO‘G‘RI QILINDI
      onEditorChange={(newValue) => handleChange(`content_${lang}`, newValue)} // ✅ SAQLASH UCHUN
      init={{
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
          "alignleft aligncenter alignright alignjustify lineheight | bullist numlist outdent indent | link image media table | " +
          "removeformat | code fullscreen preview help",
        images_upload_url: `${BASE_API_URL}/upload`,
        automatic_uploads: true,
        file_picker_types: "image",
        file_picker_callback: (cb, value, meta) => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");

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
          body { font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333; }
          img { max-width: 100%; height: auto; border-radius: 6px; }
        `,
      }}
    />
  </Box>
))}


        {/* ✅ Tugmalar */}
        <Box display="flex" justifyContent="right" gap={2} mt={3}>
          <Button variant="outlined" color="error" onClick={() => navigate("/pages")}>
            Bekor qilish
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "⏳ Saqlanmoqda..." : "Saqlash"}
          </Button>
        </Box>
      </Paper>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={2300}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.type}>{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PageCrudEdit;
