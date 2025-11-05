import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Book,
  Menu,
  TableProperties,
 Indent,
 Type ,
} from "lucide-react";
import profileImg from "../assets/profile.png";

const Sidebar = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isExpanded = isDesktop || isHovered;

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={22} /> },
    { name: "Menu", path: "/Menu", icon: <Menu size={22} /> },

    { name: "Submenu", path: "/Dropdown", icon: <Indent size={22} /> },

     { name: "Home Title", path: "/HomeTitle", icon: <Type size={22} /> },

     { name: "SDG IMG", path: "/HomeBannerCrud", icon: <TableProperties size={22} /> },

     { name: "SDG Title", path: "/Components", icon: <Book size={22} /> },

     { name: "Pages", path: "/Pages", icon: <Book size={22} /> },
    







  

  ];

  return (
    <div
      className={`bg-white shadow-lg h-screen p-4 flex flex-col transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
      onMouseEnter={() => !isDesktop && setIsHovered(true)}
      onMouseLeave={() => !isDesktop && setIsHovered(false)}
    >
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-6">
        <img src={profileImg} alt="Logo" className="w-8 h-8 rounded-full" />
        {isExpanded && (
          <span className="text-lg font-bold whitespace-nowrap">Admin Panel</span>
        )}
      </div>

      {/* Navigation */}
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`flex items-center p-2 rounded-lg transition hover:bg-indigo-100 ${
                location.pathname === item.path ? "bg-indigo-100 font-semibold" : ""
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isExpanded && (
                <span className="ml-3 text-sm whitespace-nowrap">{item.name}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
