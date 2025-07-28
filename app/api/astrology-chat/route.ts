import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { VedicAstrologyCalculator } from "@/lib/astrology-calculator"

export const maxDuration = 30

// Comprehensive location database for accurate coordinates
const LOCATION_DATABASE: Record<string, { lat: number; lng: number; timezone: string }> = {
  // India - Major Cities
  delhi: { lat: 28.6139, lng: 77.209, timezone: "Asia/Kolkata" },
  mumbai: { lat: 19.076, lng: 72.8777, timezone: "Asia/Kolkata" },
  bangalore: { lat: 12.9716, lng: 77.5946, timezone: "Asia/Kolkata" },
  chennai: { lat: 13.0827, lng: 80.2707, timezone: "Asia/Kolkata" },
  kolkata: { lat: 22.5726, lng: 88.3639, timezone: "Asia/Kolkata" },
  hyderabad: { lat: 17.385, lng: 78.4867, timezone: "Asia/Kolkata" },
  pune: { lat: 18.5204, lng: 73.8567, timezone: "Asia/Kolkata" },
  ahmedabad: { lat: 23.0225, lng: 72.5714, timezone: "Asia/Kolkata" },
  jaipur: { lat: 26.9124, lng: 75.7873, timezone: "Asia/Kolkata" },
  lucknow: { lat: 26.8467, lng: 80.9462, timezone: "Asia/Kolkata" },
  kanpur: { lat: 26.4499, lng: 80.3319, timezone: "Asia/Kolkata" },
  nagpur: { lat: 21.1458, lng: 79.0882, timezone: "Asia/Kolkata" },
  indore: { lat: 22.7196, lng: 75.8577, timezone: "Asia/Kolkata" },
  thane: { lat: 19.2183, lng: 72.9781, timezone: "Asia/Kolkata" },
  bhopal: { lat: 23.2599, lng: 77.4126, timezone: "Asia/Kolkata" },
  visakhapatnam: { lat: 17.6868, lng: 83.2185, timezone: "Asia/Kolkata" },
  pimpri: { lat: 18.6298, lng: 73.7997, timezone: "Asia/Kolkata" },
  patna: { lat: 25.5941, lng: 85.1376, timezone: "Asia/Kolkata" },
  vadodara: { lat: 22.3072, lng: 73.1812, timezone: "Asia/Kolkata" },
  ghaziabad: { lat: 28.6692, lng: 77.4538, timezone: "Asia/Kolkata" },
  ludhiana: { lat: 30.901, lng: 75.8573, timezone: "Asia/Kolkata" },
  agra: { lat: 27.1767, lng: 78.0081, timezone: "Asia/Kolkata" },
  nashik: { lat: 19.9975, lng: 73.7898, timezone: "Asia/Kolkata" },
  faridabad: { lat: 28.4089, lng: 77.3178, timezone: "Asia/Kolkata" },
  meerut: { lat: 28.9845, lng: 77.7064, timezone: "Asia/Kolkata" },
  rajkot: { lat: 22.3039, lng: 70.8022, timezone: "Asia/Kolkata" },
  kalyan: { lat: 19.2437, lng: 73.1355, timezone: "Asia/Kolkata" },
  vasai: { lat: 19.4912, lng: 72.8054, timezone: "Asia/Kolkata" },
  varanasi: { lat: 25.3176, lng: 82.9739, timezone: "Asia/Kolkata" },
  srinagar: { lat: 34.0837, lng: 74.7973, timezone: "Asia/Kolkata" },
  aurangabad: { lat: 19.8762, lng: 75.3433, timezone: "Asia/Kolkata" },
  dhanbad: { lat: 23.7957, lng: 86.4304, timezone: "Asia/Kolkata" },
  amritsar: { lat: 31.634, lng: 74.8723, timezone: "Asia/Kolkata" },
  "navi mumbai": { lat: 19.033, lng: 73.0297, timezone: "Asia/Kolkata" },
  allahabad: { lat: 25.4358, lng: 81.8463, timezone: "Asia/Kolkata" },
  ranchi: { lat: 23.3441, lng: 85.3096, timezone: "Asia/Kolkata" },
  howrah: { lat: 22.5958, lng: 88.2636, timezone: "Asia/Kolkata" },
  coimbatore: { lat: 11.0168, lng: 76.9558, timezone: "Asia/Kolkata" },
  jabalpur: { lat: 23.1815, lng: 79.9864, timezone: "Asia/Kolkata" },
  gwalior: { lat: 26.2183, lng: 78.1828, timezone: "Asia/Kolkata" },
  vijayawada: { lat: 16.5062, lng: 80.648, timezone: "Asia/Kolkata" },
  jodhpur: { lat: 26.2389, lng: 73.0243, timezone: "Asia/Kolkata" },
  madurai: { lat: 9.9252, lng: 78.1198, timezone: "Asia/Kolkata" },
  raipur: { lat: 21.2514, lng: 81.6296, timezone: "Asia/Kolkata" },
  kota: { lat: 25.2138, lng: 75.8648, timezone: "Asia/Kolkata" },
  chandigarh: { lat: 30.7333, lng: 76.7794, timezone: "Asia/Kolkata" },
  gurgaon: { lat: 28.4595, lng: 77.0266, timezone: "Asia/Kolkata" },
  solapur: { lat: 17.6599, lng: 75.9064, timezone: "Asia/Kolkata" },
  hubli: { lat: 15.3647, lng: 75.124, timezone: "Asia/Kolkata" },
  tiruchirappalli: { lat: 10.7905, lng: 78.7047, timezone: "Asia/Kolkata" },
  bareilly: { lat: 28.367, lng: 79.4304, timezone: "Asia/Kolkata" },
  mysore: { lat: 12.2958, lng: 76.6394, timezone: "Asia/Kolkata" },
  tiruppur: { lat: 11.1085, lng: 77.3411, timezone: "Asia/Kolkata" },
  guwahati: { lat: 26.1445, lng: 91.7362, timezone: "Asia/Kolkata" },
  salem: { lat: 11.6643, lng: 78.146, timezone: "Asia/Kolkata" },
  mira: { lat: 19.2952, lng: 72.8694, timezone: "Asia/Kolkata" },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366, timezone: "Asia/Kolkata" },
  bhiwandi: { lat: 19.3002, lng: 73.0635, timezone: "Asia/Kolkata" },
  saharanpur: { lat: 29.968, lng: 77.5552, timezone: "Asia/Kolkata" },
  gorakhpur: { lat: 26.7606, lng: 83.3732, timezone: "Asia/Kolkata" },
  guntur: { lat: 16.3067, lng: 80.4365, timezone: "Asia/Kolkata" },
  bikaner: { lat: 28.0229, lng: 73.3119, timezone: "Asia/Kolkata" },
  amravati: { lat: 20.9374, lng: 77.7796, timezone: "Asia/Kolkata" },
  noida: { lat: 28.5355, lng: 77.391, timezone: "Asia/Kolkata" },
  jamshedpur: { lat: 22.8046, lng: 86.2029, timezone: "Asia/Kolkata" },
  bhilai: { lat: 21.1938, lng: 81.3509, timezone: "Asia/Kolkata" },
  cuttack: { lat: 20.4625, lng: 85.8828, timezone: "Asia/Kolkata" },
  firozabad: { lat: 27.1592, lng: 78.3957, timezone: "Asia/Kolkata" },
  kochi: { lat: 9.9312, lng: 76.2673, timezone: "Asia/Kolkata" },
  nellore: { lat: 14.4426, lng: 79.9865, timezone: "Asia/Kolkata" },
  bhavnagar: { lat: 21.7645, lng: 72.1519, timezone: "Asia/Kolkata" },
  dehradun: { lat: 30.3165, lng: 78.0322, timezone: "Asia/Kolkata" },
  durgapur: { lat: 23.5204, lng: 87.3119, timezone: "Asia/Kolkata" },
  asansol: { lat: 23.6739, lng: 86.9524, timezone: "Asia/Kolkata" },
  rourkela: { lat: 22.2604, lng: 84.8536, timezone: "Asia/Kolkata" },
  nanded: { lat: 19.1383, lng: 77.321, timezone: "Asia/Kolkata" },
  kolhapur: { lat: 16.705, lng: 74.2433, timezone: "Asia/Kolkata" },
  ajmer: { lat: 26.4499, lng: 74.6399, timezone: "Asia/Kolkata" },
  akola: { lat: 20.7002, lng: 77.0082, timezone: "Asia/Kolkata" },
  gulbarga: { lat: 17.3297, lng: 76.8343, timezone: "Asia/Kolkata" },
  jamnagar: { lat: 22.4707, lng: 70.0577, timezone: "Asia/Kolkata" },
  ujjain: { lat: 23.1765, lng: 75.7885, timezone: "Asia/Kolkata" },
  loni: { lat: 28.7333, lng: 77.2833, timezone: "Asia/Kolkata" },
  siliguri: { lat: 26.7271, lng: 88.3953, timezone: "Asia/Kolkata" },
  jhansi: { lat: 25.4484, lng: 78.5685, timezone: "Asia/Kolkata" },
  ulhasnagar: { lat: 19.2215, lng: 73.1645, timezone: "Asia/Kolkata" },
  jammu: { lat: 32.7266, lng: 74.857, timezone: "Asia/Kolkata" },
  sangli: { lat: 16.8524, lng: 74.5815, timezone: "Asia/Kolkata" },
  mangalore: { lat: 12.9141, lng: 74.856, timezone: "Asia/Kolkata" },
  erode: { lat: 11.341, lng: 77.7172, timezone: "Asia/Kolkata" },
  belgaum: { lat: 15.8497, lng: 74.4977, timezone: "Asia/Kolkata" },
  ambattur: { lat: 13.1143, lng: 80.1548, timezone: "Asia/Kolkata" },
  tirunelveli: { lat: 8.7139, lng: 77.7567, timezone: "Asia/Kolkata" },
  malegaon: { lat: 20.5579, lng: 74.5287, timezone: "Asia/Kolkata" },
  gaya: { lat: 24.7914, lng: 85.0002, timezone: "Asia/Kolkata" },
  jalgaon: { lat: 21.0077, lng: 75.5626, timezone: "Asia/Kolkata" },
  udaipur: { lat: 24.5854, lng: 73.7125, timezone: "Asia/Kolkata" },
  maheshtala: { lat: 22.5049, lng: 88.2482, timezone: "Asia/Kolkata" },
  sonipat: { lat: 28.9931, lng: 77.0151, timezone: "Asia/Kolkata" },

  // International Cities
  "new york": { lat: 40.7128, lng: -74.006, timezone: "America/New_York" },
  london: { lat: 51.5074, lng: -0.1278, timezone: "Europe/London" },
  tokyo: { lat: 35.6762, lng: 139.6503, timezone: "Asia/Tokyo" },
  paris: { lat: 48.8566, lng: 2.3522, timezone: "Europe/Paris" },
  sydney: { lat: -33.8688, lng: 151.2093, timezone: "Australia/Sydney" },
  dubai: { lat: 25.2048, lng: 55.2708, timezone: "Asia/Dubai" },
  singapore: { lat: 1.3521, lng: 103.8198, timezone: "Asia/Singapore" },
  "hong kong": { lat: 22.3193, lng: 114.1694, timezone: "Asia/Hong_Kong" },
  "los angeles": { lat: 34.0522, lng: -118.2437, timezone: "America/Los_Angeles" },
  toronto: { lat: 43.6532, lng: -79.3832, timezone: "America/Toronto" },
  berlin: { lat: 52.52, lng: 13.405, timezone: "Europe/Berlin" },
  moscow: { lat: 55.7558, lng: 37.6176, timezone: "Europe/Moscow" },
  beijing: { lat: 39.9042, lng: 116.4074, timezone: "Asia/Shanghai" },
  shanghai: { lat: 31.2304, lng: 121.4737, timezone: "Asia/Shanghai" },
  seoul: { lat: 37.5665, lng: 126.978, timezone: "Asia/Seoul" },
  bangkok: { lat: 13.7563, lng: 100.5018, timezone: "Asia/Bangkok" },
  "kuala lumpur": { lat: 3.139, lng: 101.6869, timezone: "Asia/Kuala_Lumpur" },
  jakarta: { lat: -6.2088, lng: 106.8456, timezone: "Asia/Jakarta" },
  manila: { lat: 14.5995, lng: 120.9842, timezone: "Asia/Manila" },
  cairo: { lat: 30.0444, lng: 31.2357, timezone: "Africa/Cairo" },
  johannesburg: { lat: -26.2041, lng: 28.0473, timezone: "Africa/Johannesburg" },
  lagos: { lat: 6.5244, lng: 3.3792, timezone: "Africa/Lagos" },
  nairobi: { lat: -1.2921, lng: 36.8219, timezone: "Africa/Nairobi" },
  "rio de janeiro": { lat: -22.9068, lng: -43.1729, timezone: "America/Sao_Paulo" },
  "sao paulo": { lat: -23.5505, lng: -46.6333, timezone: "America/Sao_Paulo" },
  "buenos aires": { lat: -34.6118, lng: -58.396, timezone: "America/Argentina/Buenos_Aires" },
  "mexico city": { lat: 19.4326, lng: -99.1332, timezone: "America/Mexico_City" },
  lima: { lat: -12.0464, lng: -77.0428, timezone: "America/Lima" },
  bogota: { lat: 4.711, lng: -74.0721, timezone: "America/Bogota" },
  caracas: { lat: 10.4806, lng: -66.9036, timezone: "America/Caracas" },
  santiago: { lat: -33.4489, lng: -70.6693, timezone: "America/Santiago" },
  montevideo: { lat: -34.9011, lng: -56.1645, timezone: "America/Montevideo" },
  quito: { lat: -0.1807, lng: -78.4678, timezone: "America/Guayaquil" },
  "la paz": { lat: -16.5, lng: -68.1193, timezone: "America/La_Paz" },
  asuncion: { lat: -25.2637, lng: -57.5759, timezone: "America/Asuncion" },
  georgetown: { lat: 6.8013, lng: -58.1551, timezone: "America/Guyana" },
  paramaribo: { lat: 5.852, lng: -55.2038, timezone: "America/Paramaribo" },
  cayenne: { lat: 4.9333, lng: -52.3333, timezone: "America/Cayenne" },
  brasilia: { lat: -15.8267, lng: -47.9218, timezone: "America/Sao_Paulo" },
  ottawa: { lat: 45.4215, lng: -75.6972, timezone: "America/Toronto" },
  washington: { lat: 38.9072, lng: -77.0369, timezone: "America/New_York" },
  canberra: { lat: -35.2809, lng: 149.13, timezone: "Australia/Sydney" },
  wellington: { lat: -41.2865, lng: 174.7762, timezone: "Pacific/Auckland" },
  suva: { lat: -18.1248, lng: 178.4501, timezone: "Pacific/Fiji" },
  "port moresby": { lat: -9.4438, lng: 147.1803, timezone: "Pacific/Port_Moresby" },
  "nuku'alofa": { lat: -21.1789, lng: -175.1982, timezone: "Pacific/Tongatapu" },
  apia: { lat: -13.8506, lng: -171.7513, timezone: "Pacific/Apia" },
  "port vila": { lat: -17.7334, lng: 168.3273, timezone: "Pacific/Efate" },
  honiara: { lat: -9.428, lng: 159.9729, timezone: "Pacific/Guadalcanal" },
  majuro: { lat: 7.1315, lng: 171.1845, timezone: "Pacific/Majuro" },
  palikir: { lat: 6.9248, lng: 158.1611, timezone: "Pacific/Pohnpei" },
  ngerulmud: { lat: 7.5006, lng: 134.6242, timezone: "Pacific/Palau" },
  yaren: { lat: -0.5477, lng: 166.9209, timezone: "Pacific/Nauru" },
  funafuti: { lat: -8.5243, lng: 179.1942, timezone: "Pacific/Funafuti" },
  "south tarawa": { lat: 1.3278, lng: 172.9797, timezone: "Pacific/Tarawa" },
}

