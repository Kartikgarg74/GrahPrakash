"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import AstrologyChat from "@/components/astrology-chat"

interface UserData {
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
  latitude: number
  longitude: number
}

export default function AstrologyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const language = (searchParams.get("lang") as "hindi" | "english") || "english"

  const [step, setStep] = useState<"form" | "chat">("form")
  const [userData, setUserData] = useState<UserData>({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    latitude: 0,
    longitude: 0,
  })

  const text = {
    hindi: {
      title: "ज्योतिष विज्ञान",
      formTitle: "जन्म विवरण दर्ज करें",
      formSubtitle: "सटीक भविष्यफल के लिए सही जानकारी दें",
      name: "पूरा नाम",
      namePlaceholder: "अपना पूरा नाम लिखें",
      birthDate: "जन्म तारीख",
      birthTime: "जन्म समय",
      birthPlace: "जन्म स्थान",
      birthPlacePlaceholder: "शहर का नाम (जैसे: दिल्ली, मुंबई)",
      submitButton: "कुंडली बनाएं और चैट शुरू करें",
    },
    english: {
      title: "Astrology",
      formTitle: "Enter Birth Details",
      formSubtitle: "Provide accurate information for precise predictions",
      name: "Full Name",
      namePlaceholder: "Enter your full name",
      birthDate: "Birth Date",
      birthTime: "Birth Time",
      birthPlace: "Birth Place",
      birthPlacePlaceholder: "City name (e.g.: Delhi, Mumbai)",
      submitButton: "Create Horoscope and Start Chat",
    },
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userData.name && userData.birthDate && userData.birthTime && userData.birthPlace) {
      setStep("chat")
    }
  }

  const handleBackNavigation = () => {
    // Navigate to main menu with language preserved
    router.push(`/?lang=${language}`)
  }

  if (step === "chat") {
    return <AstrologyChat userData={userData} onBack={() => setStep("form")} language={language} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={handleBackNavigation} className="text-white hover:bg-white/10 mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">{text[language].title}</h1>
        </div>

        {/* Birth Details Form */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">{text[language].formTitle}</CardTitle>
            <p className="text-purple-200 text-center">{text[language].formSubtitle}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {text[language].name}
                </Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder={text[language].namePlaceholder}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  required
                />
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-white flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {text[language].birthDate}
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={userData.birthDate}
                  onChange={(e) => setUserData((prev) => ({ ...prev, birthDate: e.target.value }))}
                  className="bg-white/10 border-white/30 text-white"
                  required
                />
              </div>

              {/* Birth Time */}
              <div className="space-y-2">
                <Label htmlFor="birthTime" className="text-white flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {text[language].birthTime}
                </Label>
                <Input
                  id="birthTime"
                  type="time"
                  value={userData.birthTime}
                  onChange={(e) => setUserData((prev) => ({ ...prev, birthTime: e.target.value }))}
                  className="bg-white/10 border-white/30 text-white"
                  required
                />
              </div>

              {/* Birth Place */}
              <div className="space-y-2">
                <Label htmlFor="birthPlace" className="text-white flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {text[language].birthPlace}
                </Label>
                <Input
                  id="birthPlace"
                  value={userData.birthPlace}
                  onChange={(e) => {
                    setUserData((prev) => ({ ...prev, birthPlace: e.target.value }))
                  }}
                  placeholder={text[language].birthPlacePlaceholder}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold"
              >
                {text[language].submitButton}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
