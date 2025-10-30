import React, { useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link as MuiLink,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import { Link } from "react-router-dom";
import { BASE_API_URL } from "../config";

const categoryMap = {
  "THE DEPARTMENT": "menus_department",
  "RESEARCH": "menus_research",
  "TEACHING": "menus_teaching",
  "ACADEMIC INFOSTRUCTURE": "menus_academic"
};

const Topmenu = () => {
  const [menus, setMenus] = useState({});
  const [loading, setLoading] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newLink, setNewLink] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState(null);

// Update fetchMenus function
const fetchMenus = async (tableName) => {
  setLoading(tableName);
  try {
    const res = await fetch(`${BASE_API_URL}/api/topmenu/${tableName}`);
    const data = await res.json();
    setMenus((prev) => ({ ...prev, [tableName]: data }));
  } catch (err) {
    console.error("❌ Ma'lumotlarni olishda xatolik:", err);
  } finally {
    setLoading(null);
  }
};


  const handleAccordionChange = (tableName) => (_, isExpanded) => {
    setExpandedAccordion(isExpanded ? tableName : null);
    if (isExpanded && !menus[tableName]) {
      fetchMenus(tableName);
    }
  };

// Update handleSaveLink function
const handleSaveLink = async () => {
  const { id, tableName } = selectedItem;
  try {
    await fetch(`${BASE_API_URL}/api/topmenu/${tableName}/${id}/link`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link: newLink }),
    });
    fetchMenus(tableName);
    setOpenDialog(false);
  } catch (err) {
    console.error("❌ Linkni saqlashda xato:", err);
  }
};


// Update handleDelete function
const handleDelete = async (tableName, id) => {
  if (!window.confirm("❗ Rostdan ham ushbu menyuga biriktirilgan linkni o‘chirmoqchimisiz?")) return;
  try {
    await fetch(`${BASE_API_URL}/api/topmenu/${tableName}/${id}/unlink`, {
      method: "PATCH",
    });
    fetchMenus(tableName);
  } catch (err) {
    console.error("❌ Linkni o‘chirishda xato:", err);
  }
};

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <Typography variant="h5" gutterBottom>
        📂 Kategoriyalar va Menyular
      </Typography>

      {Object.entries(categoryMap).map(([label, tableName]) => (
        <Accordion
          key={tableName}
          expanded={expandedAccordion === tableName}
          onChange={handleAccordionChange(tableName)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{label}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            {loading === tableName ? (
              <CircularProgress />
            ) : menus[tableName]?.length > 0 ? (
              menus[tableName].map((item) => (
                <Box
                  key={item.id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  borderBottom="1px dashed #ddd"
                  py={1}
                >
                  <MuiLink
                    component={Link}
                    to={item.link || "#"}
                    underline="hover"
                    target="_blank"
                    sx={{ fontSize: "1rem", fontWeight: 500 }}
                    onClick={(e) => {
                      if (!item.link) {
                        e.preventDefault();
                        setSelectedItem({ id: item.id, tableName });
                        setNewLink("");
                        setOpenDialog(true);
                      }
                    }}
                  >
                    🔗 {item.title_uz}
                  </MuiLink>

                  <Box display="flex" gap={1}>
                    <Tooltip title={item.link ? "Linkni o‘zgartirish" : "Link biriktirish"}>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedItem({ id: item.id, tableName });
                          setNewLink(item.link || "");
                          setOpenDialog(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    {item.link && (
                      <Tooltip title="Linkga o‘tish">
                        <IconButton
                          component="a"
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {item.link && (
                      <Tooltip title="Biriktirilgan linkni o‘chirish">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(tableName, item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2">❗Menyular topilmadi.</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>🔗 Linkni o‘zgartirish</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Yangi link"
            type="url"
            fullWidth
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Bekor</Button>
          <Button onClick={handleSaveLink} variant="contained">
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Topmenu;
