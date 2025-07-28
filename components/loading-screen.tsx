"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface LoadingScreenProps {
  language: "hindi" | "english"
}

export default function LoadingScreen({ language }: LoadingScreenProps) {
  const text = {
    hindi: {
      title: "GRAHPRAKASH",
      subtitle: "ज्योतिष और हस्तरेखा विज्ञान",
    },
    english: {
      title: "GRAHPRAKASH",
      subtitle: "Astrology and Palmistry Science",
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
    >
      {/* Revolving Astrological Circle Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-[150vh] h-[150vh] opacity-15"
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

      {/* Logo Animation */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="mb-8"
        >
          <Image src="/logo.png" alt="GRAHPRAKASH Logo" width={200} height={200} className="drop-shadow-2xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4 tracking-wider">{text[language].title}</h1>
          <p className="text-xl text-blue-200 mb-8">{text[language].subtitle}</p>

          {/* Loading dots */}
          <div className="flex space-x-2 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 bg-white rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
