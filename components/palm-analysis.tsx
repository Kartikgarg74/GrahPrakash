"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, MessageCircle, Loader2, Hand, Send, User, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useChat } from "@ai-sdk/react"
import Image from "next/image"
import Disclaimer from "@/components/disclaimer"

interface PalmAnalysisProps {
  palmImage: string
  handLandmarks?: any[]
  onBack: () => void
  language: "hindi" | "english"
}

export default function PalmAnalysis({ palmImage, handLandmarks = [], onBack, language }: PalmAnalysisProps) {
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [palmReport, setPalmReport] = useState<string>("")
  const [showChat, setShowChat] = useState(false)
  const [apiError, setApiError] = useState<string>("")

  const text = {
    hindi: {
      title: "हस्तरेखा विश्लेषण",
      askQuestions: "सवाल पूछें",
      yourPalm: "आपकी हथेली",
      analysisReport: "विश्लेषण रिपोर्ट",
      analyzing: "आपकी हथेली का विश्लेषण हो रहा है...",
      detectingLines: "रेखाओं की पहचान हो रही है...",
      pleaseWait: "कृपया प्रतीक्षा करें",
      askYourQuestions: "🤔 अपने सवाल पूछें",
      chatSubtitle: "हस्तरेखा के बारे में कोई भी सवाल पूछें",
      firstQuestion: "अपना पहला सवाल पूछें!",
      placeholder: "जैसे: मेरी शादी कब होगी? करियर कैसा रहेगा?",
      initialChatMessage:
        "नमस्ते! मैं आपकी हथेली का विश्लेषण पूरा कर चुका हूँ। आप करियर, प्रेम जीवन, स्वास्थ्य या भविष्य के बारे में कोई भी सवाल पूछ सकते हैं।",
      apiErrorMessage: "API त्रुटि - कृपया GOOGLE_GENERATIVE_AI_API_KEY जांचें",
    },
    english: {
      title: "Palm Analysis",
      askQuestions: "Ask Questions",
      yourPalm: "Your Palm",
      analysisReport: "Analysis Report",
      analyzing: "Analyzing your palm...",
      detectingLines: "Detecting palm lines...",
      pleaseWait: "Please wait",
      askYourQuestions: "🤔 Ask Your Questions",
      chatSubtitle: "Ask any questions about palmistry",
      firstQuestion: "Ask your first question!",
      placeholder: "e.g.: When will I get married? How will my career be?",
      initialChatMessage:
        "Hello! I've completed your palm analysis. You can ask me anything about your career, love life, health, or future based on your palm reading.",
      apiErrorMessage: "API Error - Please check GOOGLE_GENERATIVE_AI_API_KEY",
    },
  }

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/palm-chat`,
    initialMessages: [],
    body: {
      palmReport,
      language,
    },
    onError: (error) => {
      console.error("Palm chat error:", error)
    },
  })

  // Static fallback analysis - no destructuring
  const getFallbackAnalysis = useCallback(() => {
    if (language === "hindi") {
      return `🖐️ हस्तरेखा विश्लेषण रिपोर्ट:

✨ मुख्य रेखाएं:
• जीवन रेखा: मजबूत और स्पष्ट - अच्छे स्वास्थ्य और लंबी आयु के संकेत
• हृदय रेखा: गहरी और साफ - भावनात्मक स्थिरता और प्रेम में सफलता
• मस्तिष्क रेखा: लंबी और सीधी - तेज बुद्धि और व्यावहारिक सोच
• भाग्य रेखा: स्पष्ट दिखाई दे रही है - करियर में प्रगति के संकेत

💼 करियर और धन:
सूर्य और शनि पर्वत सक्रिय हैं - जिससे सफलता, मान-सम्मान और आर्थिक संतुलन प्राप्त होता है।

❤️ स्वास्थ्य और रिश्ते:
स्वास्थ्य में सामान्य संतुलन रहेगा और पारिवारिक व भावनात्मक रिश्तों में स्थिरता बनी रहेगी।

🌈 सकारात्मक भविष्यफल:
आने वाला समय अवसरों से भरा होगा। नियमित प्रयास और सकारात्मक सोच से जीवन में उन्नति निश्चित है।`
    } else {
      return `🖐️ Palm Reading Analysis:

✨ Major Lines:
• Life Line: Strong and clear - indicates vitality, balanced energy, and a steady life path
• Heart Line: Deep and clear - reflects emotional strength, compassion, and fulfilling relationships
• Head Line: Clear and long - shows logical thinking, intelligence, and good decision-making skills
• Fate Line: Present and visible - suggests potential for career stability and gradual growth

💼 Career & Wealth:
Signs point to consistent progress, with opportunities for recognition and financial improvement through effort and skill.

❤️ Health & Relationships:
Health appears stable, and personal relationships show signs of harmony and trust.

🌟 Positive Outlook:
Your palm suggests a promising future filled with growth, balance, and happiness. With dedication and clarity, success is well within reach.`
    }
  }, [language])

  // Simplified analysis function - NO destructuring anywhere
  const performAnalysis = useCallback(async () => {
    console.log("🔍 Starting palm analysis...")
    console.log("📸 Image length:", palmImage?.length)
    console.log("🌐 Language:", language)
    console.log("📍 Landmarks count:", handLandmarks?.length)

    try {
      console.log("🚀 Making API call to /api/analyze-palm...")

      const response = await fetch("/api/analyze-palm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: palmImage,
          language: language,
          landmarks: handLandmarks,
        }),
      })

      console.log("📡 API response status:", response.status)
      console.log("📡 API response ok:", response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log("📊 API response data:", data)
        console.log("📝 Analysis text length:", data?.analysis?.length)

        if (data && data.analysis && data.analysis.trim() !== "" && data.analysis.length > 50) {
          console.log("✅ API analysis successful - using real analysis")
          setPalmReport(data.analysis)
          setApiError("")
        } else {
          console.log("⚠️ API returned empty/short analysis - using fallback")
          setPalmReport(getFallbackAnalysis())
          setApiError("API returned empty response")
        }
      } else {
        const errorText = await response.text()
        console.log("❌ API error response:", errorText)
        console.log("🔄 Using fallback analysis - API error, status:", response.status)
        setPalmReport(getFallbackAnalysis())
        setApiError(`API Error: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error("💥 API call failed with error:", error)
      console.log("🔄 Using fallback analysis - catch block")
      setPalmReport(getFallbackAnalysis())
      setApiError(`Network Error: ${error}`)
    }

    setAnalysisComplete(true)
    console.log("✅ Analysis complete!")
  }, [palmImage, language, handLandmarks, getFallbackAnalysis])

  // Simple useEffect with minimal dependencies
  useEffect(() => {
    if (palmImage && !analysisComplete) {
      performAnalysis()
    }
  }, [palmImage, performAnalysis, analysisComplete])

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 p-6 relative overflow-hidden">
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
              <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10 mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-white">{text[language].title}</h1>
            </div>

            {/* ALWAYS SHOW CHAT BUTTON WHEN ANALYSIS IS COMPLETE */}
            {analysisComplete && (
              <Button
                onClick={() => setShowChat(!showChat)}
                className="bg-orange-600 hover:bg-orange-700 text-white flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{text[language].askQuestions}</span>
              </Button>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Palm Image */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-center">{text[language].yourPalm}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-black/20">
                  <Image src={palmImage || "/placeholder.svg"} alt="Palm Image" fill className="object-cover" />

                  {/* Hand landmarks */}
                  {handLandmarks.length > 0 && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {handLandmarks.map((landmark, index) => (
                        <circle
                          key={index}
                          cx={landmark.x * 100 + "%"}
                          cy={landmark.y * 100 + "%"}
                          r="2"
                          fill="red"
                          opacity="0.7"
                        />
                      ))}
                    </svg>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Report */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-center flex items-center justify-center space-x-2">
                  <Hand className="w-5 h-5" />
                  <span>{text[language].analysisReport}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!analysisComplete ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="w-12 h-12 text-orange-400 animate-spin" />
                    <p className="text-white text-center">{text[language].analyzing}</p>
                    <p className="text-orange-200 text-sm text-center">{text[language].detectingLines}</p>
                    <p className="text-orange-300 text-xs text-center">{text[language].pleaseWait}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Show API Error if exists */}
                    {apiError && (
                      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
                        <p className="text-red-200 text-sm">
                          ⚠️ {text[language].apiErrorMessage}: {apiError}
                        </p>
                      </div>
                    )}

                    <div className="bg-white/5 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-white whitespace-pre-wrap text-sm leading-relaxed">{palmReport}</pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ALWAYS SHOW CHAT WHEN REQUESTED AND ANALYSIS IS COMPLETE */}
          {showChat && analysisComplete && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-center">{text[language].askYourQuestions}</CardTitle>
                  <p className="text-orange-200 text-center text-sm">{text[language].chatSubtitle}</p>
                </CardHeader>
                <CardContent>
                  {/* Messages */}
                  <div className="h-64 overflow-y-auto space-y-3 mb-4 p-2">
                    {/* Welcome message when chat opens */}
                    {messages.length === 0 && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-2 max-w-[80%]">
                          <div className="p-2 rounded-full bg-red-500">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-white/20 text-white p-3 rounded-lg">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                              {text[language].initialChatMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex items-start space-x-2 max-w-[80%] ${
                            message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                          }`}
                        >
                          <div
                            className={`p-2 rounded-full ${message.role === "user" ? "bg-orange-600" : "bg-red-500"}`}
                          >
                            {message.role === "user" ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <Bot className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div
                            className={`p-3 rounded-lg ${
                              message.role === "user" ? "bg-orange-600 text-white" : "bg-white/20 text-white"
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
                          <div className="p-2 rounded-full bg-red-500">
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
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Disclaimer */}
      <Disclaimer language={language} />
    </>
  )
}
