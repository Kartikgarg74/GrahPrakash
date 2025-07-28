"use client"

import { motion } from "framer-motion"

interface DisclaimerProps {
  language: "hindi" | "english"
}

export default function Disclaimer({ language }: DisclaimerProps) {
  const text = {
    hindi: {
      disclaimer:
        "⚠️ सूचना: यह सामग्री AI द्वारा निर्मित है। हमने इसे तथ्यपरक बनाने का प्रयास किया है, परंतु यह कभी-कभी अशुद्ध हो सकती है। केवल मनोरंजन के लिए।",
    },
    english: {
      disclaimer:
        "⚠️ Disclaimer: Content is AI-generated. While aligned with traditional knowledge, it may contain inaccuracies. For entertainment purposes only.",
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
        <p className="text-white/80 text-xs text-center max-w-md leading-tight">{text[language].disclaimer}</p>
      </div>
    </motion.div>
  )
}
