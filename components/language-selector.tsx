"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface LanguageSelectorProps {
  onLanguageSelect: (language: "hindi" | "english") => void
}

export default function LanguageSelector({ onLanguageSelect }: LanguageSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Revolving Astrological Circle Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-[150vh] h-[150vh] opacity-10"
          style={{ transform: "translateY(50%)" }}
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Outer circle */}
            <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx="200" cy="200" r="130" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

            {/* Zodiac divisions */}
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
                <line
                  x1="200"
                  y1="360"
                  x2="200"
                  y2="390"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  transform={`rotate(${i * 30} 200 200)`}
                />
              </g>
            ))}

            {/* Constellation dots */}
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

      <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md w-full relative z-10">
        <CardContent className="p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">GRAHPRAKASH</h1>
          <p className="text-blue-200 mb-8">Choose Your Language / भाषा चुनें</p>

          <div className="space-y-4">
            <Button
              onClick={() => onLanguageSelect("english")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold"
            >
              English
            </Button>

            <Button
              onClick={() => onLanguageSelect("hindi")}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold"
            >
              हिंदी
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
