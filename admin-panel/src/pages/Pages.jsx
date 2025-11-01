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

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔹 Ma’lumotlarni olish
  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/pages`);
      const data = await res.json();
      setPages(data);
    } catch (err) {
      console.error("❌ Ma’lumotlarni olishda xatolik:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // 🔹 O‘chirish
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_API_URL}/pages/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchPages();
      } else {
        console.error("❌ O‘chirishda xatolik!");
      }
    } catch (err) {
      console.error("❌ Server bilan aloqa yo‘q:", err);
    }
  };

  // 🔍 Qidiruv (faqat title_uz bo‘yicha)
  const filteredPages = pages.filter((page) =>
    page.title_uz?.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Sahifalash
  const paginatedPages = filteredPages.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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
          📄 Sahifalar ro‘yxati
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="🔍 Qidiruv (UZ)"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/PageCrud")}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              fontWeight: 500,
            }}
          >
            Sahifa qo‘shish
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
              <TableCell sx={{ fontWeight: "bold", width: "10%" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "70%" }}>
                Sarlavha (UZ)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", width: "20%" }}>
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
            ) : paginatedPages.length > 0 ? (
              paginatedPages.map((pageItem) => (
                <TableRow
                  key={pageItem.id}
                  hover
                  sx={{
                    "&:hover": { backgroundColor: "#f9f9f9" },
                  }}
                >
                  <TableCell>{pageItem.id}</TableCell>
                  <TableCell>
                    <Typography fontWeight="500">
                      {pageItem.title_uz}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                      <Tooltip title="Tahrirlash">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/pages/edit/${pageItem.id}`)}
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
                          onClick={() => handleDelete(pageItem.id)}
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
                  ❗ Hech qanday sahifa topilmadi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* --- PAGINATION --- */}
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={filteredPages.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
};

export default Pages;
