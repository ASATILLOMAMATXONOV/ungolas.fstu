import React, { useState, useRef } from "react";
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
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { BASE_API_URL } from "../config";
import { useNavigate } from "react-router-dom";

const Menus = () => {
  const navigate = useNavigate();

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

  const handleChange = (lang, field, value) => {
    setMenuData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      title_uz: menuData.uz.title.trim(),
      title_ru: menuData.ru.title.trim(),
      title_en: menuData.en.title.trim(),
      content_uz: hasContent ? menuData.uz.content.trim() : "",
      content_ru: hasContent ? menuData.ru.content.trim() : "",
      content_en: hasContent ? menuData.en.content.trim() : "",
      has_content: hasContent,
    };

    // 🔹 SHU YERDA MANTIQLI TEKSHIRUV
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
        message: "⚠️ Iltimos, kamida bitta sarlavha yoki kontent kiriting!",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_API_URL}/menus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setAlert({
          open: true,
          message: "✅ Ma’lumotlar bazaga saqlandi!",
          type: "success",
        });

        // 🔹 Formani tozalash
        setMenuData({
          uz: { title: "", content: "" },
          ru: { title: "", content: "" },
          en: { title: "", content: "" },
        });

        Object.keys(editorRefs).forEach((lang) => {
          if (editorRefs[lang].current) {
            editorRefs[lang].current.setContent("");
          }
        });

        setTimeout(() => navigate("/menu"), 700);
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
        🧩 Create Menu
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

      {/* --- CHIROYLI SWITCH (animated) --- */}
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
                    onInit={(evt, editor) =>
                      (editorRefs[lang].current = editor)
                    }
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
                        "undo redo | blocks | bold italic underline forecolor backcolor | " +
                        "alignleft aligncenter alignright alignjustify | bullist numlist | link image | " +
                        "removeformat | code fullscreen preview help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
                    }}
                    onEditorChange={(content) =>
                      handleChange(lang, "content", content)
                    }
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Fade>
      )}

      {/* --- SUBMIT BUTTON --- */}
      <Box textAlign="right" mt={4}>
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

export default Menus;
