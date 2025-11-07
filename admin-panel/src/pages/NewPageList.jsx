import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Stack,
  CircularProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../config";

const ITEMS_PER_PAGE = 5;

const NewPageList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // 🔹 Backend’dan ma’lumotlarni olish
  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/new-pages`);
      const data = await res.json();
      setPages(data);
    } catch (err) {
      console.error("❌ Ma'lumotlarni olishda xato:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Ma’lumotni o‘chirish
  const handleDelete = async (id) => {
    if (!window.confirm("Ushbu sahifani o‘chirmoqchimisiz?")) return;
    try {
      await fetch(`${BASE_API_URL}/new-pages/${id}`, { method: "DELETE" });
      setPages((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("❌ O‘chirishda xato:", err);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // 🔹 Pagination hisoblash
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedPages = pages.slice(startIndex, endIndex);
  const totalPages = Math.ceil(pages.length / ITEMS_PER_PAGE);

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }} elevation={3}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight="bold">
            🧾 Yangi Sahifalar
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/new-pages/create")}
          >
            Yangi qo‘shish
          </Button>
        </Stack>

        {/* Content */}
        {loading ? (
          <Box textAlign="center" my={4}>
            <CircularProgress />
          </Box>
        ) : pages.length === 0 ? (
          <Typography>Hozircha sahifalar yo‘q.</Typography>
        ) : (
          <>
            {/* ✅ Jadval shaklida */}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Sarlavha (UZ)</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Qisqacha matn</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Amal
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedPages.map((pageItem) => (
                  <TableRow
                    key={pageItem.id}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "#f9f9f9" },
                    }}
                  >
                    <TableCell>{pageItem.id}</TableCell>
                    <TableCell>{pageItem.title_uz || "—"}</TableCell>
                    <TableCell sx={{ maxWidth: "300px" }}>
                      {pageItem.content_uz
                        ?.replace(/<[^>]+>/g, "")
                        .slice(0, 80) || "Matn mavjud emas..."}
                      ...
                    </TableCell>
                    <TableCell align="right">
                      {/* 👁 Ko‘rish */}
                      {/* <IconButton
                          color="success"
                          onClick={() => navigate(`/new-pages/${pageItem.id}`)}
                        >
                          <Visibility />
                        </IconButton> */}


                      {/* ✏️ Tahrirlash */}
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(`/new-pages/edit/${pageItem.id}`)
                        }
                      >
                        <Edit />
                      </IconButton>

                      {/* 🗑 O‘chirish */}
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(pageItem.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontWeight: "bold",
                  },
                }}
              />
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default NewPageList;
