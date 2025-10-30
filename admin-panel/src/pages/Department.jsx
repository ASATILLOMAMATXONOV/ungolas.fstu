import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { BASE_API_URL } from "../config";


const Department = () => {
  const [data, setData] = useState({
    uz: { title: '', body: '', link: '' },
    ru: { title: '', body: '', link: '' },
    en: { title: '', body: '', link: '' },
  });
  const [savedData, setSavedData] = useState([]);
  const [expandedLang, setExpandedLang] = useState(null);

  const fetchData = () => {
    axios
      .get(`${BASE_API_URL}/api/department`)
      .then((res) => setSavedData(res.data))
      .catch((err) => console.error("❌ Barcha maʼlumotlarni olishda xato:", err));
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleChange = (lang, e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [name]: value,
      },
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const lang of ["uz", "ru", "en"]) {
        await axios.post(`${BASE_API_URL}/api/department`, {
          language: lang,
          ...data[lang],
        });
      }
      alert("✅ Barcha maʼlumotlar saqlandi");
      fetchData();
    } catch (err) {
      console.error("❌ Saqlashda xato:", err);
    }
  };

  const handleEdit = async (lang) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/api/department/${lang}`);
      if (res.data) {
        setData((prev) => ({
          ...prev,
          [lang]: {
            title: res.data.title,
            body: res.data.body,
            link: res.data.link,
          },
        }));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error(`❌ ${lang} ni tahrirlashda xato:`, err);
    }
  };
  
  const handleDelete = async (lang) => {
    try {
      await axios.delete(`${BASE_API_URL}/api/department/${lang}`);
      alert(`🗑️ ${lang.toUpperCase()} maʼlumot o‘chirildi`);
      fetchData();
    } catch (err) {
      console.error(`❌ ${lang} ni o‘chirishda xato:`, err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Admin Panel – Department Info (UZ, RU, EN)
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {['uz', 'ru', 'en'].map(lang => (
  <Collapse in={true} key={lang}>   {/* Har doim ochiq tursin */}
    <Box sx={{ mb: 5 }}>
      <Typography variant="h6" gutterBottom >
        {lang === 'uz' ? "O'zbekcha" : lang === 'ru' ? 'Русский' : 'English'}
      </Typography>

      <TextField
        fullWidth
        name="title"
        label="Title"
        value={data[lang].title}
        onChange={(e) => handleChange(lang, e)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        name="body"
        label="Body"
        multiline
        minRows={6}
        value={data[lang].body}
        onChange={(e) => handleChange(lang, e)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        name="link"
        label="Presentation Link"
        value={data[lang].link}
        onChange={(e) => handleChange(lang, e)}
        sx={{ mb: 2 }}
      />
    </Box>
  </Collapse>
))}


          <Button type="submit" variant="contained" color="primary">
            BARCHASINI SAQLASH
          </Button>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ mt: 5, p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Saqlangan Maʼlumotlar
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Kategoriya</TableCell>
                <TableCell>Sarlavha (UZ)</TableCell>
                <TableCell>Amallar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {savedData.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.language.toUpperCase()}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(item.language)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item.language)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Department;
