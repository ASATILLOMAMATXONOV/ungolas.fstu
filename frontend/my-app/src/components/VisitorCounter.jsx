import React, { useEffect } from "react";

export default function VisitorCounter() {
  useEffect(() => {
    // Oldingi scriptni tozalab tashlaymiz (agar qayta yuklansa)
    const existing = document.getElementById("uz-counter");
    if (existing) existing.remove();

    // Yangi script yaratamiz
    const script = document.createElement("script");
    script.src = "https://www.uz/uz/res/visitor/index?id=29390";
    script.id = "uz-counter";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Komponent o‘chirilganda scriptni tozalash
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null; // Bu komponent hech narsa ko‘rsatmaydi
}
