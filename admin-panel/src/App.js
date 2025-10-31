import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";

import Menus from "./pages/Menus";
import Menu from "./pages/Menu";
import MenuEdit from "./pages/MenuEdit";



import Menuse from "./pages/Menuse";
import MenuAdd from "./pages/MenuAdd";
import MenuForm from "./pages/MenuForm";
import Submenu from "./pages/Submenu";
import NewsEvent from "./pages/NewsEvent";
import Page from "./pages/Pages";
import Statistics from "./pages/Statistics";
import EditPanel from "./pages/EditPanel";
import Newbut from "./pages/Newbut";
import Side from "./pages/Side";
import Fanlar from "./pages/Fanlar";
import Department from "./pages/Department";
import Topmenu from "./pages/Topmenu";

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




        <Route path="menuse" element={<Menuse />} />
        <Route path="menus/add" element={<MenuAdd />} />
        <Route path="menusFrom" element={<MenuForm />} />
        <Route path="/submenu/:id" element={<Submenu />} />
        <Route path="submenu" element={<Submenu />} />
        <Route path="news" element={<NewsEvent />} />
        <Route path="pages" element={<Page />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="edit" element={<EditPanel />} />
        <Route path="newbut" element={<Newbut />} />
        <Route path="side" element={<Side />} />
        <Route path="fanlar" element={<Fanlar />} />
        <Route path="department" element={<Department />} />
        <Route path="topmenu" element={<Topmenu />} />
      </Route>
    </Routes>
  );
}

export default App;
