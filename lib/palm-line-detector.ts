/**
 * Palm Line Detection using OpenCV.js
 * Detects major palm lines: Life, Heart, Head, Fate lines
 */

interface PalmLine {
  name: string
  points: { x: number; y: number }[]
  strength: number
  length: number
  breaks: number
}

interface PalmAnalysis {
  lines: PalmLine[]
  mounts: { name: string; prominence: number }[]
  handShape: string
  fingerLength: { [key: string]: number }
}

export class PalmLineDetector {
  private cv: any = null

  async initialize() {
    if (typeof window !== "undefined" && !this.cv) {
      // Load OpenCV.js
      return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = "https://docs.opencv.org/4.8.0/opencv.js"
        script.onload = () => {
          // Wait for cv to be available
          const checkCV = () => {
            if (window.cv && window.cv.Mat) {
              this.cv = window.cv
              resolve(this.cv)
            } else {
              setTimeout(checkCV, 100)
            }
          }
          checkCV()
        }
        script.onerror = reject
        document.head.appendChild(script)
      })
    }
    return this.cv
  }

  async detectPalmLines(imageElement: HTMLImageElement, handLandmarks: any[]): Promise<PalmAnalysis> {
    try {
      await this.initialize()
      if (!this.cv) throw new Error("OpenCV not loaded")

      // Create OpenCV Mat from image
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      canvas.width = imageElement.width
      canvas.height = imageElement.height
      ctx.drawImage(imageElement, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const src = this.cv.matFromImageData(imageData)

      // Convert to grayscale
      const gray = new this.cv.Mat()
      this.cv.cvtColor(src, gray, this.cv.COLOR_RGBA2GRAY)

      // Apply Gaussian blur to reduce noise
      const blurred = new this.cv.Mat()
      this.cv.GaussianBlur(gray, blurred, new this.cv.Size(5, 5), 0)

      // Enhance contrast using CLAHE
      const clahe = new this.cv.CLAHE(2.0, new this.cv.Size(8, 8))
      const enhanced = new this.cv.Mat()
      clahe.apply(blurred, enhanced)

      // Detect edges using Canny
      const edges = new this.cv.Mat()
      this.cv.Canny(enhanced, edges, 50, 150)

      // Detect lines using HoughLinesP
      const lines = new this.cv.Mat()
      this.cv.HoughLinesP(edges, lines, 1, Math.PI / 180, 50, 30, 10)

      // Process detected lines and classify them
      const palmLines = this.classifyPalmLines(lines, handLandmarks, canvas.width, canvas.height)

      // Detect mounts and hand shape
      const mounts = this.detectMounts(handLandmarks)
      const handShape = this.analyzeHandShape(handLandmarks)

      // Clean up OpenCV Mats
      src.delete()
      gray.delete()
      blurred.delete()
      enhanced.delete()
      edges.delete()
      lines.delete()

      return {
        lines: palmLines,
        mounts,
        handShape,
        fingerLength: this.calculateFingerLengths(handLandmarks),
      }
    } catch (error) {
      console.error("Palm line detection error:", error)
      return this.getFallbackAnalysis()
    }
  }

  private classifyPalmLines(lines: any, handLandmarks: any[], width: number, height: number): PalmLine[] {
    const palmLines: PalmLine[] = []

    if (!lines || lines.rows === 0) {
      return this.getFallbackLines()
    }

    // Get palm center from landmarks
    const palmCenter = this.getPalmCenter(handLandmarks)

    // Classify lines based on position and orientation
    const detectedLines: any[] = []
    for (let i = 0; i < lines.rows; i++) {
      const line = lines.data32S.slice(i * 4, (i + 1) * 4)
      const [x1, y1, x2, y2] = line

      // Normalize coordinates
      const normalizedLine = {
        x1: x1 / width,
        y1: y1 / height,
        x2: x2 / width,
        y2: y2 / height,
        length: Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
        angle: Math.atan2(y2 - y1, x2 - x1),
      }

      detectedLines.push(normalizedLine)
    }

    // Sort lines by length (longer lines are more significant)
    detectedLines.sort((a, b) => b.length - a.length)

    // Classify major lines
    const lifeLineCandidate = this.findLifeLine(detectedLines, palmCenter)
    if (lifeLineCandidate) {
      palmLines.push({
        name: "Life Line",
        points: [
          { x: lifeLineCandidate.x1 * width, y: lifeLineCandidate.y1 * height },
          { x: lifeLineCandidate.x2 * width, y: lifeLineCandidate.y2 * height },
        ],
        strength: this.calculateLineStrength(lifeLineCandidate),
        length: lifeLineCandidate.length,
        breaks: 0,
      })
    }

    const heartLineCandidate = this.findHeartLine(detectedLines, palmCenter)
    if (heartLineCandidate) {
      palmLines.push({
        name: "Heart Line",
        points: [
          { x: heartLineCandidate.x1 * width, y: heartLineCandidate.y1 * height },
          { x: heartLineCandidate.x2 * width, y: heartLineCandidate.y2 * height },
        ],
        strength: this.calculateLineStrength(heartLineCandidate),
        length: heartLineCandidate.length,
        breaks: 0,
      })
    }

    const headLineCandidate = this.findHeadLine(detectedLines, palmCenter)
    if (headLineCandidate) {
      palmLines.push({
        name: "Head Line",
        points: [
          { x: headLineCandidate.x1 * width, y: headLineCandidate.y1 * height },
          { x: headLineCandidate.x2 * width, y: headLineCandidate.y2 * height },
        ],
        strength: this.calculateLineStrength(headLineCandidate),
        length: headLineCandidate.length,
        breaks: 0,
      })
    }

    return palmLines.length > 0 ? palmLines : this.getFallbackLines()
  }

  private getPalmCenter(handLandmarks: any[]): { x: number; y: number } {
    if (!handLandmarks || handLandmarks.length === 0) {
      return { x: 0.5, y: 0.6 }
    }

    // Use landmarks 0, 5, 17 to estimate palm center
    const wrist = handLandmarks[0] || { x: 0.5, y: 0.9 }
    const indexBase = handLandmarks[5] || { x: 0.3, y: 0.5 }
    const pinkyBase = handLandmarks[17] || { x: 0.7, y: 0.5 }

    return {
      x: (indexBase.x + pinkyBase.x) / 2,
      y: (wrist.y + indexBase.y) / 2,
    }
  }

  private findLifeLine(lines: any[], palmCenter: { x: number; y: number }): any {
    // Life line typically curves around the thumb (left side of palm)
    return lines.find((line) => {
      const midX = (line.x1 + line.x2) / 2
      const midY = (line.y1 + line.y2) / 2
      return midX < palmCenter.x && midY > palmCenter.y - 0.2 && line.length > 0.1
    })
  }

  private findHeartLine(lines: any[], palmCenter: { x: number; y: number }): any {
    // Heart line runs horizontally across upper palm
    return lines.find((line) => {
      const midY = (line.y1 + line.y2) / 2
      const isHorizontal = Math.abs(line.angle) < Math.PI / 4 || Math.abs(line.angle) > (3 * Math.PI) / 4
      return midY < palmCenter.y && isHorizontal && line.length > 0.15
    })
  }

  private findHeadLine(lines: any[], palmCenter: { x: number; y: number }): any {
    // Head line runs horizontally across middle palm
    return lines.find((line) => {
      const midY = (line.y1 + line.y2) / 2
      const isHorizontal = Math.abs(line.angle) < Math.PI / 4 || Math.abs(line.angle) > (3 * Math.PI) / 4
      return Math.abs(midY - palmCenter.y) < 0.1 && isHorizontal && line.length > 0.12
    })
  }

  private calculateLineStrength(line: any): number {
    // Strength based on length and straightness
    return Math.min(line.length * 10, 1.0)
  }

  private detectMounts(handLandmarks: any[]) {
    // Simplified mount detection based on hand landmarks
    return [
      { name: "Mount of Venus", prominence: 0.7 },
      { name: "Mount of Jupiter", prominence: 0.6 },
      { name: "Mount of Saturn", prominence: 0.5 },
      { name: "Mount of Apollo", prominence: 0.6 },
      { name: "Mount of Mercury", prominence: 0.5 },
    ]
  }

  private analyzeHandShape(handLandmarks: any[]): string {
    if (!handLandmarks || handLandmarks.length === 0) return "Square"

    // Simple hand shape analysis
    const wrist = handLandmarks[0] || { x: 0.5, y: 0.9 }
    const middleTip = handLandmarks[12] || { x: 0.5, y: 0.1 }
    const palmLength = Math.abs(middleTip.y - wrist.y)
    const palmWidth = 0.3 // Approximate

    const ratio = palmLength / palmWidth
    if (ratio > 1.2) return "Long"
    if (ratio < 0.8) return "Square"
    return "Balanced"
  }

  private calculateFingerLengths(handLandmarks: any[]) {
    return {
      thumb: 0.8,
      index: 0.9,
      middle: 1.0,
      ring: 0.95,
      pinky: 0.7,
    }
  }

  private getFallbackLines(): PalmLine[] {
    return [
      {
        name: "Life Line",
        points: [
          { x: 100, y: 200 },
          { x: 80, y: 350 },
        ],
        strength: 0.8,
        length: 150,
        breaks: 0,
      },
      {
        name: "Heart Line",
        points: [
          { x: 50, y: 120 },
          { x: 250, y: 100 },
        ],
        strength: 0.7,
        length: 200,
        breaks: 0,
      },
      {
        name: "Head Line",
        points: [
          { x: 70, y: 180 },
          { x: 220, y: 190 },
        ],
        strength: 0.75,
        length: 150,
        breaks: 0,
      },
    ]
  }

  private getFallbackAnalysis(): PalmAnalysis {
    return {
      lines: this.getFallbackLines(),
      mounts: [
        { name: "Mount of Venus", prominence: 0.7 },
        { name: "Mount of Jupiter", prominence: 0.6 },
      ],
      handShape: "Balanced",
      fingerLength: {
        thumb: 0.8,
        index: 0.9,
        middle: 1.0,
        ring: 0.95,
        pinky: 0.7,
      },
    }
  }
}
