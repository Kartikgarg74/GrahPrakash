"use client"
import { motion } from "framer-motion"
import { ArrowLeft, Send, User, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useChat } from "@ai-sdk/react"
import { useRouter } from "next/navigation"
import Disclaimer from "@/components/disclaimer"

interface UserData {
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
  latitude: number
  longitude: number
}

interface AstrologyChatProps {
  userData: UserData
  onBack: () => void
  language: "hindi" | "english"
}

export default function AstrologyChat({ userData, onBack, language }: AstrologyChatProps) {
  const router = useRouter()

  const text = {
    hindi: {
      title: "ज्योतिष परामर्श",
      subtitle: "की कुंडली",
      chatTitle: "🔮 ज्योतिष चैट 🔮",
      placeholder: "अपना सवाल पूछें... (करियर, शादी, स्वास्थ्य आदि)",
      initialMessage: `नमस्ते ${userData.name} जी! मैं GrahPrakash हूं, आपका AI ज्योतिषी। आपकी जन्म कुंडली के गणितीय विश्लेषण के आधार पर मैं आपके सवालों का सटीक जवाब दूंगा। आप करियर, शादी-विवाह, स्वास्थ्य, या किसी भी विषय के बारे में पूछ सकते हैं।`,
      birthLabel: "जन्म:",
      timeLabel: "समय:",
      placeLabel: "स्थान:",
    },
    english: {
      title: "Astrology Consultation",
      subtitle: "'s Horoscope",
      chatTitle: "🔮 Astrology Chat 🔮",
      placeholder: "Ask your question... (career, marriage, health etc.)",
      initialMessage: `Hello ${userData.name}! I'm GrahPrakash, your AI Vedic astrologer. Based on mathematical analysis of your birth chart, I will provide accurate answers to your questions. You can ask about career, marriage, health, or any other aspect of life.`,
      birthLabel: "Birth:",
      timeLabel: "Time:",
      placeLabel: "Place:",
    },
  }

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/astrology-chat?lang=${language}`,
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: text[language].initialMessage,
      },
    ],
    body: {
      userData,
    },
    onError: (error) => {
      console.error("Chat error:", error)
    },
  })

  const handleBackNavigation = () => {
    // Navigate to main menu with language preserved
    router.push(`/?lang=${language}`)
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 relative overflow-hidden">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleBackNavigation} className="text-white hover:bg-white/10 mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">{text[language].title}</h1>
                <p className="text-purple-200">
                  {userData.name}
                  {text[language].subtitle}
                </p>
              </div>
            </div>
            <div className="text-right text-white/80 text-sm">
              <p>
                {text[language].birthLabel} {userData.birthDate}
              </p>
              <p>
                {text[language].timeLabel} {userData.birthTime}
              </p>
              <p>
                {text[language].placeLabel} {userData.birthPlace}
              </p>
            </div>
          </div>

          {/* Chat Interface */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-[70vh] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-center">{text[language].chatTitle}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full ${message.role === "user" ? "bg-purple-600" : "bg-orange-500"}`}
                      >
                        {message.role === "user" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          message.role === "user" ? "bg-purple-600 text-white" : "bg-white/20 text-white"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-orange-500">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/20 text-white p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={text[language].placeholder}
                  className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Disclaimer */}
      <Disclaimer language={language} />
    </>
  )
}
