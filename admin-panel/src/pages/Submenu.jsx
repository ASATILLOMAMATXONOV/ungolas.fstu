import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../config";

const Submenu = () => {
  const { id } = useParams(); // parent menu id
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // 📌 menu_items larni olish
  useEffect(() => {
    const url = id
      ? `${BASE_API_URL}/submenu/menu/${id}`   // Agar id bo‘lsa → menuga bog‘langan itemlar
      : `${BASE_API_URL}/submenu`;            // Agar id bo‘lmasa → barcha itemlar

    fetch(url)
      .then((res) => res.json())
      .then((data) => setItems(data || []))
      .catch((err) => console.error("❌ Submenu olishda xato:", err));
  }, [id]);

  // 📌 Delete item
  const handleDelete = async (itemId) => {
    if (window.confirm("❌ Rostdan ham o‘chirmoqchimisiz?")) {
      try {
        const res = await fetch(`${BASE_API_URL}/menu_items/${itemId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setItems(items.filter((item) => item.id !== itemId));
        } else {
          alert("❌ O‘chirishda xato");
        }
      } catch (err) {
        console.error("❌ O‘chirishda xato:", err);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          📑 Submenu Items
        </Typography>

        <Button
          variant="contained"
          color="success"
          sx={{ mb: 2 }}
          onClick={() => navigate(`/menu_items/add/${id}`)}
        >
          ➕ Yangi Item
        </Button>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Title (Uz)</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.title_uz}</TableCell>
                    <TableCell align="center">
                     <IconButton
  color="primary"
  onClick={() => navigate(`/menusFrom/${item.id}`)} // ✅ Edit uchun to‘g‘ri route
>
  <EditIcon />
</IconButton>
<IconButton
  color="error"
  onClick={() => handleDelete(item.id)}
>
  <DeleteIcon />
</IconButton>

                     
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    ❌ Hech qanday item topilmadi
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Submenu;
