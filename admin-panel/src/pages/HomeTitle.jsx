import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Stack,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Collapse,
} from "@mui/material";
import { Add, Edit, Delete, Save } from "@mui/icons-material";
import { Editor } from "@tinymce/tinymce-react";
import { BASE_API_URL } from "../config";

const HomeTitleCrud = () => {
  const [titles, setTitles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", type: "info" });

  const [newTitle, setNewTitle] = useState({
    uz: { title: "", content: "" },
    ru: { title: "", content: "" },
    en: { title: "", content: "" },
  });

  const editorRefs = {
    uz: useRef(null),
    ru: useRef(null),
    en: useRef(null),
  };

  // 📥 Ma’lumotlarni olish
  const fetchTitles = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/home-titles`);
      const data = await res.json();
      setTitles(data);
    } catch (err) {
      console.error("❌ Ma’lumotlarni olishda xato:", err);
    }
  };

  useEffect(() => {
    fetchTitles();
  }, []);

  // 🔹 Input o‘zgarishlarini yozish
  const handleChange = (lang, field, value) => {
    setNewTitle((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  // 🔹 Saqlash yoki tahrirlash
  const handleSave = async () => {
    setLoading(true);
    const payload = {
      title_uz: newTitle.uz.title,
      title_ru: newTitle.ru.title,
      title_en: newTitle.en.title,
      desc_uz: newTitle.uz.content,
      desc_ru: newTitle.ru.content,
      desc_en: newTitle.en.content,
    };

    try {
      const url = editingId
        ? `${BASE_API_URL}/home-titles/${editingId}`
        : `${BASE_API_URL}/home-titles`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setAlert({
          open: true,
          message: editingId
            ? "✏️ Ma’lumot yangilandi!"
            : "✅ Yangi sarlavha qo‘shildi!",
          type: "success",
        });
        setNewTitle({
          uz: { title: "", content: "" },
          ru: { title: "", content: "" },
          en: { title: "", content: "" },
        });
        setFormOpen(false);
        setEditingId(null);
        fetchTitles();
      } else {
        setAlert({
          open: true,
          message: "❌ Saqlashda xatolik!",
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

  // 🔹 Tahrirlashni boshlash
  const handleEdit = (item) => {
    setEditingId(item.id);
    setNewTitle({
      uz: { title: item.title_uz, content: item.desc_uz },
      ru: { title: item.title_ru, content: item.desc_ru },
      en: { title: item.title_en, content: item.desc_en },
    });
    setFormOpen(true);
  };

  // 🔹 O‘chirish
  const handleDelete = async (id) => {
    if (!window.confirm("🗑 Haqiqatan ham o‘chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`${BASE_API_URL}/home-titles/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAlert({
          open: true,
          message: "🗑 O‘chirildi!",
          type: "success",
        });
        fetchTitles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* --- HEADER --- */}
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          📋 Asosiy Sarlavhalar
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setFormOpen(!formOpen)}
        >
          {formOpen ? "Yopish" : " Sarlavha qo‘shish"}
        </Button>
      </Stack>

      {/* --- FORM --- */}
      <Collapse in={formOpen}>
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" mb={2}>
            {editingId ? "✏️ Sarlavhani tahrirlash" : "➕ Yangi sarlavha qo‘shish"}
          </Typography>

          {/* --- Sarlavhalar --- */}
          <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
            {["uz", "ru", "en"].map((lang) => (
              <TextField
                key={lang}
                label={`Sarlavha (${lang.toUpperCase()})`}
                value={newTitle[lang].title}
                onChange={(e) => handleChange(lang, "title", e.target.value)}
              />
            ))}
          </Stack>

          {/* --- TinyMCE Content --- */}
          <Stack direction="column" spacing={3}>
            {["uz", "ru", "en"].map((lang) => (
              <Box key={lang}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Kontent ({lang.toUpperCase()})
                </Typography>
                <Editor
                  apiKey="oz1anr2rkjjim9zxiypl9te00gazqqq43epqosng505m0ddf"
                  onInit={(evt, editor) => (editorRefs[lang].current = editor)}
                  value={newTitle[lang].content}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
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
                    ],
                    toolbar:
                      "undo redo | bold italic underline | " +
                      "alignleft aligncenter alignright alignjustify | bullist numlist | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                  onEditorChange={(content) =>
                    handleChange(lang, "content", content)
                  }
                />
              </Box>
            ))}
          </Stack>

          <Box textAlign="right" mt={3}>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
              startIcon={<Save />}
            >
              {loading ? "Saqlanmoqda..." : " Saqlash"}
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {/* --- Jadval --- */}
      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Sarlavha (UZ)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Sarlavha (RU)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Sarlavha (EN)</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Amal
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {titles.length > 0 ? (
              titles.map((item, index) => (
                <TableRow key={item.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.title_uz}</TableCell>
                  <TableCell>{item.title_ru}</TableCell>
                  <TableCell>{item.title_en}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Tahrirlash">
                      <IconButton color="primary" onClick={() => handleEdit(item)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="O‘chirish">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  ❗ Ma’lumot yo‘q
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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

export default HomeTitleCrud;
