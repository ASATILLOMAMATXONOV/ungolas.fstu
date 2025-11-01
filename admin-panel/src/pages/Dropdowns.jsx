import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
  Switch,
  FormGroup,
  Tooltip,
  Fade,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { BASE_API_URL } from "../config";
import { useNavigate } from "react-router-dom";

const Dropdowns = () => {
  const navigate = useNavigate();

  const [menuList, setMenuList] = useState([]); // Asosiy menyular
  const [menuId, setMenuId] = useState(""); // Tanlangan asosiy menyu (menu_id)
  const [menuData, setMenuData] = useState({
    uz: { title: "", content: "" },
    ru: { title: "", content: "" },
    en: { title: "", content: "" },
  });

  const [hasContent, setHasContent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", type: "info" });

  const editorRefs = {
    uz: useRef(null),
    ru: useRef(null),
    en: useRef(null),
  };

  // 🔹 Asosiy menyularni olish
  const fetchMenus = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/menus`);
      const data = await res.json();
      setMenuList(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("❌ Menyularni olishda xato:", err.message);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleChange = (lang, field, value) => {
    setMenuData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  // 🔹 Submenu saqlash
  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      menu_id: menuId || null, // endi parent_id emas, SUBMENUS uchun menu_id
      title_uz: menuData.uz.title.trim(),
      title_ru: menuData.ru.title.trim(),
      title_en: menuData.en.title.trim(),
      content_uz: hasContent ? menuData.uz.content.trim() : "",
      content_ru: hasContent ? menuData.ru.content.trim() : "",
      content_en: hasContent ? menuData.en.content.trim() : "",
      has_content: hasContent,
    };

    const hasAnyData =
      payload.title_uz ||
      payload.title_ru ||
      payload.title_en ||
      payload.content_uz ||
      payload.content_ru ||
      payload.content_en;

    if (!hasAnyData) {
      setAlert({
        open: true,
        message: "⚠️ Kamida bitta sarlavha yoki kontent kiriting!",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    try {
      // 🔹 SUBMENUS ga yuboriladi
      const res = await fetch(`${BASE_API_URL}/submenus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setAlert({
          open: true,
          message: "✅ Submenyu muvaffaqiyatli Submenus jadvaliga saqlandi!",
          type: "success",
        });

        // 🔹 Formani tozalash
        setMenuData({
          uz: { title: "", content: "" },
          ru: { title: "", content: "" },
          en: { title: "", content: "" },
        });
        setMenuId("");

        Object.keys(editorRefs).forEach((lang) => {
          if (editorRefs[lang].current) {
            editorRefs[lang].current.setContent("");
          }
        });


   // 🔹 1 soniyadan so‘ng Dropdown sahifasiga qaytish

        setTimeout(() => navigate("/Dropdown"), 1000);
      } else {
        const errText = await res.text();
        setAlert({
          open: true,
          message: "❌ Server xatosi: " + errText,
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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🧩 Submenyu qo‘shish
      </Typography>

      {/* --- TITLE INPUTS --- */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Sarlavhalar
        </Typography>
        <Stack direction="column" spacing={2}>
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

      {/* --- ASOSIY MENU TANLASH --- */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderLeft: "5px solid #1976d2",
          backgroundColor: "#f9f9ff",
        }}
        elevation={3}
      >
        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
          🔽 Asosiy menyu tanlash
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ushbu submenyu qaysi asosiy menyuga biriktirilishini tanlang.
        </Typography>

        <FormControl fullWidth>
          <InputLabel>Asosiy menyu</InputLabel>
          <Select
            value={menuId}
            onChange={(e) => setMenuId(e.target.value)}
            label="Asosiy menyu"
          >
            <MenuItem value="">
              Hech biri (asosiy menyusiz submenyu)
            </MenuItem>
            {menuList.map((menu) => (
              <MenuItem key={menu.id} value={menu.id}>
                {menu.title_uz || `ID: ${menu.id}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* --- KONTENT YO‘QMI SWITCH --- */}
      <FormGroup sx={{ mb: 3 }}>
        <Tooltip title="Kontent bo‘lsa yoqing, bo‘lmasa o‘chiring" arrow>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 2,
              p: 1.5,
              backgroundColor: hasContent ? "#e8f5e9" : "#ffebee",
              transition: "all 0.3s ease",
              boxShadow: hasContent
                ? "0 0 6px rgba(76,175,80,0.3)"
                : "0 0 6px rgba(244,67,54,0.3)",
            }}
          >
            <Switch
              checked={hasContent}
              onChange={(e) => setHasContent(e.target.checked)}
              color={hasContent ? "success" : "error"}
            />

            <Fade in={true} timeout={500}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {hasContent ? (
                  <>
                    <CheckCircle color="success" />
                    <Typography fontWeight="500" color="green">
                      Bu menyuda kontent mavjud
                    </Typography>
                  </>
                ) : (
                  <>
                    <Cancel color="error" />
                    <Typography fontWeight="500" color="error">
                      Bu menyuda kontent mavjud emas
                    </Typography>
                  </>
                )}
              </Stack>
            </Fade>
          </Box>
        </Tooltip>
      </FormGroup>

      {/* --- CONTENT EDITORS --- */}
      {hasContent && (
        <Fade in={hasContent} timeout={700}>
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
                    onInit={(evt, editor) => (editorRefs[lang].current = editor)}
                    apiKey="oz1anr2rkjjim9zxiypl9te00gazqqq43epqosng505m0ddf"
                    value={menuData[lang].content}
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
          </Paper>
        </Fade>
      )}

      {/* --- SUBMIT BUTTON --- */}
      <Box textAlign="right" mt={4} display="flex" justifyContent="right" gap={2} >
        <Button
                  variant="outlined"
                  color="error"
                  onClick={() => navigate("/Dropdown")}
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
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.2,
            fontWeight: "bold",
            textTransform: "none",
            boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            "&:hover": { transform: "scale(1.03)" },
          }}
        >
          {loading ? "⏳ Saqlanmoqda..." : "💾 Saqlash"}
        </Button>
      </Box>

      {/* --- Snackbar (alert) --- */}
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
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dropdowns;
