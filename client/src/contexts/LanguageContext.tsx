import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, translations, getTranslation } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations["pt-BR"]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt-BR");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage && (savedLanguage === "pt-BR" || savedLanguage === "en-US")) {
      setLanguageState(savedLanguage);
    }
    setIsLoaded(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: keyof typeof translations["pt-BR"]) => {
    return getTranslation(language, key);
  };

  if (!isLoaded) {
    return <div>{children}</div>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
