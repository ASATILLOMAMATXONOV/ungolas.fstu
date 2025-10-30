import React, { useState, useEffect } from "react";
import { BASE_API_URL, BASE_URL } from "../config";

const Menus = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [allBanners, setAllBanners] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

const handleUpload = async () => {
  if (!selectedImage) {
    alert("❗ Iltimos, rasm tanlang.");
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedImage);
  formData.append("title", title);          // ✅ qo‘shildi
  formData.append("description", description); // ✅ qo‘shildi

  try {
    const res = await fetch(`${BASE_API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("✅ Rasm va ma’lumot SQL ga saqlandi!");
      setSelectedImage(null);
      setPreviewUrl(null);
      setTitle("");
      setDescription("");
      fetchAllBanners();
    } else {
      const errorText = await res.text();
      alert("❌ Yuklashda xato: " + errorText);
    }
  } catch (error) {
    alert("❌ Tarmoq xatosi: " + error.message);
  }
};


  const fetchAllBanners = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/banners`);
      if (res.ok) {
        const data = await res.json();
        setAllBanners(data);
      }
    } catch (error) {
      console.error("❌ Bannerlarni olishda xato:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_API_URL}/banners/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("🗑 Rasm o‘chirildi");
        fetchAllBanners();
      } else {
        const errorText = await res.text();
        alert("❌ O‘chirishda xato: " + errorText);
      }
    } catch (error) {
      alert("❌ Server bilan bog‘lanishda xatolik");
    }
  };

  useEffect(() => {
    fetchAllBanners();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">🖼 Rasm Yuklash</h2>

      <div className="space-y-4">
       <input
          type="text"
          placeholder="Sarlavha (title)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block border p-2 rounded w-full"
        />
        <textarea
          placeholder="Tavsif (description)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block border p-2 rounded w-full"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block"
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Ko‘rib chiqish"
            className="max-w-md rounded-md border shadow"
          />
        )}

        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Yuklash
        </button>
      </div>

      <hr className="my-6 border-t-2 border-gray-300" />

      <h3 className="text-xl font-semibold text-gray-800">📦 Saqlangan Rasmlar</h3>
      {allBanners.length > 0 ? (
        allBanners.map((banner) => (
          <div
            key={banner.id}
            className="border border-gray-300 rounded-md p-4 mb-6 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-700 font-mono">🆔 ID: {banner.id}</p>
              <button
                onClick={() => handleDelete(banner.id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                🗑 O‘chirish
              </button>
            </div>
            <h4 className="font-bold">{banner.title}</h4>
            <p className="text-gray-600">{banner.description}</p>
            <img
              src={`${BASE_URL}${banner.image_url}`}
              alt="Banner"
              style={{ maxWidth: "30%", borderRadius: "8px" }}
            />
          </div>
        ))
      ) : (
        <p className="text-gray-500">Hech qanday rasm mavjud emas.</p>
      )}
    </div>
  );
};

export default Menus;
