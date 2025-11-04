import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SubmenuDetail from "./components/SubmenuDetail";
import Home from "./pages/Home";
import GoalsSection from "./pages/GoalsSection";
import SDGSection from "./pages/SDGSection";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext";
import MenuDetail from "./components/MenuDetail"; 

import GoalDetail from "./pages/GoalDetail";
import GoalList from "./pages/GoalList";

function App() {
  return (
    <LanguageProvider>
      <Router>
        {/* 🧭 Navbar har doim tepada */}
        <Navbar />

        <Routes>
          {/* 🏠 Bosh sahifa */}
          <Route
            path="/"
            element={
              <>
                <Home />
                <GoalsSection />
                <SDGSection />
                <Footer />
              </>
            }
          />

          {/* 🎯 Banner bosilganda shu bannerga tegishli sahifalar chiqadi */}
          <Route path="/goal-list/:id" element={<GoalDetail />} />

          {/* 📋 Bitta sahifaning to‘liq ma’lumotlari */}
          <Route path="/goal/:id" element={<GoalList />} />

          {/* 📑 Submenu to‘liq ma’lumotlari */ }
          <Route path="/submenu/:id" element={<SubmenuDetail />} />

          {/* 📂 Menu to‘liq ma’lumotlari */}
          <Route path="/menu/:id" element={<MenuDetail />} /> 



        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
