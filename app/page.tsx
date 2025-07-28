"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import LoadingScreen from "@/components/loading-screen"
import MainMenu from "@/components/main-menu"
import LanguageSelector from "@/components/language-selector"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const searchParams = useSearchParams()
  const langParam = searchParams.get("lang") as "hindi" | "english" | null

  const [language, setLanguage] = useState<"hindi" | "english" | null>(langParam)
  const [isLoading, setIsLoading] = useState(false)

  // Update language when URL parameter changes
  useEffect(() => {
    if (langParam && langParam !== language) {
      setLanguage(langParam)
    }
  }, [langParam, language])

  const handleLanguageSelect = (selectedLanguage: "hindi" | "english") => {
    setLanguage(selectedLanguage)
    setIsLoading(true)

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 4000)

    return () => clearTimeout(timer)
  }

  if (!language) {
    return <LanguageSelector onLanguageSelect={handleLanguageSelect} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <AnimatePresence mode="wait">
        {isLoading ? <LoadingScreen key="loading" language={language} /> : <MainMenu key="main" language={language} />}
      </AnimatePresence>
    </div>
  )
}
