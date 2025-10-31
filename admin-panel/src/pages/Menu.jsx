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

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔹 Ma’lumotlarni olish
  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/menus`);
      const data = await res.json();
      setMenus(data);
    } catch (err) {
      console.error("❌ Ma’lumotlarni olishda xatolik:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // 🔹 O‘chirish (alert va confirm yo‘q)
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_API_URL}/menus/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Faqat jadvalni yangilaymiz — alert yo‘q
        fetchMenus();
      } else {
        console.error("❌ O‘chirishda xatolik!");
      }
    } catch (err) {
      console.error("❌ Server bilan aloqa yo‘q:", err);
    }
  };

  // 🔍 Qidiruv natijalarini filtrlash (UZ, RU, EN)
  const filteredMenus = menus.filter((menu) => {
    const query = search.toLowerCase();
    return (
      menu.title_uz?.toLowerCase().includes(query) ||
      menu.title_ru?.toLowerCase().includes(query) ||
      menu.title_en?.toLowerCase().includes(query)
    );
  });

  // 🔹 Pagenatsiya uchun sahifalangan ma’lumotlar
  const paginatedMenus = filteredMenus.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* --- HEADER (Search + Add) --- */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        mb={3}
        spacing={2}
      >
        <Typography variant="h5" fontWeight="bold">
          📋 Menular ro‘yxati
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="🔍 Qidiruv (UZ / RU / EN)"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/menus")}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              fontWeight: 500,
            }}
          >
            Menu qo‘shish
          </Button>
        </Stack>
      </Stack>

      {/* --- TABLE --- */}
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold", width: "5%" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "60%" }}>
                Sarlavha (UZ)
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", width: "35%" }}
              >
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
            ) : paginatedMenus.length > 0 ? (
              paginatedMenus.map((menu, index) => (
                <TableRow
                  key={menu.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f9f9f9",
                    },
                  }}
                >
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Typography fontWeight="500">{menu.title_uz}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                      <Tooltip title="Tahrirlash">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/menus/edit/${menu.id}`)}
                          sx={{
                            backgroundColor: "#e3f2fd",
                            "&:hover": { backgroundColor: "#bbdefb" },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="O‘chirish">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(menu.id)}
                          sx={{
                            backgroundColor: "#ffebee",
                            "&:hover": { backgroundColor: "#ffcdd2" },
                          }}
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
                  ❗ Hech qanday menyu topilmadi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* --- PAGINATION --- */}
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={filteredMenus.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
};

export default Menu;
