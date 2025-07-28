import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { image, language = "english", landmarks } = await req.json()

    console.log("🖐️ Palm analysis request:", {
      hasImage: !!image,
      imageLength: image?.length,
      imageType: image?.substring(0, 30),
      language,
      landmarksCount: landmarks?.length,
      apiKeyExists: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      apiKeyLength: process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length,
    })

    // Check if we have an image
    if (!image) {
      console.log("❌ No image provided")
      return NextResponse.json({
        error: "No image provided",
        analysis: language === "hindi" ? "कृपया हथेली की फोटो अपलोड करें।" : "Please upload a palm image.",
      })
    }

    // Check API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.log("❌ No API key found")
      return NextResponse.json({
        error: "API key missing",
        analysis: language === "hindi" ? "API कुंजी गुम है।" : "API key is missing.",
      })
    }

    // Validate image format
    if (!image.startsWith("data:image/")) {
      console.log("❌ Invalid image format")
      return NextResponse.json({
        error: "Invalid image format",
        analysis: language === "hindi" ? "गलत इमेज फॉर्मेट।" : "Invalid image format.",
      })
    }

    // Enhanced palm analysis prompt
    const analysisPrompt =
      language === "hindi"
        ? `
आप एक अनुभवी हस्तरेखा विशेषज्ञ हैं। इस हथेली की तस्वीर को देखकर विस्तृत विश्लेषण करें:

कृपया निम्नलिखित का विश्लेषण करें:
1. मुख्य रेखाएं (जीवन, हृदय, मस्तिष्क, भाग्य रेखा)
2. हाथ का आकार और उंगलियों की लंबाई
3. पर्वत (सूर्य, चंद्र, शुक्र, मंगल आदि)
4. विशेष चिह्न (त्रिकोण, तारा, वर्ग आदि)
5. करियर और धन के संकेत
6. स्वास्थ्य और रिश्तों के संकेत
7. भविष्य की सकारात्मक संभावनाएं

150-200 शब्दों में सकारात्मक और उत्साहजनक विश्लेषण दें।
`
        : `
You are an expert palmist. Analyze this palm image in detail:

Please analyze:
1. Major lines (Life, Heart, Head, Fate lines) - their length, depth, clarity
2. Hand shape and finger proportions
3. Mounts (Sun, Moon, Venus, Mars, etc.) and their prominence
4. Special markings (triangles, stars, squares, crosses)
5. Career and wealth indicators
6. Health and relationship signs
7. Positive future prospects

Provide a detailed, uplifting analysis in 150-200 words focusing on strengths and positive potential.
`

    console.log("🚀 Calling Gemini Vision API...")
    console.log("🔑 API Key first 10 chars:", process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0, 10))

    try {
      const { text } = await generateText({
        model: google("gemini-2.0-flash-exp", {
          apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        }),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: analysisPrompt,
              },
              {
                type: "image",
                image: image,
              },
            ],
          },
        ],
        maxTokens: 500,
        temperature: 0.7,
      })

      console.log("✅ Gemini Vision analysis successful, length:", text?.length)
      console.log("📝 Analysis preview:", text?.substring(0, 100) + "...")

      if (!text || text.length < 50) {
        console.log("⚠️ Analysis too short, using fallback")
        throw new Error("Analysis too short")
      }

      return NextResponse.json({ analysis: text })
    } catch (geminiError: any) {
      console.error("💥 Gemini API specific error:", {
        message: geminiError.message,
        status: geminiError.status,
        code: geminiError.code,
        details: geminiError.details,
        stack: geminiError.stack?.substring(0, 200),
      })

      // Try with text-only model as fallback
      console.log("🔄 Trying text-only model as fallback...")

      try {
        const textOnlyPrompt =
          language === "hindi"
            ? "एक सामान्य हस्तरेखा विश्लेषण प्रदान करें जो सकारात्मक और उत्साहजनक हो।"
            : "Provide a general positive palm reading analysis."

        const { text: fallbackText } = await generateText({
          model: google("gemini-2.0-flash-exp", {
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
          }),
          prompt: textOnlyPrompt,
          maxTokens: 300,
        })

        if (fallbackText && fallbackText.length > 30) {
          console.log("✅ Text-only fallback successful")
          return NextResponse.json({
            analysis: fallbackText,
            note: "Generated using text-only model due to vision API issues",
          })
        }
      } catch (textError) {
        console.error("💥 Text-only fallback also failed:", textError)
      }

      throw geminiError
    }
  } catch (error: any) {
    console.error("💥 Palm analysis API error:", {
      message: error.message,
      status: error.status,
      code: error.code,
      name: error.name,
      stack: error.stack?.substring(0, 300),
    })

    // Enhanced fallback analysis
    const fallbackAnalysis =
      language === "hindi"
        ? `🖐️ हस्तरेखा विश्लेषण रिपोर्ट:

✨ मुख्य रेखाएं:
• जीवन रेखा: गहरी और स्पष्ट – उत्कृष्ट स्वास्थ्य और जीवन शक्ति के संकेत
• हृदय रेखा: संतुलित और मजबूत – भावनात्मक स्थिरता और प्रेम में सफलता
• मस्तिष्क रेखा: लंबी और साफ – तीव्र बुद्धि, रचनात्मकता और अच्छी निर्णय क्षमता
• भाग्य रेखा: स्पष्ट रूप से दिखाई दे रही है – करियर में निरंतर प्रगति के संकेत

💼 करियर और धन:
आपके सूर्य पर्वत और शनि पर्वत की स्थिति उत्कृष्ट है। यह नेतृत्व क्षमता, सफलता और आर्थिक समृद्धि के मजबूत संकेत देता है।

❤️ स्वास्थ्य और रिश्ते:
स्वास्थ्य रेखा संतुलित है जो अच्छी सेहत का संकेत देती है। विवाह रेखा स्थिर रिश्तों और पारिवारिक खुशी का इशारा करती है।

🌟 भविष्य की संभावनाएं:
आने वाले 5-7 वर्षों में आपके जीवन में महत्वपूर्ण सकारात्मक बदलाव आएंगे। आपकी मेहनत और दृढ़ता से सफलता निश्चित है।`
        : `🖐️ Comprehensive Palm Reading Analysis:

✨ Major Lines Assessment:
• Life Line: Strong and well-defined - indicates excellent vitality, robust health, and a balanced approach to life's challenges
• Heart Line: Deep and clear - reflects emotional intelligence, capacity for deep relationships, and romantic fulfillment
• Head Line: Long and straight - shows analytical thinking, creativity, and excellent decision-making abilities
• Fate Line: Clearly visible - suggests career stability, professional growth, and achievement through persistent effort

💼 Career & Financial Prospects:
Your Sun mount and Saturn mount positioning is excellent, indicating natural leadership abilities, recognition in your field, and strong potential for financial success through dedicated work.

❤️ Health & Relationships:
Health line appears balanced, suggesting good physical constitution. Marriage lines indicate stable, harmonious relationships and family happiness.

🌟 Future Outlook:
The next 5-7 years show significant positive developments in your life. Your determination and hard work will lead to substantial achievements and personal fulfillment.`

    return NextResponse.json({
      analysis: fallbackAnalysis,
      error: `API Error: ${error.status || 500} - ${error.message || "Internal server error"}`,
      errorDetails: {
        type: error.name,
        code: error.code,
        status: error.status,
      },
    })
  }
}
