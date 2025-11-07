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
import ComponentCrud from "./pages/ComponentCrud";
import ComponentsPage from "./pages/Components";


import NewPageList from "./pages/NewPageList";
import NewPageCreate from "./pages/NewPageCreate";
import NewPageEdit from "./pages/NewPageEdit";
import Login from "./Login";




function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

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
        

        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/components/create" element={<ComponentCrud />} />
        <Route path="/components/edit/:id" element={<ComponentCrud />} />

       
        
        <Route path="new-pages" element={<NewPageList />} />
        <Route path="new-pages/create" element={<NewPageCreate />} />
        <Route path="new-pages/edit/:id" element={<NewPageEdit />} />

        
    <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;