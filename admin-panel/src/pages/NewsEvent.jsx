import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Stack,
  Paper,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { BASE_API_URL } from "../config";


const NewsEvent = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [contents, setContents] = useState({ uz: "", ru: "", en: "" });
  const [imageFile, setImageFile] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editValues, setEditValues] = useState({ uz: "", ru: "", en: "" });

  useEffect(() => {
    if (selectedTable) fetchNews();
  }, [selectedTable]);

  const fetchNews = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/api/news/${selectedTable}`);
      const data = await res.json();
      setNewsData(data);
    } catch (error) {
      console.error("❌ Ma’lumotlarni olishda xatolik:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Rostdan ham o‘chirmoqchimisiz?");
    if (!confirmed) return;
  
    try {
      await fetch(`${BASE_API_URL}/api/news/${selectedTable}/${id}`, {
        method: "DELETE",
      });
      fetchNews();
    } catch (err) {
      console.error("❌ O‘chirishda xatolik:", err);
    }
  };

  const handleChange = (lang, value) => {
    setContents(prev => ({ ...prev, [lang]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTable) return alert("❗ Bo‘lim tanlanmagan!");
  
    const formData = new FormData();
    formData.append("content_uz", contents.uz);
    formData.append("content_ru", contents.ru);
    formData.append("content_en", contents.en);
    if (imageFile) formData.append("image", imageFile);
  
    try {
      const res = await fetch(`${BASE_API_URL}/api/news/${selectedTable}`, {
        method: "POST",
        body: formData,
      });
  
      if (res.ok) {
        alert("✅ Ma’lumot saqlandi!");
        setContents({ uz: "", ru: "", en: "" });
        setImageFile(null);
        fetchNews();
      } else {
        alert("❌ Saqlashda xatolik!");
      }
    } catch (err) {
      console.error("❌ Server xatosi:", err);
    }
  };
  const handleEditSubmit = async (id) => {
    try {
      const res = await fetch(`${BASE_API_URL}/api/news/${selectedTable}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_uz: editValues.uz,
          content_ru: editValues.ru,
          content_en: editValues.en,
        }),
      });
      if (res.ok) {
        setEditingItem(null);
        fetchNews();
      } else {
        alert("❌ Tahrirlashda xatolik");
      }
    } catch (err) {
      console.error("❌ Tahrirlashda server xatosi:", err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Yangiliklar boshqaruvi
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" onClick={() => setSelectedTable("focus_news")}>🔵 Focus</Button>
        <Button variant="contained" color="secondary" onClick={() => setSelectedTable("aes_news")}>🟣 AES News</Button>
        <Button variant="contained" sx={{ backgroundColor: "#2e7d32" }} onClick={() => setSelectedTable("fstu_news")}>🟢 FSTU News</Button>
      </Stack>

      {selectedTable && (
        <>
          <Typography variant="h6" gutterBottom>
            📋 {selectedTable.toUpperCase()} jadvalidagi ma’lumotlar:
          </Typography>
          {newsData.map(item => (
            <Paper key={item.id} sx={{ p: 2, mb: 2, position: "relative" }}>
              {editingItem === item.id ? (
                <Box component="form" onSubmit={(e) => { e.preventDefault(); handleEditSubmit(item.id); }}>
                  {["uz", "ru", "en"].map((lang) => (
                    <TextField
                      key={lang}
                      label={`Matn (${lang.toUpperCase()})`}
                      fullWidth
                      multiline
                      rows={2}
                      value={editValues[lang]}
                      onChange={(e) => setEditValues(prev => ({ ...prev, [lang]: e.target.value }))}
                      sx={{ mb: 1 }}
                    />
                  ))}
                  <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" color="primary">💾 Saqlash</Button>
                    <Button variant="outlined" color="error" onClick={() => setEditingItem(null)}>Bekor qilish</Button>
                  </Stack>
                </Box>
              ) : (
                <>
                  <Typography><strong>UZ:</strong> {item.content_uz}</Typography>
                  <Typography><strong>RU:</strong> {item.content_ru}</Typography>
                  <Typography><strong>EN:</strong> {item.content_en}</Typography>
                  {item.image_url && <img src={`http://localhost:3001${item.image_url}`} alt="rasm" style={{ maxWidth: 200, marginTop: 10 }} />}
                  <IconButton
                    onClick={() => {
                      setEditingItem(item.id);
                      setEditValues({
                        uz: item.content_uz,
                        ru: item.content_ru,
                        en: item.content_en
                      });
                    }}
                    sx={{ position: "absolute", top: 8, right: 40 }}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </>
              )}
              <IconButton
                onClick={() => handleDelete(item.id)}
                sx={{ position: "absolute", top: 8, right: 8 }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}

          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              ➕ Yangi ma’lumot qo‘shish
            </Typography>

            <form onSubmit={handleSubmit}>
              {["uz", "ru", "en"].map((lang) => (
                <TextField
                  key={lang}
                  label={`Matn (${lang.toUpperCase()})`}
                  fullWidth
                  multiline
                  rows={3}
                  value={contents[lang]}
                  onChange={(e) => handleChange(lang, e.target.value)}
                  sx={{ mb: 2 }}
                />
              ))}
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: 20 }} />

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" color="success">💾 Saqlash</Button>
                <Button type="button" variant="outlined" color="error" onClick={() => setSelectedTable(null)}>✖️ Yopish</Button>
              </Stack>
            </form>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default NewsEvent;
