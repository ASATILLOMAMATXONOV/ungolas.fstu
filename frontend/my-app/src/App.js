import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import GoalsSection from "./pages/GoalsSection";
import SDGSection from "./pages/SDGSection";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import VisitorCounter from "./components/VisitorCounter";


function App() {
  return (
    <Router>
      {/* Navbar har doim tepada */}
      <Navbar />
      <Home />
      <GoalsSection /> 
      <SDGSection />
      <Footer />
      <BackToTop />
      <VisitorCounter />
        {/* <Box sx={{ py: 4 }}>
          <Routes>
            
         
          </Routes>
        </Box> */}

    </Router>
  );
}

export default App;
