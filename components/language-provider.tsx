"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Language, Translations } from "@/lib/i18n"
import { getTranslations, getNestedTranslation } from "@/lib/i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  translations: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [translations, setTranslations] = useState<Translations>(getTranslations("en"))

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("preferred_language") as Language
    if (savedLanguage && ["en", "hi", "kn", "ta"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
      setTranslations(getTranslations(savedLanguage))
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    setTranslations(getTranslations(lang))
    localStorage.setItem("preferred_language", lang)
  }

  const t = (key: string): string => {
    return getNestedTranslation(translations, key)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
