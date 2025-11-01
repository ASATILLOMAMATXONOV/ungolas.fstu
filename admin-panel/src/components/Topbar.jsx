import React, { useState, useRef, useEffect } from "react";
import { UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Dropdown tashqarisiga bosilganda yopish
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Chiqish funksiyasi
  const handleLogout = () => {
    localStorage.removeItem("token"); // Tokenni o‘chiradi
    navigate("/login"); // Login sahifasiga yo‘naltiradi
  };

  return (
    <header className="bg-white shadow px-4 py-2 flex items-center justify-between relative">
      {/* Logo yoki sarlavha */}
      <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>

      {/* Foydalanuvchi ikon */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <UserCircle size={26} className="text-gray-600" />
        </button>

        {/* 🔽 Dropdown menyu */}
        {open && (
          <div
            className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <div className="px-3 py-2 text-gray-600 text-sm border-b">
              👤 Admin panel
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-b-lg transition"
            >
              <LogOut size={18} className="mr-2" /> Chiqish
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
