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

const PageCrudEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", type: "info" });
  const [banners, setBanners] = useState([]);
  const [pageData, setPageData] = useState({
    banner_id: "",
    title_uz: "",
    title_ru: "",
    title_en: "",
    content_uz: "",
    content_ru: "",
    content_en: "",
  });

  const editorRefs = {
    uz: useRef(null),
    ru: useRef(null),
    en: useRef(null),
  };

  // 📥 Bannerlar ro‘yxatini olish
  const fetchBanners = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/banners`);
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error("❌ Bannerlarni olishda xato:", err);
    }
  };

  // 📥 Sahifani ma’lumotini olish
  const fetchPage = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/pages/${id}`);
      const data = await res.json();
      setPageData({
        banner_id: data.banner_id || "",
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
    fetchBanners();
    fetchPage();
  }, [id]);

  // 🔹 Input o‘zgarishlari
  const handleChange = (field, value) => {
    setPageData((prev) => ({ ...prev, [field]: value }));
  };

  // 💾 Yangilash funksiyasi
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
        setTimeout(() => navigate("/pages"), 1200);
      } else {
        setAlert({
          open: true,
          message: "❌ Yangilashda xatolik yuz berdi!",
          type: "error",
        });
      }
    } catch (err) {
      setAlert({
        open: true,
        message: "❌ Server bilan aloqa yo‘q: " + err.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ⚙️ TinyMCE sozlamalari
  const editorConfig = {
    height: 500,
    menubar: "file edit view insert format tools table help",
    plugins: [
      "advlist autolink lists link image charmap preview anchor",
      "searchreplace visualblocks code fullscreen",
      "insertdatetime media table help wordcount emoticons",
    ],
    toolbar:
      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough forecolor backcolor | " +
      "alignleft aligncenter alignright alignjustify lineheight | bullist numlist outdent indent | link image media table | " +
      "removeformat | code fullscreen preview help",
    automatic_uploads: true,
    images_upload_url: `${BASE_API_URL}/upload`,
    file_picker_types: "image",
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

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }} elevation={3}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          ✏️ Sahifani tahrirlash
        </Typography>

        {/* --- Banner tanlash --- */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="banner-select-label">Qaysi Banner uchun</InputLabel>
          <Select
            labelId="banner-select-label"
            value={pageData.banner_id}
            label="Qaysi Banner uchun"
            onChange={(e) => handleChange("banner_id", e.target.value)}
          >
            {banners.map((banner) => (
              <MenuItem key={banner.id} value={banner.id}>
                {banner.title_uz}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* --- Sarlavhalar --- */}
        <Typography variant="h6" mb={1}>
          Sarlavhalar
        </Typography>
        <Stack spacing={2} mb={3}>
          {["uz", "ru", "en"].map((lang) => (
            <TextField
              key={lang}
              label={`Sarlavha (${lang.toUpperCase()})`}
              fullWidth
              value={pageData[`title_${lang}`]}
              onChange={(e) => handleChange(`title_${lang}`, e.target.value)}
            />
          ))}
        </Stack>

        {/* --- Kontentlar --- */}
        <Typography variant="h6" mb={2}>
          Kontentlar
        </Typography>
        <Stack spacing={3}>
          {["uz", "ru", "en"].map((lang) => (
            <Box key={lang}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                {lang.toUpperCase()} matni
              </Typography>
            <Editor
         apiKey="oz1anr2rkjjim9zxiypl9te00gazqqq43epqosng505m0ddf"
         value={pageData[`content_${lang}`]}
         onEditorChange={(content) => handleChange(`content_${lang}`, content)}
         init={{
             height: 500,
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

  // 🔹 MUHIM — Word-dan kelgan HTMLni tozalaydi
  paste_as_text: false,
  paste_webkit_styles: "none",
  paste_retain_style_properties: "",
  paste_merge_formats: true,
  paste_remove_spans: true,
  paste_remove_styles_if_webkit: true,
  paste_strip_class_attributes: "all",
  invalid_styles: {
    "*": "font-family,font-size,color,background,margin,padding,text-indent,text-align",
  },
  forced_root_block: "p",

  // 🔹 HTMLni soddalashtiruvchi filtr
  valid_elements:
    "a[href|target=_blank],strong/b,em/i,u,span[style],p,br,ul,ol,li,img[src|alt|width|height|style],h1,h2,h3,h4,h5,h6,table,tr,td,th,thead,tbody",

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
         }}
         />
            </Box>
          ))}
        </Stack>

        {/* --- Saqlash tugmasi --- */}
      <Box textAlign="right" mt={4} display="flex" justifyContent="right" gap={2} >
            <Button
                         variant="outlined"
                         color="error"
                         onClick={() => navigate("/pages")}
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
            startIcon={<Save />}
            onClick={handleUpdate}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: "bold",
            }}
          >
            {loading ? "⏳ Yangilanmoqda..." : " Saqlash"}
          </Button>
        </Box>
      </Paper>

      {/* --- Snackbar --- */}
      <Snackbar
        open={alert.open}
        autoHideDuration={2500}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.type}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PageCrudEdit;
