import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { ExpandMore, Save } from "@mui/icons-material";
import { Editor } from "@tinymce/tinymce-react";
import { BASE_API_URL } from "../config";
import { useNavigate } from "react-router-dom";

const NewPageCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", type: "info" });

  const [pageData, setPageData] = useState({
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

  const handleChange = (field, value) => {
    setPageData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/new-pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });

      if (res.ok) {
        setAlert({
          open: true,
          message: "✅ Yangi sahifa muvaffaqiyatli yaratildi!",
          type: "success",
        });
        setTimeout(() => navigate("/new-pages"), 1200);
      } else throw new Error("Server xato javob qaytardi");
    } catch (err) {
      setAlert({ open: true, message: "❌ Saqlashda xato!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }} elevation={3}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          ➕ Yangi sahifa yaratish
        </Typography>

        {["uz", "ru", "en"].map((lang) => (
          <Accordion key={lang} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight="bold">
                {lang.toUpperCase()} tilida
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  label={`Sarlavha (${lang.toUpperCase()})`}
                  value={pageData[`title_${lang}`]}
                  onChange={(e) => handleChange(`title_${lang}`, e.target.value)}
                  fullWidth
                />
                <Editor
                  apiKey="oz1anr2rkjjim9zxiypl9te00gazqqq43epqosng505m0ddf"
                  onInit={(evt, editor) => (editorRefs[lang].current = editor)}
                  value={pageData[`content_${lang}`]}
                  onEditorChange={(val) =>
                    handleChange(`content_${lang}`, val)
                  }
                  init={{
                    height: 400,
                    menubar: true,
                    plugins:
                      "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
                    toolbar:
                      "undo redo | blocks | bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table | removeformat code fullscreen",
                    content_style: `
                      body { font-family: Helvetica,Arial,sans-serif; font-size: 16px; }
                    `,
                  }}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}

        <Box textAlign="right" mt={3}>
          <Button variant="outlined" color="error" onClick={() => navigate("/new-pages")}>
            Bekor qilish
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            sx={{ ml: 2 }}
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
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.type}>{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default NewPageCreate;