function getLocationCoordinates(place: string): { lat: number; lng: number } {
  const normalizedPlace = place.toLowerCase().trim()

  // Direct lookup
  if (LOCATION_DATABASE[normalizedPlace]) {
    return {
      lat: LOCATION_DATABASE[normalizedPlace].lat,
      lng: LOCATION_DATABASE[normalizedPlace].lng,
    }
  }

  // Partial match lookup
  for (const [key, value] of Object.entries(LOCATION_DATABASE)) {
    if (key.includes(normalizedPlace) || normalizedPlace.includes(key)) {
      return { lat: value.lat, lng: value.lng }
    }
  }

  // If no match found, return coordinates for a central location (India)
  console.warn(`Location "${place}" not found in database, using default coordinates`)
  return { lat: 20.5937, lng: 78.9629 } // Geographic center of India
}

export async function POST(req: Request) {
  try {
    const { messages, userData } = await req.json()

    // Get language from URL params
    const url = new URL(req.url)
    const language = url.searchParams.get("lang") || "english"

    // Initialize astrology calculator
    const calculator = new VedicAstrologyCalculator()

    // Parse birth data with proper location handling
    const birthDate = new Date(`${userData.birthDate} ${userData.birthTime}`)

    // Get coordinates for the birth place
    const coordinates = getLocationCoordinates(userData.birthPlace)
    const lat = userData.latitude || coordinates.lat
    const lon = userData.longitude || coordinates.lng

    // Generate real birth chart
    const chartData = calculator.generateBirthChart(birthDate, userData.birthTime, userData.birthPlace, lat, lon)

    // Create comprehensive astrological context
    const astrologyContext =
      language === "hindi"
        ? `
आप GrahPrakash हैं, AI वैदिक ज्योतिषी।

${userData.name} की जन्म कुंडली:
जन्म: ${userData.birthDate}, ${userData.birthTime}, ${userData.birthPlace}
निर्देशांक: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E
अयनांश: ${chartData.ayanamsa.toFixed(1)}°

लग्न: ${chartData.ascendant.sign} ${chartData.ascendant.degree.toFixed(1)}° (${chartData.ascendant.nakshatra} नक्षत्र)

मुख्य ग्रह स्थितियां:
• सूर्य: ${chartData.planets.Sun.sign} राशि, ${chartData.planets.Sun.house}वां भाव (${chartData.planets.Sun.nakshatra})
• चंद्र: ${chartData.planets.Moon.sign} राशि, ${chartData.planets.Moon.house}वां भाव (${chartData.planets.Moon.nakshatra})
• मंगल: ${chartData.planets.Mars.sign} राशि, ${chartData.planets.Mars.house}वां भाव
• बुध: ${chartData.planets.Mercury.sign} राशि, ${chartData.planets.Mercury.house}वां भाव
• गुरु: ${chartData.planets.Jupiter.sign} राशि, ${chartData.planets.Jupiter.house}वां भाव
• शुक्र: ${chartData.planets.Venus.sign} राशि, ${chartData.planets.Venus.house}वां भाव
• शनि: ${chartData.planets.Saturn.sign} राशि, ${chartData.planets.Saturn.house}वां भाव
• राहु: ${chartData.planets.Rahu.sign} राशि, ${chartData.planets.Rahu.house}वां भाव
• केतु: ${chartData.planets.Ketu.sign} राशि, ${chartData.planets.Ketu.house}वां भाव

वर्तमान दशा: ${chartData.currentDasha.mahadasha_lord} महादशा (${chartData.currentDasha.balance_years.toFixed(1)} वर्ष शेष)

मुख्य योग: ${chartData.yogas.join(", ")}

निर्देश:
- हिंदी में संक्षिप्त उत्तर दें (100-120 शब्द)
- कुंडली के वास्तविक डेटा का उपयोग करें
- ग्रह स्थितियों और दशा के आधार पर सटीक भविष्यफल दें
- सकारात्मक और उत्साहजनक रहें
- एक प्रश्न के साथ समाप्त करें
`
        : `
You are GrahPrakash, AI Vedic astrologer.

${userData.name}'s Birth Chart Analysis:
Born: ${userData.birthDate}, ${userData.birthTime}, ${userData.birthPlace}
Coordinates: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E
Ayanamsa: ${chartData.ayanamsa.toFixed(1)}°

Ascendant: ${chartData.ascendant.sign} ${chartData.ascendant.degree.toFixed(1)}° in ${chartData.ascendant.nakshatra} Nakshatra

Planetary Positions:
• Sun: ${chartData.planets.Sun.sign} sign, ${chartData.planets.Sun.house}th house (${chartData.planets.Sun.nakshatra})
• Moon: ${chartData.planets.Moon.sign} sign, ${chartData.planets.Moon.house}th house (${chartData.planets.Moon.nakshatra})
• Mars: ${chartData.planets.Mars.sign} sign, ${chartData.planets.Mars.house}th house
• Mercury: ${chartData.planets.Mercury.sign} sign, ${chartData.planets.Mercury.house}th house
• Jupiter: ${chartData.planets.Jupiter.sign} sign, ${chartData.planets.Jupiter.house}th house
• Venus: ${chartData.planets.Venus.sign} sign, ${chartData.planets.Venus.house}th house
• Saturn: ${chartData.planets.Saturn.sign} sign, ${chartData.planets.Saturn.house}th house
• Rahu: ${chartData.planets.Rahu.sign} sign, ${chartData.planets.Rahu.house}th house
• Ketu: ${chartData.planets.Ketu.sign} sign, ${chartData.planets.Ketu.house}th house

Current Dasha: ${chartData.currentDasha.mahadasha_lord} Mahadasha (${chartData.currentDasha.balance_years.toFixed(1)} years remaining)

Active Yogas: ${chartData.yogas.join(", ")}

Instructions:
- Respond in English (100-120 words)
- Use actual chart data for accurate predictions
- Base insights on planetary positions and current dasha
- Be positive and encouraging
- End with a follow-up question
`

    const result = await streamText({
      model: google("gemini-2.0-flash-exp", {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      }),
      messages: [
        {
          role: "system",
          content: astrologyContext,
        },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Astrology chat error:", error)
    return new Response("Error processing request", { status: 500 })
  }
}
