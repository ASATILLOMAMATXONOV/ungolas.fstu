import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import GoalsSection from "./pages/GoalsSection";
import SDGSection from "./pages/SDGSection";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext";

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
          <Route path="/goal-detail/:id" element={<GoalDetail />} />

          {/* 📋 Bitta sahifaning to‘liq ma’lumotlari */}
          <Route path="/goal/:id" element={<GoalList />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
