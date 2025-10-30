import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/style/Newbut.css";
import { BASE_API_URL } from "../config"; 


const Newbut = () => {
  const [labelUz, setLabelUz] = useState("");
  const [labelRu, setLabelRu] = useState("");
  const [labelEn, setLabelEn] = useState("");
  const [displayUrl, setDisplayUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [buttons, setButtons] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editLabelUz, setEditLabelUz] = useState("");
  const [editLabelRu, setEditLabelRu] = useState("");
  const [editLabelEn, setEditLabelEn] = useState("");
  const [editDisplayUrl, setEditDisplayUrl] = useState("");
  const [editLinkUrl, setEditLinkUrl] = useState("");

  useEffect(() => {
    fetchButtons();
  }, []);

  const fetchButtons = async () => {
    try {
      const res = await axios.get(`${BASE_API_URL}/api/buttons`);
      setButtons(res.data);
    } catch (err) {
      console.error("❌ Tugmalarni olishda xato:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        label_uz: labelUz,
        label_ru: labelRu,
        label_en: labelEn,
        display_url: displayUrl,
        link_url: linkUrl,
      };
      await axios.post(`${BASE_API_URL}/api/buttons`, body);
      alert("✅ Tugma qo‘shildi!");
      setLabelUz("");
      setLabelRu("");
      setLabelEn("");
      setDisplayUrl("");
      setLinkUrl("");
      fetchButtons();
    } catch (error) {
      console.error("❌ Saqlashda xato:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_API_URL}/api/buttons/${id}`);
      fetchButtons();
    } catch (err) {
      console.error("❌ O‘chirishda xato:", err);
    }
  };

  const handleEdit = (btn) => {
    setEditId(btn.id);
    setEditLabelUz(btn.label_uz);
    setEditLabelRu(btn.label_ru);
    setEditLabelEn(btn.label_en);
    setEditDisplayUrl(btn.display_url);
    setEditLinkUrl(btn.link_url);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_API_URL}/api/buttons/${editId}`, {
        label_uz: editLabelUz,
        label_ru: editLabelRu,
        label_en: editLabelEn,
        display_url: editDisplayUrl,
        link_url: editLinkUrl,
      });
      alert("✅ Tugma yangilandi!");
      setEditId(null);
      setEditLabelUz("");
      setEditLabelRu("");
      setEditLabelEn("");
      setEditDisplayUrl("");
      setEditLinkUrl("");
      fetchButtons();
    } catch (error) {
      console.error("❌ Yangilashda xato:", error);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditLabelUz("");
    setEditLabelRu("");
    setEditLabelEn("");
    setEditDisplayUrl("");
    setEditLinkUrl("");
  };

  return (
    <div className="newbut-container">
      <h2>🔘 Yangi Tugma Qo‘shish</h2>
      <form onSubmit={handleSubmit} className="newbut-form">
        <div className="form-group">
          <label>Tugma Nomi (UZ):</label>
          <input
            type="text"
            value={labelUz}
            onChange={(e) => setLabelUz(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Tugma Nomi (RU):</label>
          <input
            type="text"
            value={labelRu}
            onChange={(e) => setLabelRu(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Tugma Nomi (EN):</label>
          <input
            type="text"
            value={labelEn}
            onChange={(e) => setLabelEn(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Qaysi sahifada chiqadi (display_url):</label>
          <input
            type="text"
            placeholder="Masalan: PROGRAMS"
            value={displayUrl}
            onChange={(e) => setDisplayUrl(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Ochilishi kerak bo‘lgan real link (link_url):</label>
          <input
            type="text"
            placeholder="Masalan: /pages/program-details yoki https://external.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          ➕ Qo‘shish
        </button>
      </form>

      <h3 style={{ marginTop: "30px" }}>🔘 Mavjud tugmalar:</h3>
      <div className="button-list-grid">
        {buttons.map((btn) => (
          <div key={btn.id} className="button-card">
            {editId === btn.id ? (
              <div className="edit-card">
                <input
                  type="text"
                  value={editLabelUz}
                  onChange={(e) => setEditLabelUz(e.target.value)}
                  placeholder="Tugma nomi (UZ)"
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editLabelRu}
                  onChange={(e) => setEditLabelRu(e.target.value)}
                  placeholder="Tugma nomi (RU)"
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editLabelEn}
                  onChange={(e) => setEditLabelEn(e.target.value)}
                  placeholder="Tugma nomi (EN)"
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editDisplayUrl}
                  onChange={(e) => setEditDisplayUrl(e.target.value)}
                  placeholder="Display url"
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editLinkUrl}
                  onChange={(e) => setEditLinkUrl(e.target.value)}
                  placeholder="Link url"
                  className="edit-input"
                />
                <div className="edit-actions">
                  <button onClick={handleUpdate} className="save-btn">💾 Saqlash</button>
                  <button onClick={cancelEdit} className="cancel-btn">↩️ Bekor qilish</button>
                </div>
              </div>
            ) : (
              <>
                <div className="button-card-header">
                  <span className="button-label">🔗 <b>{btn.label_uz}</b> | <b>{btn.label_ru}</b> | <b>{btn.label_en}</b></span>
                  <div className="button-actions">
                    <button onClick={() => handleEdit(btn)} className="edit-btn">✏️</button>
                    <button onClick={() => handleDelete(btn.id)} className="delete-btn">❌</button>
                  </div>
                </div>
                <div className="button-card-body">
                  <p><strong>Menu:</strong> <code>{btn.display_url}</code></p>
                  <p>
                    <strong>Ochiladigan sahifa:</strong>{" "}
                    <a href={btn.link_url} target="_blank" rel="noopener noreferrer">
                      {btn.link_url}
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Newbut;