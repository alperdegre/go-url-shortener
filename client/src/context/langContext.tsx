import { Language } from "@/lib/types";
import React, { useState, createContext } from "react";
import { GO_BASE_URL, LANG_MAP } from "@/lib/utils";


interface LangContextType {
  serverUrl: string;
  language: Language;
  changeLanguage: (language: Language) => void;
}

const LangContext = createContext<LangContextType>({
  serverUrl: "",
  language: Language.GO,
  changeLanguage: () => { },
})

interface LangProviderProps {
  children: React.ReactNode;
}

const LangProvider = ({ children }: LangProviderProps) => {
  const [serverUrl, setServerUrl] = useState(GO_BASE_URL)
  const [language, setLanguage] = useState(Language.GO)

  const changeLanguage = (language: Language) => {
    setLanguage(language)
    setServerUrl(LANG_MAP[language])
  }

  return (<LangContext.Provider value={{ changeLanguage, language, serverUrl }}>
    {children}
  </LangContext.Provider>)
}

export { LangContext, LangProvider };
