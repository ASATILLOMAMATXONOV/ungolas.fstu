import React, { createContext, useContext, useState } from "react";

// 🔹 Context yaratish
const LanguageContext = createContext();

// 🔹 Provider — bu orqali barcha komponentlar langni ko‘radi
export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("uz"); // default — uzbek tili

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 🔹 Custom hook — oson foydalanish uchun
export const useLanguage = () => useContext(LanguageContext);
