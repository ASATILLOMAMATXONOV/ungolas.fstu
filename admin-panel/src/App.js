import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Menus from "./pages/Menus";
import Menu from "./pages/Menu";
import MenuEdit from "./pages/MenuEdit";

import Dropdown from "./pages/Dropdown";
import Dropdowns from "./pages/Dropdowns";
import DropdownEdit from "./pages/DropdownEdit";

import HomeTitle from "./pages/HomeTitle";

import HomeBannerCrud from "./pages/HomeBannerCrud";

import Pages from "./pages/Pages";
import PageCrud from "./pages/PageCrud";
import PageCrudEdit from "./pages/PageCrudEdit";








function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="Menus" element={<Menus />} />
        <Route path="Menu" element={<Menu />} />
        <Route path="/menus/edit/:id" element={<MenuEdit />} />

        <Route path="Dropdown" element={<Dropdown />} />
        <Route path="Dropdowns" element={<Dropdowns />} />
        <Route path="/submenus/edit/:id" element={<DropdownEdit />} />

        <Route path="HomeTitle" element={<HomeTitle />} />

        <Route path="HomeBannerCrud" element={<HomeBannerCrud />} />


        <Route path="Pages" element={<Pages />} />
        <Route path="PageCrud" element={<PageCrud />} />
        <Route path="/pages/edit/:id" element={<PageCrudEdit />} />

       
        
  
      </Route>
    </Routes>
  );
}

export default App;
