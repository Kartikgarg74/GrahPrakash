"use client"

import { motion } from "framer-motion"
import { Hand, Stars, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Disclaimer from "@/components/disclaimer"

interface MainMenuProps {
  language: "hindi" | "english"
}

export default function MainMenu({ language }: MainMenuProps) {
  const router = useRouter()

  const text = {
    hindi: {
      title: "आपके भविष्य की खोज करें",
      palmReading: {
        title: "हस्तरेखा विज्ञान",
        subtitle: "Samudrika Shastra",
        description: "अपनी हथेली की रेखाओं से जानें अपना भविष्य",
        button: "हस्तरेखा देखें",
      },
      astrology: {
        title: "ज्योतिष विज्ञान",
        subtitle: "Jyotiṣa",
        description: "ग्रह-नक्षत्रों से जानें अपनी जन्म कुंडली",
        button: "कुंडली देखें",
      },
      footer: '"सत्यं शिवं सुन्दरम्" - Truth, Auspiciousness, Beauty',
    },
    english: {
      title: "Discover Your Future",
      palmReading: {
        title: "Palm Reading",
        subtitle: "Samudrika Shastra",
        description: "Know your future through palm lines",
        button: "Read Palm",
      },
      astrology: {
        title: "Astrology",
        subtitle: "Jyotiṣa",
        description: "Know your birth chart through planets and stars",
        button: "View Horoscope",
      },
      footer: '"सत्यं शिवं सुन्दरम्" - Truth, Auspiciousness, Beauty',
    },
  }

  const handleNavigation = (path: string) => {
    router.push(`${path}?lang=${language}`)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="min-h-screen flex flex-col items-center justify-center p-6"
      >
        {/* Revolving Astrological Circle Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-[150vh] h-[150vh] opacity-10"
            style={{ transform: "translateY(50%)" }}
          >
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <circle cx="200" cy="200" r="130" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

              {Array.from({ length: 12 }).map((_, i) => (
                <g key={i}>
                  <line
                    x1="200"
                    y1="10"
                    x2="200"
                    y2="40"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                    transform={`rotate(${i * 30} 200 200)`}
                  />
                </g>
              ))}

              {Array.from({ length: 36 }).map((_, i) => (
                <circle
                  key={i}
                  cx={200 + 160 * Math.cos((i * 10 * Math.PI) / 180)}
                  cy={200 + 160 * Math.sin((i * 10 * Math.PI) / 180)}
                  r="1"
                  fill="rgba(255,255,255,0.6)"
                />
              ))}
            </svg>
          </motion.div>
        </div>
        <div className="relative z-10">
          {/* Language Toggle */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-6 right-6">
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              className="text-white hover:bg-white/10 flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>{language === "hindi" ? "English" : "हिंदी"}</span>
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <Image src="/logo.png" alt="GRAHPRAKASH" width={120} height={120} className="mx-auto mb-6 drop-shadow-lg" />
            <h1 className="text-5xl font-bold text-white mb-4 tracking-wider">GRAHPRAKASH</h1>
            <p className="text-xl text-blue-200">{text[language].title}</p>
          </motion.div>

          {/* Menu Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
            {/* Palm Reading Option */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-300/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="mb-6"
                  >
                    <Hand className="w-20 h-20 text-orange-300 mx-auto" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-4">{text[language].palmReading.title}</h2>
                  <p className="text-lg text-orange-200 mb-2">{text[language].palmReading.subtitle}</p>
                  <p className="text-orange-100 mb-6">{text[language].palmReading.description}</p>
                  <Button
                    onClick={() => handleNavigation("/palm-reading")}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300"
                  >
                    {text[language].palmReading.button}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Astrology Option */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-300/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mb-6"
                  >
                    <Stars className="w-20 h-20 text-purple-300 mx-auto" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-4">{text[language].astrology.title}</h2>
                  <p className="text-lg text-purple-200 mb-2">{text[language].astrology.subtitle}</p>
                  <p className="text-purple-100 mb-6">{text[language].astrology.description}</p>
                  <Button
                    onClick={() => handleNavigation("/astrology")}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300"
                  >
                    {text[language].astrology.button}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center text-blue-200"
          >
            <p className="text-sm">{text[language].footer}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <Disclaimer language={language} />
    </>
  )
}
