// src/pages/EditPanel.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../config";


const EditPanel = () => {
  const { id, category } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({ uz: "", ru: "", en: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/menus/${encodeURIComponent(category)}/${id}`);
        const item = await res.json();
  
        if (item && item.title_uz) {
          setValues({
            uz: item.title_uz,
            ru: item.title_ru,
            en: item.title_en,
          });
        } else {
          alert("Ma'lumot topilmadi");
          navigate("/menus");
        }
      } catch (err) {
        console.error("❌ Yuklashda xato:", err);
        alert("❌ Server bilan aloqa yo‘q");
      }
    };

    fetchData();
  }, [id, category, navigate]);
  
  const handleUpdate = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/api/menus/${encodeURIComponent(category)}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
  
      if (res.ok) {
        alert("✅ Ma'lumot yangilandi");
        navigate("/menus");
      } else {
        alert("❌ Yangilab bo‘lmadi");
      }
    } catch (err) {
      console.error("❌ Xatolik:", err);
      alert("❌ Serverga ulanishda xato");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-800">
          Menyuni tahrirlash (ID: {id}, Bo‘lim: {category})
        </h2>

        <div>
          <label className="block text-sm font-medium">O‘zbekcha</label>
          <input
            value={values.uz}
            onChange={(e) => setValues({ ...values, uz: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Русский</label>
          <input
            value={values.ru}
            onChange={(e) => setValues({ ...values, ru: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">English</label>
          <input
            value={values.en}
            onChange={(e) => setValues({ ...values, en: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/menus")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPanel;