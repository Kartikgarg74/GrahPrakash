"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Camera, Upload, Hand } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import PalmAnalysis from "@/components/palm-analysis"

export default function PalmReadingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const language = (searchParams.get("lang") as "hindi" | "english") || "english"

  const [step, setStep] = useState<"capture" | "analysis">("capture")
  const [palmImage, setPalmImage] = useState<string | null>(null)
  const [handLandmarks, setHandLandmarks] = useState<any[]>([])
  const [isCapturing, setIsCapturing] = useState(false)
  const [handDetected, setHandDetected] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const text = {
    hindi: {
      title: "हस्तरेखा विज्ञान",
      formTitle: "अपनी हथेली की फोटो लें",
      formSubtitle: "सटीक विश्लेषण के लिए साफ और स्पष्ट फोटो लें",
      cameraButton: "कैमरा से फोटो लें",
      uploadButton: "गैलरी से चुनें",
      captureButton: "📸 फोटो लें",
      cancelButton: "रद्द करें",
      instructions: "📋 निर्देश:",
      instructionsList: [
        "• हथेली को अच्छी रोशनी में रखें",
        "• हाथ को सीधा और खुला रखें",
        "• सभी रेखाएं साफ दिखनी चाहिए",
        "• हाथ को गाइड के अंदर रखें",
      ],
      frameText: "हथेली को गाइड में रखें",
      handDetected: "हाथ मिल गया! फोटो लेने के लिए तैयार",
      positionHand: "कृपया अपना हाथ गाइड में रखें",
    },
    english: {
      title: "Palm Reading",
      formTitle: "Take a Photo of Your Palm",
      formSubtitle: "Take a clear and sharp photo for accurate analysis",
      cameraButton: "Take Photo with Camera",
      uploadButton: "Choose from Gallery",
      captureButton: "📸 Take Photo",
      cancelButton: "Cancel",
      instructions: "📋 Instructions:",
      instructionsList: [
        "• Keep palm in good lighting",
        "• Keep hand straight and open",
        "• All lines should be clearly visible",
        "• Position hand within the guide",
      ],
      frameText: "Position palm within guide",
      handDetected: "Hand detected! Ready to capture",
      positionHand: "Please position your hand within the guide",
    },
  }

  // Draw hand guide overlay
  const drawHandGuide = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set canvas size to match video
      if (videoRef.current) {
        canvas.width = videoRef.current.videoWidth || 640
        canvas.height = videoRef.current.videoHeight || 480
      }

      // Draw hand outline guide
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const handWidth = canvas.width * 0.4
      const handHeight = canvas.height * 0.6

      // Hand outline
      ctx.strokeStyle = handDetected ? "#00ff00" : "#ffffff"
      ctx.lineWidth = 3
      ctx.setLineDash([10, 5])

      // Draw palm outline
      ctx.beginPath()
      ctx.ellipse(centerX, centerY + 50, handWidth / 2, handHeight / 3, 0, 0, 2 * Math.PI)
      ctx.stroke()

      // Draw finger guides
      const fingerWidth = handWidth / 8
      const fingerHeight = handHeight / 3

      // Fingers
      for (let i = 0; i < 4; i++) {
        const fingerX = centerX - handWidth / 2 + (i + 1) * (handWidth / 5)
        const fingerY = centerY - handHeight / 4

        ctx.beginPath()
        ctx.roundRect(fingerX - fingerWidth / 2, fingerY - fingerHeight, fingerWidth, fingerHeight, 10)
        ctx.stroke()
      }

      // Thumb
      ctx.beginPath()
      ctx.ellipse(centerX - handWidth / 2 - 20, centerY, fingerWidth, fingerHeight / 1.5, -Math.PI / 6, 0, 2 * Math.PI)
      ctx.stroke()

      // Instructions text
      ctx.fillStyle = handDetected ? "#00ff00" : "#ffffff"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillText(
        handDetected ? text[language].handDetected : text[language].positionHand,
        centerX,
        canvas.height - 30,
      )

      // Reset line dash
      ctx.setLineDash([])
    },
    [handDetected, language, text],
  )

  // Simulate hand detection
  useEffect(() => {
    if (isCapturing && overlayCanvasRef.current) {
      const interval = setInterval(() => {
        // Simulate hand detection
        const detected = Math.random() > 0.3 // 70% chance of detection
        setHandDetected(detected)

        // Generate mock landmarks when hand is detected
        if (detected) {
          const mockLandmarks = Array.from({ length: 21 }, (_, i) => ({
            x: 0.3 + (i % 5) * 0.1 + (Math.random() - 0.5) * 0.05,
            y: 0.3 + Math.floor(i / 5) * 0.1 + (Math.random() - 0.5) * 0.05,
            z: 0,
          }))
          setHandLandmarks(mockLandmarks)
        }

        drawHandGuide(overlayCanvasRef.current!)
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isCapturing, drawHandGuide])

  const startCamera = useCallback(async () => {
    try {
      setIsCapturing(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          if (overlayCanvasRef.current && videoRef.current) {
            overlayCanvasRef.current.width = videoRef.current.videoWidth
            overlayCanvasRef.current.height = videoRef.current.videoHeight
            drawHandGuide(overlayCanvasRef.current)
          }
        }
      }
    } catch (error) {
      console.error("Camera access error:", error)
      alert(
        language === "hindi"
          ? "कैमरा एक्सेस नहीं मिल सका। कृपया फाइल अपलोड करें।"
          : "Camera access failed. Please upload a file.",
      )
      setIsCapturing(false)
    }
  }, [language, drawHandGuide])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        context.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        setPalmImage(imageData)

        // Stop camera
        const stream = video.srcObject as MediaStream
        stream?.getTracks().forEach((track) => track.stop())
        setIsCapturing(false)
        setStep("analysis")
      }
    }
  }, [])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPalmImage(e.target?.result as string)
        setStep("analysis")
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleBackNavigation = () => {
    // Navigate to main menu with language preserved
    router.push(`/?lang=${language}`)
  }

  if (step === "analysis" && palmImage) {
    return (
      <PalmAnalysis
        palmImage={palmImage}
        handLandmarks={handLandmarks}
        onBack={() => setStep("capture")}
        language={language}
      />
    )
  }

  return (
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
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={handleBackNavigation} className="text-white hover:bg-white/10 mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">{text[language].title}</h1>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">{text[language].formTitle}</CardTitle>
            <p className="text-orange-200 text-center">{text[language].formSubtitle}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isCapturing ? (
              <div className="space-y-4">
                {/* Camera Option */}
                <Button
                  onClick={startCamera}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold flex items-center justify-center space-x-2"
                >
                  <Camera className="w-6 h-6" />
                  <span>{text[language].cameraButton}</span>
                </Button>

                {/* Upload Option */}
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full border-2 border-orange-400 bg-orange-100/20 text-white hover:bg-orange-500/30 hover:border-orange-300 py-4 text-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300"
                >
                  <Upload className="w-6 h-6" />
                  <span>{text[language].uploadButton}</span>
                </Button>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

                {/* Instructions */}
                <div className="bg-white/5 rounded-lg p-4 mt-6">
                  <h3 className="text-white font-semibold mb-2 flex items-center">
                    <Hand className="w-5 h-5 mr-2" />
                    {text[language].instructions}
                  </h3>
                  <ul className="text-orange-200 space-y-1 text-sm">
                    {text[language].instructionsList.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Camera View with Hand Guide */}
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
                  <canvas
                    ref={overlayCanvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ mixBlendMode: "screen" }}
                  />
                  <div className="absolute top-4 left-4 bg-black/50 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${handDetected ? "bg-green-500" : "bg-red-500"}`}></div>
                      <span className="text-white text-sm">
                        {handDetected ? text[language].handDetected : text[language].positionHand}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Capture Button */}
                <Button
                  onClick={capturePhoto}
                  disabled={!handDetected}
                  className={`w-full py-4 text-lg font-semibold ${
                    handDetected
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {text[language].captureButton}
                </Button>

                <Button
                  onClick={() => {
                    setIsCapturing(false)
                    setHandDetected(false)
                  }}
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10"
                >
                  {text[language].cancelButton}
                </Button>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
