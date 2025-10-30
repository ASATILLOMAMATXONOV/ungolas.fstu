import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Button, TextField, Typography, Card, CardContent,
  Grid, Select, MenuItem, InputLabel, FormControl,
  IconButton, Stack, Collapse
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { BASE_API_URL } from "../config";


const Fanlar = () => {
  const [fanlar, setFanlar] = useState([]);
  const [language, setLanguage] = useState("uz");
  const [step, setStep] = useState("");
  const [newFan, setNewFan] = useState({ nom_uz: "", nom_ru: "", nom_en: "" });
  const [selectedFanIndex, setSelectedFanIndex] = useState("");
  const [newCategory, setNewCategory] = useState({ nom_uz: "", nom_ru: "", nom_en: "" });
  const [newMavzu, setNewMavzu] = useState({ nom_uz: "", nom_ru: "", nom_en: "", link: "" });
  const [selectedCategory, setSelectedCategory] = useState("");

  const [openFanIndex, setOpenFanIndex] = useState(null);
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);

  useEffect(() => {
    const fetchFanlar = async () => {
      try {
        const res = await axios.get(`${BASE_API_URL}/api/fanlar`);
        setFanlar(res.data);
      } catch (err) {
        console.error("Fanlarni olishda xatolik:", err);
      }
    };
    fetchFanlar();
  }, []);

  const toggleFan = (index) => {
    setOpenFanIndex(openFanIndex === index ? null : index);
    setOpenCategoryIndex(null);
  };

  const toggleCategory = (index) => {
    setOpenCategoryIndex(openCategoryIndex === index ? null : index);
  };

  const handleAddFan = async () => {
    if (!newFan.nom_uz || !newFan.nom_ru || !newFan.nom_en) return;
    try {
      const res = await axios.post(`${BASE_API_URL}/api/fanlar`, newFan);
      setFanlar([...fanlar, { ...res.data, categories: [] }]);
      setNewFan({ nom_uz: "", nom_ru: "", nom_en: "" });
    } catch (err) {
      console.error("Fan qo‘shishda xatolik:", err);
    }
  };

  const handleUpdateFan = async (index) => {
    const current = fanlar[index];
    const edited = prompt("Fan nomi (UZ):", current.nom_uz);
    if (!edited) return;
    try {
      const res = await axios.put(`${BASE_API_URL}/api/fanlar/${current.id}`, {
        nom_uz: edited,
        nom_ru: current.nom_ru,
        nom_en: current.nom_en,
      });
      const updated = [...fanlar];
      updated[index] = res.data;
      setFanlar(updated);
    } catch (err) {
      console.error("Fan tahrirlashda xatolik:", err);
    }
  };

  const handleDeleteFan = async (index) => {
    const fanId = fanlar[index].id;
    try {
      await axios.delete(`${BASE_API_URL}/api/fanlar/${fanId}`);
      const updated = fanlar.filter((_, i) => i !== index);
      setFanlar(updated);
    } catch (err) {
      console.error("Fan o‘chirishda xatolik:", err);
    }
  };

  const handleAddCategory = async () => {
    if (selectedFanIndex === "" || !newCategory.nom_uz) return;
    const fanId = fanlar[selectedFanIndex].id;
    try {
      const res = await axios.post(`${BASE_API_URL}/api/fanlar/${fanId}/kategoriyalar`, newCategory);
      const updated = [...fanlar];
      updated[selectedFanIndex].categories.push(res.data);
      setFanlar(updated);
      setNewCategory({ nom_uz: "", nom_ru: "", nom_en: "" });
    } catch (err) {
      console.error("Kategoriya qo‘shishda xatolik:", err);
    }
  };

  const handleDeleteCategory = async (fanIdx, categoryId) => {
    try {
      await axios.delete(`${BASE_API_URL}/api/fanlar/kategoriyalar/${categoryId}`);
      const updated = [...fanlar];
      updated[fanIdx].categories = updated[fanIdx].categories.filter((c) => c.id !== categoryId);
      setFanlar(updated);
    } catch (err) {
      console.error("Kategoriya o‘chirishda xatolik:", err);
    }
  };

  const handleAddMavzu = async () => {
    if (selectedFanIndex === "" || !selectedCategory) return;
    const fan = fanlar[selectedFanIndex];
    const category = fan.categories.find(
      (c) =>
        c.nom_uz === selectedCategory ||
        c.nom_ru === selectedCategory ||
        c.nom_en === selectedCategory ||
        c.name === selectedCategory
    );
    if (!category) return;
    try {
      const res = await axios.post(`${BASE_API_URL}/api/fanlar/kategoriyalar/${category.id}/mavzular`, newMavzu);
      const updated = [...fanlar];
      const catIndex = updated[selectedFanIndex].categories.findIndex((c) => c.id === category.id);
      updated[selectedFanIndex].categories[catIndex].mavzular = [
        ...(updated[selectedFanIndex].categories[catIndex].mavzular || []),
        res.data,
      ];
      setFanlar(updated);
      setNewMavzu({ nom_uz: "", nom_ru: "", nom_en: "", link: "" });
    } catch (err) {
      console.error("Mavzu qo‘shishda xatolik:", err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>📘 Fanlar Boshqaruvi</Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item><Button variant="contained" onClick={() => setStep("addFan")}>➕ Fan qo'shish</Button></Grid>
        <Grid item><Button variant="contained" onClick={() => setStep("addCategory")}>📂 Kategoriya qo'shish</Button></Grid>
        <Grid item><Button variant="contained" onClick={() => setStep("addMavzu")}>📝 Mavzu qo'shish</Button></Grid>
      </Grid>

      {step === "addFan" && (
  <Grid container spacing={2}>
    {/* Fan nomlari */}
    <Grid item xs={4}>
      <TextField
        label="Fan (UZ)"
        fullWidth
        value={newFan.nom_uz}
        onChange={e => setNewFan({ ...newFan, nom_uz: e.target.value })}
      />
    </Grid>
    <Grid item xs={4}>
      <TextField
        label="Fan (RU)"
        fullWidth
        value={newFan.nom_ru}
        onChange={e => setNewFan({ ...newFan, nom_ru: e.target.value })}
      />
    </Grid>
    <Grid item xs={4}>
      <TextField
        label="Fan (EN)"
        fullWidth
        value={newFan.nom_en}
        onChange={e => setNewFan({ ...newFan, nom_en: e.target.value })}
      />
    </Grid>
<br />
    {/* Qo‘shimcha ma’lumotlar */}
    <Grid item xs={3}>
      <TextField
        label="Code"
        fullWidth
        value={newFan.code || ""}
        onChange={e => setNewFan({ ...newFan, code: e.target.value })}
      />
    </Grid>

    <Grid item xs={3}>
      <TextField
        label="Language"
        fullWidth
        value={newFan.language || ""}
        onChange={e => setNewFan({ ...newFan, language: e.target.value })}
      />
    </Grid>

    <Grid item xs={3}>
      <TextField
        label="Semester"
        fullWidth
        value={newFan.semester || ""}
        onChange={e => setNewFan({ ...newFan, semester: e.target.value })}
      />
    </Grid>

    <Grid item xs={3}>
      <TextField
        label="Credits"
        fullWidth
        type="number"
        value={newFan.credits || ""}
        onChange={e => setNewFan({ ...newFan, credits: e.target.value })}
      />
    </Grid>

    <Grid item xs={6}>
      <TextField
        label="Teachers"
        fullWidth
        value={newFan.teachers || ""}
        onChange={e => setNewFan({ ...newFan, teachers: e.target.value })}
      />
    </Grid>

    {/* Saqlash tugmasi */}
    <Grid item xs={12}>
      <Button onClick={handleAddFan} variant="contained" color="success">
        ✅ Saqlash
      </Button>
    </Grid>
  </Grid>
)}

      {step === "addCategory" && (
        <Grid container spacing={2}>
          <Grid item xs={3}sx={{width:'250px'}}>
            <FormControl fullWidth>
              <InputLabel>Fan tanlang</InputLabel>
              <Select value={selectedFanIndex} onChange={(e) => setSelectedFanIndex(e.target.value)}>
                {fanlar.map((f, i) => (
                  <MenuItem key={i} value={i}>{f[`nom_${language}`]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}><TextField label="Kategoriya (UZ)" fullWidth value={newCategory.nom_uz} onChange={e => setNewCategory({ ...newCategory, nom_uz: e.target.value })} /></Grid>
          <Grid item xs={3}><TextField label="Kategoriya (RU)" fullWidth value={newCategory.nom_ru} onChange={e => setNewCategory({ ...newCategory, nom_ru: e.target.value })} /></Grid>
          <Grid item xs={3}><TextField label="Kategoriya (EN)" fullWidth value={newCategory.nom_en} onChange={e => setNewCategory({ ...newCategory, nom_en: e.target.value })} /></Grid>
          <Grid item xs={12}><Button onClick={handleAddCategory}>✅ Saqlash</Button></Grid>
        </Grid>
      )}

      {step === "addMavzu" && (
        <Grid container spacing={2}>

          <Grid item xs={3} sx={{width:'250px'}}>
            <FormControl fullWidth>
              <InputLabel>Fan tanlang</InputLabel>
              <Select value={selectedFanIndex} onChange={(e) => setSelectedFanIndex(e.target.value)}>
                {fanlar.map((f, i) => (
                  <MenuItem key={i} value={i}>{f[`nom_${language}`]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}sx={{width:'250px'}}>
            <FormControl fullWidth>
              <InputLabel>Kategoriya tanlang</InputLabel>
              <Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                {fanlar[selectedFanIndex]?.categories.map((c, i) => (
                  <MenuItem key={i} value={c.name}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}><TextField label="Mavzu (UZ)" fullWidth value={newMavzu.nom_uz} onChange={e => setNewMavzu({ ...newMavzu, nom_uz: e.target.value })} /></Grid>
          <Grid item xs={3}><TextField label="Mavzu (RU)" fullWidth value={newMavzu.nom_ru} onChange={e => setNewMavzu({ ...newMavzu, nom_ru: e.target.value })} /></Grid>
          <Grid item xs={3}><TextField label="Mavzu (EN)" fullWidth value={newMavzu.nom_en} onChange={e => setNewMavzu({ ...newMavzu, nom_en: e.target.value })} /></Grid>
          <Grid item xs={3}><TextField label="Havola" fullWidth value={newMavzu.link} onChange={e => setNewMavzu({ ...newMavzu, link: e.target.value })} /></Grid>
          <Grid item xs={12}><Button onClick={handleAddMavzu}>✅ Saqlash</Button></Grid>
        </Grid>
      )}


<hr />

<Box sx={{ mt: 5 }}>
  {fanlar.map((fan, i) => (
    <Card
      key={i}
      onClick={() => toggleFan(i)}
      sx={{
        my: 2,
        cursor: "pointer",
        transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 6,
          transform: 'scale(1.01)'
        },
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{fan[`nom_${language}`]}</Typography>
          <Box>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateFan(i);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFan(i);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Stack>

        <Collapse in={openFanIndex === i} timeout="auto" unmountOnExit>
          {fan.categories.map((cat, j) => (
            <Box key={j} sx={{ mt: 1, ml: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(j);
                }}
                sx={{
                  cursor: "pointer",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  transition: 'background-color 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#f0f4ff',
                  },
                }}
              >
                <Typography variant="subtitle1" color="primary">📂 {cat.name}</Typography>
                {openCategoryIndex === j ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </Stack>

              <Collapse in={openCategoryIndex === j} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  pl: 3,
                  mt: 1,
                  mb: 1,
                }}
              >
                {cat.mavzular?.map((mavzu, k) => (
                  <Box
                    key={k}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                      color: "text.primary",
                      fontSize: "1rem",
                      transition: "all 0.2s ease-in-out",
                      '&:hover': {
                        fontWeight: 'bold',
                        color: 'primary.main',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Box component="span">
                      {k + 1}. {mavzu[`nom_${language}`]}
                      {mavzu.link && (
                        <a
                          href={mavzu.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            marginLeft: 8,
                            color: "#0d47a1",
                            textDecoration: "underline",
                          }}
                        >
                          [Link]
                        </a>
                      )}
                    </Box>
                  </Box>
                ))}

                {/* Kategoriya o‘chirish ikonkasi ham matn bilan yonma-yon */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(i, cat.id);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Collapse>



            </Box>
          ))}
        </Collapse>
      </CardContent>
    </Card>
  ))}
</Box>

    </Box>
  );
};

export default Fanlar;
