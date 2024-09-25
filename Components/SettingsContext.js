import React, { createContext, useState } from "react";

export const ThemeContext = createContext();
export const LanguageContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const [language, setLanguage] = useState("en");
  const toggleLanguage = () => setLanguage((prev) => (prev === "en" ? "si" : "en"));

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <LanguageContext.Provider value={{ language, toggleLanguage }}>
        {children}
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
};
