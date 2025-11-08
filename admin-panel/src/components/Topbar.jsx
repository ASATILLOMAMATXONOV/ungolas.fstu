import React, { useState, useRef, useEffect } from "react";
import { UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  return (
    <header className="bg-white shadow px-4 py-2 flex items-center justify-between relative">
      {/* Logo */}
      <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>

      {/* User icon */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <UserCircle size={26} className="text-gray-600" />
        </button>

        {/* Dropdown menu */}
        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="px-3 py-2 text-gray-600 text-sm border-b">
              👤 Admin panel
            </div>
            
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
