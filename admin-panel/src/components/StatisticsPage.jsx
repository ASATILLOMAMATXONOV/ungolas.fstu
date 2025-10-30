
import React, { useState, useEffect } from "react";
import { Link2 } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { BASE_API_URL } from "../config";


const StatisticsPage = () => {
  const sections = ["professors", "research", "technical", "visiting", "head"];

  const emptyStaff = {
    name_uz: "",
    name_en: "",
    title_uz: "",
    name_ru: "",
    title_ru: "",
    title_en: "",
    link: ""
  };

  const [staffData, setStaffData] = useState({
    professors: [],
    research: [],
    technical: [],
    visiting: [],
    head: []
  });

  const [expandedSection, setExpandedSection] = useState("");
  const [newStaff, setNewStaff] = useState({
    professors: { ...emptyStaff },
    research: { ...emptyStaff },
    technical: { ...emptyStaff },
    visiting: { ...emptyStaff },
    head: { ...emptyStaff }
  });

  const [showLinkInput, setShowLinkInput] = useState({
    professors: false,
    research: false,
    technical: false,
    visiting: false,
    head: false
  });

  const toggleLinkInput = (section) => {
    setShowLinkInput((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const fetchData = async (section) => {
    try {
      const res = await fetch(`${BASE_API_URL}/api/staff/${section}`);
      const data = await res.json();
      setStaffData((prev) => ({
        ...prev,
        [section]: Array.isArray(data) ? data : [],
      }));
    } catch (err) {
      console.error(`❌ ${section} olishda xato:`, err);
      setStaffData((prev) => ({
        ...prev,
        [section]: [],
      }));
    }
  };

  useEffect(() => {
    sections.forEach(fetchData);
  }, []);

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? "" : section));
  };

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value }
    }));
  };

  const handleSave = async (section) => {
    const staff = newStaff[section];
  
    if (!staff.name_uz || !staff.title_uz) {
      alert("❗ Iltimos, kamida o‘zbekcha ismi va lavozimini kiriting.");
      return;
    }
  
    try {
      const res = await fetch(`${BASE_API_URL}/api/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...staff, category: section }),
      });
  
      if (res.ok) {
        alert(`✅ ${section} uchun saqlandi!`);
        setNewStaff((prev) => ({ ...prev, [section]: { ...emptyStaff } }));
        setShowLinkInput((prev) => ({ ...prev, [section]: false }));
        fetchData(section);
      } else {
        alert("❌ Saqlashda xatolik.");
      }
    } catch (err) {
      console.error("❌ Server xatosi:", err);
    }
  };

  const handleEdit = (section, staff) => {
    setNewStaff((prev) => ({
      ...prev,
      [section]: { ...staff }
    }));
    setExpandedSection(section);
    setShowLinkInput((prev) => ({
      ...prev,
      [section]: !!staff.link
    }));
  };


  const handleDelete = async (section, id) => {
    try {
      const res = await fetch(`${BASE_API_URL}/api/staff/${section}/${id}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        alert("🗑️ Muvaffaqiyatli o‘chirildi.");
        fetchData(section);
      } else {
        alert("❌ O‘chirishda xatolik.");
      }
    } catch (err) {
      console.error("❌ Server xatosi:", err);
    }
  };

  const renderTable = (section) => {
    const data = staffData[section];
    if (!Array.isArray(data)) return null;

    return (
      <table className="w-full table-auto border border-gray-300 mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-left">ID</th>
            <th className="px-4 py-2 border text-left">Name (UZ)</th>
            <th className="px-4 py-2 border text-left">Title (UZ)</th>
            <th className="px-4 py-2 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((staff, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border font-mono text-sm text-gray-600">{staff.id}</td>
              <td className="px-4 py-2 border text-blue-600">
                {staff.link ? (
                  <a href={staff.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {staff.name_uz}
                  </a>
                ) : (
                  staff.name_uz
                )}
              </td>
              <td className="px-4 py-2 border">{staff.title_uz}</td>
              <td className="px-4 py-2 border flex gap-2 items-center">
                <button onClick={() => handleEdit(section, staff)} className="text-yellow-600 hover:text-yellow-800" title="Edit">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(section, staff.id)} className="text-red-600 hover:text-red-800" title="Delete">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{ minWidth: "170vh", margin: "0 auto" }}>
      <h2 className="text-3xl font-bold text-gray-800 mb-5">🧾 Staff table</h2>
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section} className="border rounded bg-white shadow">
            <button className="w-full text-left px-4 py-3 font-semibold bg-gray-100 hover:bg-gray-200" onClick={() => toggleSection(section)}>
              {section === "professors"
                ? "+ Professors"
                : section === "research"
                ? "+ Research assistants and PhD students"
                : section === "technical"
                ? "+ Technical and administrative staff"
                : section === "visiting"
                ? "+ Visiting staff"
                : "+ Head of Department"}
            </button>
            {expandedSection === section && (
              <div className="p-4 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      name="name_uz"
                      placeholder="Name (UZ)"
                      value={newStaff[section].name_uz}
                      onChange={(e) => handleInputChange(e, section)}
                      className="border p-2 pr-10 rounded w-full"
                    />
                    <button type="button" onClick={() => toggleLinkInput(section)} className="absolute inset-y-0 right-0 flex items-center px-2 text-blue-600 hover:text-blue-800" title="Link qo‘shish">
                      <Link2 size={18} />
                    </button>
                  </div>
                  <input name="title_uz" placeholder="Title (UZ)" value={newStaff[section].title_uz} onChange={(e) => handleInputChange(e, section)} className="border p-2 rounded" />
                  <input name="name_ru" placeholder="Name (RU)" value={newStaff[section].name_ru} onChange={(e) => handleInputChange(e, section)} className="border p-2 rounded" />
                  <input name="title_ru" placeholder="Title (RU)" value={newStaff[section].title_ru} onChange={(e) => handleInputChange(e, section)} className="border p-2 rounded" />
                  <input name="name_en" placeholder="Name (EN)" value={newStaff[section].name_en} onChange={(e) => handleInputChange(e, section)} className="border p-2 rounded" />
                  <input name="title_en" placeholder="Title (EN)" value={newStaff[section].title_en} onChange={(e) => handleInputChange(e, section)} className="border p-2 rounded" />
                  {showLinkInput[section] && (
                    <div className="col-span-2">
                      <input type="url" name="link" placeholder="https://profile-link.com" value={newStaff[section].link} onChange={(e) => handleInputChange(e, section)} className="border p-2 rounded w-full" />
                    </div>
                  )}
                </div>
                <button onClick={() => handleSave(section)} className="bg-blue-600 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700">➕ Saqlash</button>
                {renderTable(section)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsPage;
