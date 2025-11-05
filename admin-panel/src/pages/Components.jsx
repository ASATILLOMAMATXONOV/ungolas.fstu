import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Delete, Add } from "@mui/icons-material";
import { BASE_API_URL } from "../config";

const ComponentsPage = () => {
  const [components, setComponents] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 📥 Komponentlarni olish
  const fetchComponents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/components`);
      const data = await res.json();
      setComponents(data);
    } catch (err) {
      console.error("❌ Ma’lumotlarni olishda xato:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  // ❌ O‘chirish
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_API_URL}/components/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchComponents();
      } else {
        console.error("❌ O‘chirishda xato!");
      }
    } catch (err) {
      console.error("❌ Server bilan aloqa yo‘q:", err);
    }
  };

  // 🔍 Qidirish (UZ, RU, EN bo‘yicha)
  const filtered = components.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.title_uz?.toLowerCase().includes(q) ||
      item.title_ru?.toLowerCase().includes(q) ||
      item.title_en?.toLowerCase().includes(q)
    );
  });

  // Pagenatsiya
  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        spacing={2}
      >
        <Typography variant="h5" fontWeight="bold">
          🧩 Komponentlar ro‘yxati
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="🔍 Qidiruv (UZ/RU/EN)"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/components/create")} // ✅ ComponentCrud ochiladi
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              fontWeight: 500,
            }}
          >
            Komponent qo‘shish
          </Button>
        </Stack>
      </Stack>

      {/* Table */}
      <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nomi (UZ)</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Amal
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  ⏳ Yuklanmoqda...
                </TableCell>
              </TableRow>
            ) : paginated.length > 0 ? (
              paginated.map((component) => (
                <TableRow key={component.id} hover>
                  <TableCell>{component.id}</TableCell>
                  <TableCell>{component.title_uz}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Tahrirlash">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/components/edit/${component.id}`)}
                          sx={{ backgroundColor: "#e3f2fd", "&:hover": { backgroundColor: "#bbdefb" } }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="O‘chirish">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(component.id)}
                          sx={{ backgroundColor: "#ffebee", "&:hover": { backgroundColor: "#ffcdd2" } }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  ❗ Hech qanday komponent yo‘q
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[10]}
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
};

export default ComponentsPage;
