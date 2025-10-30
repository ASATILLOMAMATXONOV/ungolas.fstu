import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { BASE_API_URL } from "../config";

if (typeof window !== "undefined") {
  window.hljs = hljs;
}

const defaultCategories = [
  "THE DEPARTMENT",
  "RESEARCH",
  "TEACHING",
  "ACADEMIC INFOSTRUCTURE",
  "➕ FANLARGA MA'LUMOT QO‘SHISH",
  "➕ YANGI SAHIFA"
];

const Pages = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [titles, setTitles] = useState({ uz: "", ru: "", en: "" });
  const [contents, setContents] = useState({ uz: "", ru: "", en: "" });
  const [pageList, setPageList] = useState([]);
  const [menu, setMenu] = useState("");
  const [menuOptions, setMenuOptions] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);

  const [newPageData, setNewPageData] = useState({
    image_url: "",
    phone: "",
    email: "",
    scholar_link: "",
    position: "",
  });

  const fetchPages = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/api/pages/category/${encodeURIComponent(selectedCategory)}`);
      const data = await res.json();
      setPageList(data);
    } catch (err) {
      console.error("❌ Sahifalarni olishda xato:", err);
    }
  };

  const fetchMenus = async () => {
    if (!selectedCategory) return;
    try {
      const res = await fetch(`${BASE_API_URL}/api/pages/menus/${encodeURIComponent(selectedCategory)}`);
      const data = await res.json();
      setMenuOptions(data);
    } catch (err) {
      console.error("❌ Menyu olishda xato:", err);
    }
  };

  const fetchFanlar = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/api/fanlar`);
      const data = await res.json();
      console.log("📘 Fanlar ro‘yxati:", data);
  
      const normalized = data.map(fan => ({
        id: fan.id,
        title_uz: fan.nom_uz,
        title_ru: fan.nom_ru,
        title_en: fan.nom_en,
      }));
  
      setMenuOptions(normalized);
    } catch (err) {
      console.error("❌ Fanlarni olishda xato:", err);
    }
  };
  
  

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${BASE_API_URL}/api/newpages/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setNewPageData((prev) => ({
          ...prev,
          image_url: data.image_path,
        }));
        alert("✅ Rasm yuklandi!");
      } else {
        alert("❌ Rasm yuklashda xatolik");
      }
    } catch (err) {
      console.error("❌ Upload xato:", err);
    }
  };

