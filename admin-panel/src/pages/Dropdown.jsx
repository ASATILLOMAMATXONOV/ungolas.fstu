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

const Dropdown = () => {
  const [submenus, setSubmenus] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔹 Submenyularni olish
  const fetchSubmenus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/submenus`);
      const data = await res.json();
      setSubmenus(data);
    } catch (err) {
      console.error("❌ Ma’lumotlarni olishda xato:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmenus();
  }, []);

  // 🔹 O‘chirish
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_API_URL}/submenus/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchSubmenus();
      } else {
        console.error("❌ O‘chirishda xato!");
      }
    } catch (err) {
      console.error("❌ Server bilan aloqa yo‘q:", err);
    }
  };

  // 🔍 Qidiruv
  const filteredSubmenus = submenus.filter((submenu) => {
    const query = search.toLowerCase();
    return (
      submenu.title_uz?.toLowerCase().includes(query) ||
      submenu.title_ru?.toLowerCase().includes(query) ||
      submenu.title_en?.toLowerCase().includes(query) ||
      submenu.menu?.title_uz?.toLowerCase().includes(query)
    );
  });

  // 🔹 Sahifalash
  const paginatedSubmenus = filteredSubmenus.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => setPage(newPage);

  return (
    <Box sx={{ p: 4 }}>
      {/* --- HEADER --- */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        mb={3}
        spacing={2}
      >
        <Typography variant="h5" fontWeight="bold">
          📋 Submenyular ro‘yxati
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
            onClick={() => navigate("/Dropdowns")}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              fontWeight: 500,
            }}
          >
            Submenyu qo‘shish
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
              <TableCell sx={{ fontWeight: "bold", width: "5%" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                Asosiy menyu
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "35%" }}>
                Submenyu (UZ)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", width: "30%" }}>
                Amal
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  ⏳ Yuklanmoqda...
                </TableCell>
              </TableRow>
            ) : paginatedSubmenus.length > 0 ? (
              paginatedSubmenus.map((submenu) => (
                <TableRow
                  key={submenu.id}
                  hover
                  sx={{
                    "&:hover": { backgroundColor: "#f9f9f9" },
                  }}
                >
                  <TableCell>{submenu.id}</TableCell>

                  {/* 🔹 Asosiy menyu nomi */}
                  <TableCell>
                    <Typography fontWeight="500" color="primary">
                      {submenu.menu
                        ? submenu.menu.title_uz
                        : "❌ Biriktirilmagan"}
                    </Typography>
                  </TableCell>

                  {/* 🔹 Submenyu nomi */}
                  <TableCell>
                    <Typography fontWeight="500">
                      {submenu.title_uz}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                      <Tooltip title="Tahrirlash">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/submenus/edit/${submenu.id}`)
                          }
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
                          onClick={() => handleDelete(submenu.id)}
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
                <TableCell colSpan={4} align="center">
                  ❗ Hech qanday submenyu topilmadi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* --- PAGINATION --- */}
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={filteredSubmenus.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
};

export default Dropdown;
