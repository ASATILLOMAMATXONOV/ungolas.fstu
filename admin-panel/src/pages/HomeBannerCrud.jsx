import React, { useState, useEffect } from "react";
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
import { BASE_API_URL } from "../config";

const HomeBannerCrud = () => {
  const [banners, setBanners] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", type: "info" });

  const [formData, setFormData] = useState({
    title: "",
    link: "",
    image_uz: null,
    image_ru: null,
    image_en: null,
    preview_uz: "",
    preview_ru: "",
    preview_en: "",
  });

  // 📥 Bannerlarni olish
  const fetchBanners = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/banners`);
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error("❌ Ma’lumot olishda xato:", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // 🔹 Inputlar o‘zgarishi
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Rasm tanlash
  const handleImageChange = (lang, e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [`image_${lang}`]: file,
      [`preview_${lang}`]: URL.createObjectURL(file),
    }));
  };

  // 🔹 Tozalash
  const clearForm = () => {
    setFormData({
      title: "",
      link: "",
      image_uz: null,
      image_ru: null,
      image_en: null,
      preview_uz: "",
      preview_ru: "",
      preview_en: "",
    });
    setEditingId(null);
  };

  // 🔹 Saqlash yoki yangilash
 // 🔹 Saqlash yoki yangilash
const handleSave = async () => {
  if (!formData.title) {
    setAlert({
      open: true,
      message: "⚠️ Sarlavha kiritilishi shart!",
      type: "warning",
    });
    return;
  }

  setLoading(true);
  const form = new FormData();
  form.append("title_uz", formData.title);
  form.append("title_ru", formData.title);
  form.append("title_en", formData.title);
  form.append("link", formData.link);

  ["uz", "ru", "en"].forEach((lang) => {
    if (formData[`image_${lang}`]) {
      form.append(`image_${lang}`, formData[`image_${lang}`]);
    }
  });

  const url = editingId
    ? `${BASE_API_URL}/banners/${editingId}`
    : `${BASE_API_URL}/banners`;
  const method = editingId ? "PUT" : "POST";

  try {
    const res = await fetch(url, { method, body: form });

    if (res.ok) {
      setAlert({
        open: true,
        message: editingId
          ? "✏️ Banner yangilandi!"
          : "✅ Yangi banner qo‘shildi!",
        type: "success",
      });

      // 🔁 Kutilganidan 1 soniya keyin refresh qilamiz
      setTimeout(() => {
        window.location.reload();
      }, 1000);

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


  // 🔹 Tahrirlash
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title_uz, // barcha tilda bitta sarlavha bo‘ladi
      link: item.link || "",
      image_uz: null,
      image_ru: null,
      image_en: null,
      preview_uz: item.image_uz ? `${BASE_API_URL.replace("/api", "")}${item.image_uz}` : "",
      preview_ru: item.image_ru ? `${BASE_API_URL.replace("/api", "")}${item.image_ru}` : "",
      preview_en: item.image_en ? `${BASE_API_URL.replace("/api", "")}${item.image_en}` : "",
    });
    setFormOpen(true);
  };

  // 🔹 O‘chirish
  const handleDelete = async (id) => {
    if (!window.confirm("🗑 Rostdan ham o‘chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`${BASE_API_URL}/banners/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAlert({ open: true, message: "🗑 O‘chirildi!", type: "success" });
        fetchBanners();
      }
    } catch (err) {
      console.error("❌ O‘chirishda xato:", err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* --- HEADER --- */}
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          SDG Images
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            clearForm();
            setFormOpen(!formOpen);
          }}
        >
          {formOpen ? "Yopish" : "Yangi banner"}
        </Button>
      </Stack>

      {/* --- FORM --- */}
      <Collapse in={formOpen}>
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" mb={2}>
            {editingId ? "✏️ Banner tahrirlash" : "➕ Yangi banner qo‘shish"}
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Sarlavha (barcha tillar uchun)"
              fullWidth
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />

            {["uz", "ru", "en"].map((lang) => (
              <Box key={lang}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mt: 2, mb: 1 }}
                >
                  {lang.toUpperCase()} rasmini yuklash
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(lang, e)}
                />
               {formData[`preview_${lang}`] && (
            <img
                src={formData[`preview_${lang}`]}
                alt={`preview-${lang}`}
                style={{
                width: 120,
                height: 80,
                objectFit: "cover",
                display: "block",
                marginTop: 10,
                borderRadius: 6,
                border: "1px solid #ddd",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
            />

                )}
              </Box>
            ))}

            <TextField
              label="Link (URL)"
              fullWidth
              value={formData.link}
              onChange={(e) => handleChange("link", e.target.value)}
            />

            <Box textAlign="right">
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "⏳ Saqlanmoqda..." : " Saqlash"}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Collapse>

      {/* --- TABLE --- */}
      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
  <Table>
    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
      <TableRow>
        <TableCell>#</TableCell>
        <TableCell>UZ</TableCell>
        <TableCell>RU</TableCell>
        <TableCell>EN</TableCell>
        <TableCell>Sarlavha</TableCell>
        <TableCell>Link</TableCell>
        <TableCell align="right">Amal</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {banners.length > 0 ? (
        banners.map((item, index) => (
          <TableRow key={item.id} hover>
            <TableCell>{index + 1}</TableCell>

            {/* UZ rasm */}
            <TableCell>
              {item.image_uz && (
                <img
                  src={`${BASE_API_URL.replace("/api", "")}${item.image_uz}`}
                  alt="uz"
                  style={{
                    width: 50,
                    height: 35,
                    objectFit: "cover",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
              )}
            </TableCell>

            {/* RU rasm */}
            <TableCell>
              {item.image_ru && (
                <img
                  src={`${BASE_API_URL.replace("/api", "")}${item.image_ru}`}
                  alt="ru"
                  style={{
                    width: 50,
                    height: 35,
                    objectFit: "cover",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
              )}
            </TableCell>

            {/* EN rasm */}
            <TableCell>
              {item.image_en && (
                <img
                  src={`${BASE_API_URL.replace("/api", "")}${item.image_en}`}
                  alt="en"
                  style={{
                    width: 50,
                    height: 35,
                    objectFit: "cover",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
              )}
            </TableCell>

            <TableCell>{item.title_uz}</TableCell>
            <TableCell>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1976d2", textDecoration: "none" }}
              >
                {item.link}
              </a>
            </TableCell>

            <TableCell align="right">
              <Tooltip title="Tahrirlash">
                <IconButton color="primary" onClick={() => handleEdit(item)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="O‘chirish">
                <IconButton color="error" onClick={() => handleDelete(item.id)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={7} align="center">
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

export default HomeBannerCrud;
