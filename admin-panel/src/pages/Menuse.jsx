import React, { useState, useEffect } from "react";
import { Trash2, Plus, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const Menus = () => {
  const [menuList, setMenuList] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  // Modal state
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    title_uz: "",
    title_ru: "",
    title_en: "",
  });

  const fetchMenus = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/menus`);
      const data = await res.json();

      let menus = [];
      if (Array.isArray(data)) {
        menus = data;
      } else if (Array.isArray(data.data)) {
        menus = data.data;
      }

      menus.sort((a, b) => a.id - b.id);
      setMenuList(menus);
    } catch (err) {
      console.error("❌ Yuklashda xato:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_API_URL}/menus/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchMenus();
      else alert("❌ O‘chirishda xato");
    } catch (err) {
      console.error("❌ Server xatosi:", err);
    }
  };

  // Edit tugmasi bosilganda modal ochiladi
  const handleEditOpen = (menu) => {
    setEditData(menu);
    setOpen(true);
  };

  const handleEditClose = () => {
    setOpen(false);
    setEditData({ id: null, title_uz: "", title_ru: "", title_en: "" });
  };

  const handleEditChange = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/menus/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        alert("✅ Menyu yangilandi!");
        handleEditClose();
        fetchMenus();
      } else {
        alert("❌ Yangilashda xato!");
      }
    } catch (err) {
      console.error("❌ Server xatosi:", err);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const truncateText = (text, maxLength = 15) => {
    if (!text) return "";
    const plainText = text.replace(/<\/?[^>]+(>|$)/g, "");
    return plainText.length > maxLength
      ? plainText.slice(0, maxLength) + "..."
      : plainText;
  };

  const paginatedData = menuList.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-700">📋 Menyular ro‘yxati</h2>
        <Button
          variant="contained"
          color="success"
          startIcon={<Plus size={18} />}
          onClick={() => navigate("/menus/add")}
        >
          Menu qo‘shish
        </Button>
      </div>

      {/* Content */}
      {menuList.length === 0 ? (
        <p className="text-gray-500 text-center">🚫 Hozircha menyu yo‘q</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>№</b></TableCell>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>UZ</b></TableCell>
                <TableCell><b>RU</b></TableCell>
                <TableCell><b>EN</b></TableCell>
                <TableCell align="right"><b>Amallar</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow
                  key={item.id}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#f0f4ff" } }}
                >
                  <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    {(page - 1) * rowsPerPage + index + 1}
                  </TableCell>

                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <Tooltip
                      title={<span dangerouslySetInnerHTML={{ __html: item.title_uz }} />}
                      arrow
                    >
                      <span>{truncateText(item.title_uz)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={<span dangerouslySetInnerHTML={{ __html: item.title_ru }} />}
                      arrow
                    >
                      <span>{truncateText(item.title_ru)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={<span dangerouslySetInnerHTML={{ __html: item.title_en }} />}
                      arrow
                    >
                      <span>{truncateText(item.title_en)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<Pencil size={16} />}
                      onClick={() => handleEditOpen(item)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Trash2 size={16} />}
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-center my-4">
            <Pagination
              count={Math.ceil(menuList.length / rowsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </div>
        </TableContainer>
      )}

      {/* 🔹 Edit Modal */}
      <Dialog open={open} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>Menyu tahrirlash</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField
            margin="dense"
            label="Title Uz"
            name="title_uz"
            value={editData.title_uz}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Title Ru"
            name="title_ru"
            value={editData.title_ru}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Title En"
            name="title_en"
            value={editData.title_en}
            onChange={handleEditChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">Bekor qilish</Button>
          <Button onClick={handleEditSave} color="primary" variant="contained">
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Menus;
