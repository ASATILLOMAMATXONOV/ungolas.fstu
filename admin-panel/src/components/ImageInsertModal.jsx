import React, { useState } from "react";

const ImageInsertModal = ({ onInsert, onClose }) => {
  const [width, setWidth] = useState("600");
  const [height, setHeight] = useState("400");
  const [file, setFile] = useState(null);

  const handleInsert = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onInsert(reader.result, width, height);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-lg font-bold">🖼 Rasm qo‘shish</h2>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <input
          type="text"
          placeholder="Kenglik (px)"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Balandlik (px)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Bekor qilish</button>
          <button onClick={handleInsert} className="px-4 py-2 bg-blue-600 text-white rounded">Qo‘shish</button>
        </div>
      </div>
    </div>
  );
};

export default ImageInsertModal;
