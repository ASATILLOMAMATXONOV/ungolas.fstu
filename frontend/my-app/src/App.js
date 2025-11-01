import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import GoalsSection from "./pages/GoalsSection";
import SDGSection from "./pages/SDGSection";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext";
import GoalDetail from "./pages/GoalDetail";

function App() {
  return (
    // 🌍 Butun ilovani LanguageProvider bilan o‘raymiz
    <LanguageProvider>
      <Router>
        {/* 🧭 Navbar har doim tepada */}
        <Navbar />

        {/* 📍 Barcha sahifalar shu yerda yo‘naltiriladi */}
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

          {/* 🎯 Maqsad sahifasi (Kirish bosilganda ochiladi) */}
          <Route
            path="/goal/:id"
            element={
              <>
                <GoalDetail />
                
              </>
            }
          />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
