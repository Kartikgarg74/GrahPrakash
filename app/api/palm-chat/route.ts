import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, palmReport, language } = await req.json()

    console.log("🤖 Palm chat request:", {
      messagesCount: messages?.length,
      palmReportLength: palmReport?.length,
      language,
      hasValidReport: palmReport && palmReport.trim() !== "" && !palmReport.includes("ready to analyze"),
      apiKeyExists: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    })

    // Check API key first
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.log("❌ No API key for chat")
      return new Response("API key missing", { status: 500 })
    }

    // Check if we have a valid palm report
    if (
      !palmReport ||
      palmReport.trim() === "" ||
      palmReport.includes("ready to analyze") ||
      palmReport.includes("Please upload")
    ) {
      console.log("❌ No valid palm report, using fallback")

      const errorMessage =
        language === "hindi" ? "कृपया पहले अपनी हथेली का विश्लेषण पूरा करें।" : "Please complete your palm analysis first."

      const result = await streamText({
        model: google("gemini-2.0-flash-exp", {
          apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        }),
        messages: [
          {
            role: "assistant",
            content: errorMessage,
          },
        ],
        maxTokens: 100,
      })

      return result.toDataStreamResponse()
    }

    const palmContext =
      language === "hindi"
        ? `
आप एक वरिष्ठ और अनुभवी हस्तरेखा विशेषज्ञ हैं। आपके पास इस व्यक्ति की हथेली का पूरा विश्लेषण उपलब्ध है।

हस्तरेखा विश्लेषण रिपोर्ट:
${palmReport}

निर्देश:
- इस रिपोर्ट के आधार पर उपयोगकर्ता के सवालों का जवाब दें
- 80-100 शब्दों में संक्षिप्त उत्तर दें
- सकारात्मक और प्रेरणादायक भाषा का उपयोग करें
- करियर, शादी-विवाह, स्वास्थ्य के बारे में विशिष्ट जानकारी दें
- हमेशा एक प्रश्न के साथ समाप्त करें
`
        : `
You are an expert palmist with the complete palm analysis available.

Palm Analysis Report:
${palmReport}

Instructions:
- Answer user questions based ONLY on this palm analysis report
- Keep responses concise (80-100 words)
- Maintain positive, uplifting tone
- Provide specific insights about career, relationships, health
- Always end with a follow-up question
- DO NOT ask for palm images - you already have the analysis
`

    console.log("🚀 Calling Gemini API for palm chat...")

    const result = await streamText({
      model: google("gemini-2.0-flash-exp", {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      }),
      messages: [
        {
          role: "system",
          content: palmContext,
        },
        ...messages,
      ],
      maxTokens: 200,
      temperature: 0.7,
    })

    return result.toDataStreamResponse()
  } catch (error: any) {
    console.error("💥 Palm chat API error:", {
      message: error.message,
      status: error.status,
      code: error.code,
      name: error.name,
    })

    return new Response(`Chat error: ${error.message}`, { status: 500 })
  }
}
