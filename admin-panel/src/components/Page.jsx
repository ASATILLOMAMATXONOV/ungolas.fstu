import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { BASE_API_URL } from "../config"; 


if (typeof window !== "undefined") {
  window.hljs = hljs;
}

const categories = [
  "THE DEPARTMENT",
  "RESEARCH",
  "TEACHING",
  "ACADEMIC INFOSTRUCTURE"
];

const Pages = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [titles, setTitles] = useState({ uz: "", ru: "", en: "" });
  const [contents, setContents] = useState({ uz: "", ru: "", en: "" });
  const [pageList, setPageList] = useState([]);
  const [menu, setMenu] = useState("");
  const [menuOptions, setMenuOptions] = useState([]);

  useEffect(() => {
    if (selectedCategory) {
      fetchPages();
      fetchMenus();
    }
  }, [selectedCategory]);

  const fetchPages = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/api/pages/${encodeURIComponent(selectedCategory)}`);
      const data = await res.json();
      setPageList(data);
    } catch (err) {
      console.error("❌ Sahifalarni olishda xatolik:", err);
    }
  };

  const fetchMenus = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/api/pages/menus/${encodeURIComponent(selectedCategory)}`);
      const data = await res.json();
      setMenuOptions(data);
    } catch (err) {
      console.error("❌ Menyularni olishda xatolik:", err);
    }
  };
  

  const handleSave = async () => {
    const payload = {
      category: selectedCategory,
      menu,
      title_uz: titles.uz,
      title_ru: titles.ru,
      title_en: titles.en,
      content_uz: contents.uz,
      content_ru: contents.ru,
      content_en: contents.en,
    };


    try {
      const res = await fetch(`${BASE_API_URL}/api/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (res.ok) {
        alert("✅ Saqlandi!");
        setTitles({ uz: "", ru: "", en: "" });
        setContents({ uz: "", ru: "", en: "" });
        fetchPages();
      } else {
        alert("❌ Saqlashda xatolik!");
      }
    } catch (err) {
      console.error("❌ Server xatosi:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">📄 Pages</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 border rounded-xl font-semibold ${
              selectedCategory === cat ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-50"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <>
          <div className="space-y-4 bg-white p-4 rounded shadow">
            <label className="block font-semibold mb-1">Menyu tanlang:</label>
            <select
              className="border p-2 rounded w-full"
              value={menu}
              onChange={(e) => setMenu(e.target.value)}
            >
              <option value="">➤ Menyu</option>
              {menuOptions.map((m) => (
                <option key={m.id} value={m.title_en || m.title_uz || m.id}>
                  {m.title_en || m.title_uz || `Menu #${m.id}`}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-6 bg-white p-4 rounded shadow">
            {["uz", "ru", "en"].map((lang) => (
              <div key={lang}>
                <label className="block font-medium mb-1">
                  {lang === "uz" ? "Sarlavha (O‘zbek)" : lang === "ru" ? "Заголовок (Русский)" : "Title (English)"}
                </label>
                <input
                  type="text"
                  value={titles[lang]}
                  onChange={(e) => setTitles({ ...titles, [lang]: e.target.value })}
                  className="border p-2 rounded w-full mb-3"
                />
                <ReactQuill
                  theme="snow"
                  value={contents[lang]}
                  onChange={(val) => setContents({ ...contents, [lang]: val })}
                  modules={quillModules}
                  formats={quillFormats}
                  style={{ height: "250px" }}
                />
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Saqlash
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"]
  ]
};
const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "image"
];
export default Pages;
