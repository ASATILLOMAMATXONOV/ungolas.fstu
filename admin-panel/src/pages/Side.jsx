import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../assets/style/sidepanel.css";
import { BASE_API_URL } from "../config"; 


const Side = () => {
  const [contentUz, setContentUz] = useState("");
  const [contentRu, setContentRu] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editUz, setEditUz] = useState("");
  const [editRu, setEditRu] = useState("");
  const [editEn, setEditEn] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);


  const fetchItems = async () => {
    try {
      const res = await axios.get(`${BASE_API_URL}/api/sidepanels`);
      setItems(res.data);
    } catch (err) {
      console.error("❌ Yon panel elementlarini olishda xato:", err);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_API_URL}/api/sidepanels`, {
        content_uz: contentUz,
        content_ru: contentRu,
        content_en: contentEn,
      });
      setContentUz("");
      setContentRu("");
      setContentEn("");
      fetchItems();
    } catch (error) {
      console.error("❌ Saqlashda xato:", error);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditUz(item.content_uz);
    setEditRu(item.content_ru);
    setEditEn(item.content_en);
  };

const handleUpdate = async () => {
  try {
    await axios.put(`${BASE_API_URL}/api/sidepanels/${editId}`, {
      content_uz: editUz,
      content_ru: editRu,
      content_en: editEn,
    });
    setEditId(null);
    setEditUz("");
    setEditRu("");
    setEditEn("");
    fetchItems();
  } catch (error) {
    console.error("❌ Yangilashda xato:", error);
  }
};

const handleDelete = async (id) => {
  try {
    await axios.delete(`${BASE_API_URL}/api/sidepanels/${id}`);
    fetchItems();
  } catch (err) {
    console.error("❌ O‘chirishda xato:", err);
  }
};

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "clean",
  ];

  const editorStyle = {
    height: "400px",
    marginBottom: "30px",
  };

  return (
    <div className="sidepage-container">
      <h2 className="text-2xl font-bold mb-4">📌 Yon Panel Ma’lumotini Qo‘shish</h2>
      <form onSubmit={handleSubmit} className="side-form">
        <div className="form-group">
          <label>Kontent (O‘zbekcha):</label>
          <ReactQuill
            theme="snow"
            value={contentUz}
            onChange={setContentUz}
            modules={quillModules}
            formats={quillFormats}
            style={editorStyle}
          />
        </div>
        <br />
        <div className="form-group">
          <label>Контент (Русский):</label>
          <ReactQuill
            theme="snow"
            value={contentRu}
            onChange={setContentRu}
            modules={quillModules}
            formats={quillFormats}
            style={editorStyle}
          />
        </div>
        <br />
        <div className="form-group">
          <label>Content (English):</label>
          <ReactQuill
            theme="snow"
            value={contentEn}
            onChange={setContentEn}
            modules={quillModules}
            formats={quillFormats}
            style={editorStyle}
          />
        </div>
        <br />
        <button type="submit" className="submit-btn">💾 Saqlash</button>
      </form>

      <div className="side-list">
        <h3 className="text-2xl font-bold mb-4">📋 Kiritilgan Ma’lumotlar</h3>

        <div className="table-container">
          <table className="side-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>O‘zbekcha</th>
                <th>Русский</th>
                <th>English</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {editId === item.id ? (
                      <ReactQuill
                        theme="snow"
                        value={editUz}
                        onChange={setEditUz}
                        modules={quillModules}
                        formats={quillFormats}
                        style={editorStyle}
                      />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: item.content_uz }} />
                    )}
                  </td>
                  <td>
                    {editId === item.id ? (
                      <ReactQuill
                        theme="snow"
                        value={editRu}
                        onChange={setEditRu}
                        modules={quillModules}
                        formats={quillFormats}
                        style={editorStyle}
                      />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: item.content_ru }} />
                    )}
                  </td>
                  <td>
                    {editId === item.id ? (
                      <ReactQuill
                        theme="snow"
                        value={editEn}
                        onChange={setEditEn}
                        modules={quillModules}
                        formats={quillFormats}
                        style={editorStyle}
                      />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: item.content_en }} />
                    )}
                  </td>
                  <td>
                    {editId === item.id ? (
                      <>
                        <button onClick={handleUpdate}>✅</button>
                        <button onClick={() => setEditId(null)}>❌</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(item)}>✏️</button>
                        <button onClick={() => handleDelete(item.id)}>🗑️</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Side;