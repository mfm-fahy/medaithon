"use client"

import { useLanguage } from "@/lib/language-context"
import type { Language } from "@/lib/translations"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const languages: { code: Language; name: string }[] = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "hi", name: "हिन्दी" },
    { code: "ta", name: "தமிழ்" },
  ]

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            language === lang.code ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  )
}