const handleSave = async () => {
  if (!selectedCategory || (!titles.uz && !titles.ru && !titles.en)) {
    alert("❗ Sarlavha kiritilishi kerak.");
    return;
  }

  const payload = {
    title_uz: titles.uz,
    title_ru: titles.ru,
    title_en: titles.en,
    content_uz: contents.uz,
    content_ru: contents.ru,
    content_en: contents.en,
    image_url: newPageData.image_url,
    phone: newPageData.phone,
    email: newPageData.email,
    scholar_link: newPageData.scholar_link,
    position: newPageData.position,
    category: selectedCategory,
    menu: menu || "",
  };

  console.log("📤 Yuborilayotgan payload:", payload); // <--- Tekshiruv uchun

  const endpoint =
    selectedCategory === "➕ YANGI SAHIFA" || selectedCategory === "➕ FANLARGA MA'LUMOT QO‘SHISH"
      ? `${BASE_API_URL}/api/newpages`
      : `${BASE_API_URL}/api/pages`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("✅ Saqlandi!");
      setTitles({ uz: "", ru: "", en: "" });
      setContents({ uz: "", ru: "", en: "" });
      setNewPageData({ image_url: "", phone: "", email: "", scholar_link: "", position: "" });
      setMenu("");
      await fetchPages();
    } else {
      const errorData = await res.json();
      console.error("❌ Saqlashdagi xatolik:", errorData);
      alert("❌ Saqlashda xatolik: " + errorData.error);
    }
  } catch (err) {
    console.error("❌ Server xatosi:", err);
    alert("❌ Server xatoligi: " + err.message);
  }
};


  useEffect(() => {
    if (selectedCategory === "➕ FANLARGA MA'LUMOT QO‘SHISH") {
      fetchFanlar();
    } else if (["THE DEPARTMENT", "RESEARCH", "TEACHING", "ACADEMIC INFOSTRUCTURE"].includes(selectedCategory)) {
      fetchMenus();
    }
  }, [selectedCategory]);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">➕ FANLARGA MA'LUMOT QO‘SHISH</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...defaultCategories, ...customCategories.map(c => c.name)].map((cat, i) => (
          <button
            key={cat + i}
            className={`px-4 py-2 border rounded-xl font-semibold transition-all flex items-center gap-2 ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-50"}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="bg-white p-4 rounded-xl shadow space-y-6">
          <h3 className="text-lg font-semibold">
            {selectedCategory === "➕ FANLARGA MA'LUMOT QO‘SHISH"
              ? `${selectedCategory} - kontent kiritish`
              : `${selectedCategory} bo‘limidagi menyular:`}
          </h3>

          {selectedCategory === "➕ YANGI SAHIFA" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="file" accept="image/*" className="border p-2 rounded w-full"
                onChange={handleImageUpload} />
              <input type="text" placeholder="Telefon raqami" className="border p-2 rounded w-full"
                value={newPageData.phone} onChange={e => setNewPageData({ ...newPageData, phone: e.target.value })} />
              <input type="email" placeholder="Email manzili" className="border p-2 rounded w-full"
                value={newPageData.email} onChange={e => setNewPageData({ ...newPageData, email: e.target.value })} />
              <input type="text" placeholder="Google Scholar havolasi" className="border p-2 rounded w-full"
                value={newPageData.scholar_link} onChange={e => setNewPageData({ ...newPageData, scholar_link: e.target.value })} />
              <input type="text" placeholder="Lavozimi" className="border p-2 rounded w-full"
                value={newPageData.position} onChange={e => setNewPageData({ ...newPageData, position: e.target.value })} />
            </div>
          )}

          {selectedCategory !== "➕ YANGI SAHIFA" && (
            <select className="border p-2 rounded w-full" value={menu} onChange={e => setMenu(e.target.value)}>
              <option value="">Bo‘limni tanlang</option>
              {menuOptions.map((m, i) => (
  <option key={m.id || i} value={m.title_uz || m.title_en || m.title_ru}>
    {m.title_uz || m.title_en || m.title_ru}
  </option>
))}

            </select>
          )}

          {["uz", "ru", "en"].map((lang) => (
            <div key={lang}>
              <label className="font-medium text-sm block mb-1">
                {lang === "uz" ? "Sarlavha (Oʻzbekcha)" : lang === "ru" ? "Заголовок (Russian)" : "Title (English)"}
              </label>
              <input
                type="text"
                className="border p-2 rounded w-full mb-2"
                value={titles[lang] || ""}
                onChange={e => setTitles({ ...titles, [lang]: e.target.value })}
              />
              <label className="font-medium text-sm block mb-1">
                {lang === "uz" ? "Kontent (Oʻzbekcha)" : lang === "ru" ? "Контент (Russian)" : "Content (English)"}
              </label>
              <ReactQuill
                theme="snow"
                value={contents[lang] || ""}
                onChange={val => setContents({ ...contents, [lang]: val })}
                modules={quillModules}
                formats={quillFormats}
                style={{ height: "250px" }}
              />
              <br />
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Saqlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["link", "image", "video"],
      ["clean"]
    ]
  }
};

const quillFormats = [
  "header", "font", "size", "bold", "italic", "underline", "strike",
  "blockquote", "code-block", "list", "bullet", "script", "indent",
  "direction", "align", "color", "background", "link", "image", "video"
];

export default Pages;
