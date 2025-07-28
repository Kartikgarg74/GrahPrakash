/**
 * Vedic Astrology Calculator - TypeScript Implementation
 * Converted from Python for Next.js integration
 */

interface PlanetData {
  longitude: number
  sign: string
  degree: number
  nakshatra: string
  pada: number
  house: number
}

interface ChartData {
  ascendant: PlanetData
  planets: Record<string, PlanetData>
  currentDasha: {
    mahadasha_lord: string
    balance_years: number
    nakshatra: number
  }
  yogas: string[]
  ayanamsa: number
}

export class VedicAstrologyCalculator {
  private dashaPeriods = {
    Ketu: 7,
    Venus: 20,
    Sun: 6,
    Moon: 10,
    Mars: 7,
    Rahu: 18,
    Jupiter: 16,
    Saturn: 19,
    Mercury: 17,
  }

  private nakshatraLords = [
    "Ketu",
    "Venus",
    "Sun",
    "Moon",
    "Mars",
    "Rahu",
    "Jupiter",
    "Saturn",
    "Mercury",
    "Ketu",
    "Venus",
    "Sun",
    "Moon",
    "Mars",
    "Rahu",
    "Jupiter",
    "Saturn",
    "Mercury",
    "Ketu",
    "Venus",
    "Sun",
    "Moon",
    "Mars",
    "Rahu",
    "Jupiter",
    "Saturn",
    "Mercury",
  ]

  private zodiacSigns = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ]

  private nakshatras = [
    "Ashwini",
    "Bharani",
    "Krittika",
    "Rohini",
    "Mrigashira",
    "Ardra",
    "Punarvasu",
    "Pushya",
    "Ashlesha",
    "Magha",
    "Purva Phalguni",
    "Uttara Phalguni",
    "Hasta",
    "Chitra",
    "Swati",
    "Vishakha",
    "Anuradha",
    "Jyeshtha",
    "Mula",
    "Purva Ashadha",
    "Uttara Ashadha",
    "Shravana",
    "Dhanishta",
    "Shatabhisha",
    "Purva Bhadrapada",
    "Uttara Bhadrapada",
    "Revati",
  ]

  calculateLahiriAyanamsa(date: Date): number {
    try {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()

      // Julian Day calculation
      let adjustedYear = year
      let adjustedMonth = month

      if (month <= 2) {
        adjustedYear -= 1
        adjustedMonth += 12
      }

      const a = Math.floor(adjustedYear / 100)
      const b = 2 - a + Math.floor(a / 4)
      const jd =
        Math.floor(365.25 * (adjustedYear + 4716)) + Math.floor(30.6001 * (adjustedMonth + 1)) + day + b - 1524.5

      // Lahiri Ayanamsa formula
      const t = (jd - 2451545.0) / 36525.0
      const ayanamsa = 23.85 + 0.396 * t - 0.0000309 * t * t
      const epochAdjustment = (year - 2000) * 0.0139

      return ayanamsa + epochAdjustment
    } catch (error) {
      console.error("Ayanamsa calculation error:", error)
      return 24.0
    }
  }

  calculatePlanetaryPositions(birthDate: Date, lat: number, lon: number): Record<string, PlanetData> {
    try {
      const ayanamsa = this.calculateLahiriAyanamsa(birthDate)

      // Simplified planetary calculations (in real implementation, use astronomical library)
      const planets: Record<string, PlanetData> = {}

      // Mock calculations based on date and location
      const dayOfYear = Math.floor(
        (birthDate.getTime() - new Date(birthDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
      )
      const yearFraction = dayOfYear / 365.25

      // Sun position (approximate)
      const sunLong = (280.0 + yearFraction * 360 - ayanamsa) % 360
      planets["Sun"] = this.createPlanetData(sunLong)

      // Moon position (faster moving)
      const moonLong = (sunLong + dayOfYear * 13.2 + lat * 0.1) % 360
      planets["Moon"] = this.createPlanetData(moonLong)

      // Other planets (simplified calculations)
      planets["Mars"] = this.createPlanetData((sunLong + 45 + yearFraction * 180) % 360)
      planets["Mercury"] = this.createPlanetData((sunLong + 15 + Math.sin(yearFraction * 4) * 20) % 360)
      planets["Jupiter"] = this.createPlanetData((sunLong + yearFraction * 30 + 120) % 360)
      planets["Venus"] = this.createPlanetData((sunLong + Math.sin(yearFraction * 5) * 25 + 200) % 360)
      planets["Saturn"] = this.createPlanetData((sunLong + yearFraction * 12 + 300) % 360)

      // Rahu and Ketu (opposite points)
      const rahuLong = (moonLong + 180 + Math.sin(yearFraction * 2) * 10) % 360
      planets["Rahu"] = this.createPlanetData(rahuLong)
      planets["Ketu"] = this.createPlanetData((rahuLong + 180) % 360)

      return planets
    } catch (error) {
      console.error("Planetary calculation error:", error)
      return this.getFallbackPlanets()
    }
  }

  private createPlanetData(longitude: number): PlanetData {
    const signIndex = Math.floor(longitude / 30)
    const degree = longitude % 30
    const nakshatraIndex = Math.floor(longitude / 13.333333) % 27
    const pada = Math.min(Math.floor((longitude % 13.333333) / 3.333333) + 1, 4)

    return {
      longitude,
      sign: this.zodiacSigns[signIndex],
      degree,
      nakshatra: this.nakshatras[nakshatraIndex],
      pada,
      house: 0, // Will be calculated later
    }
  }

  calculateAscendant(birthDate: Date, lat: number, lon: number): PlanetData {
    try {
      // Simplified ascendant calculation
      const hours = birthDate.getHours() + birthDate.getMinutes() / 60
      const localSiderealTime = (hours + lon / 15) * 15
      const ayanamsa = this.calculateLahiriAyanamsa(birthDate)
      const ascendantLong = (localSiderealTime - ayanamsa + lat * 0.5) % 360

      return this.createPlanetData(ascendantLong)
    } catch (error) {
      console.error("Ascendant calculation error:", error)
      return this.createPlanetData(135) // Leo ascendant as fallback
    }
  }

  calculateHousePositions(ascendantLong: number, planets: Record<string, PlanetData>): Record<string, PlanetData> {
    try {
      for (const planet of Object.values(planets)) {
        const houseDiff = (planet.longitude - ascendantLong + 360) % 360
        planet.house = Math.floor(houseDiff / 30) + 1
      }
      return planets
    } catch (error) {
      console.error("House calculation error:", error)
      return planets
    }
  }

  calculateVimshottariDasha(moonLongitude: number, birthDate: Date) {
    try {
      const nakshatraNumber = Math.floor(moonLongitude / 13.333333)
      const startingLord = this.nakshatraLords[nakshatraNumber]

      const currentDate = new Date()
      const ageYears = (currentDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)

      const positionInNakshatra = moonLongitude % 13.333333
      const remainingPortion = (13.333333 - positionInNakshatra) / 13.333333
      const balanceYears = remainingPortion * this.dashaPeriods[startingLord as keyof typeof this.dashaPeriods]

      return {
        mahadasha_lord: startingLord,
        balance_years: Math.max(balanceYears - ageYears, 0.5),
        nakshatra: nakshatraNumber + 1,
      }
    } catch (error) {
      console.error("Dasha calculation error:", error)
      return { mahadasha_lord: "Moon", balance_years: 5.0, nakshatra: 1 }
    }
  }

  identifyYogas(planets: Record<string, PlanetData>): string[] {
    const yogas: string[] = []

    try {
      // Budha-Aditya Yoga (Sun-Mercury conjunction)
      const sunMercuryDiff = Math.abs(planets["Sun"].longitude - planets["Mercury"].longitude)
      if (sunMercuryDiff <= 10 || sunMercuryDiff >= 350) {
        yogas.push("Budha-Aditya Yoga (Intelligence & Communication)")
      }

      // Gajakesari Yoga (Jupiter-Moon in kendra/trikona)
      const houseDiff = Math.abs(planets["Jupiter"].house - planets["Moon"].house)
      if ([0, 3, 6, 8].includes(houseDiff)) {
        yogas.push("Gajakesari Yoga (Wisdom & Prosperity)")
      }

      // Chandra-Mangal Yoga (Moon-Mars conjunction)
      const moonMarsDiff = Math.abs(planets["Moon"].longitude - planets["Mars"].longitude)
      if (moonMarsDiff <= 10 || moonMarsDiff >= 350) {
        yogas.push("Chandra-Mangal Yoga (Wealth & Property)")
      }

      // Raja Yoga indicators
      const kendraTrikonaHouses = [1, 4, 5, 7, 9, 10]
      const planetsInKendraTrikonas = Object.values(planets).filter((p) => kendraTrikonaHouses.includes(p.house)).length

      if (planetsInKendraTrikonas >= 3) {
        yogas.push("Raja Yoga combinations (Leadership & Success)")
      }

      // Dhana Yoga (Wealth indicators)
      if (planets["Venus"].house === 2 || planets["Jupiter"].house === 11) {
        yogas.push("Dhana Yoga (Financial Prosperity)")
      }

      return yogas.slice(0, 5) // Limit to 5 yogas
    } catch (error) {
      console.error("Yoga identification error:", error)
      return ["Basic planetary combinations present"]
    }
  }

  generateBirthChart(birthDate: Date, birthTime: string, location: string, lat: number, lon: number): ChartData {
    try {
      const planets = this.calculatePlanetaryPositions(birthDate, lat, lon)
      const ascendant = this.calculateAscendant(birthDate, lat, lon)
      const planetsWithHouses = this.calculateHousePositions(ascendant.longitude, planets)
      const dashaInfo = this.calculateVimshottariDasha(planets["Moon"].longitude, birthDate)
      const yogas = this.identifyYogas(planetsWithHouses)
      const ayanamsa = this.calculateLahiriAyanamsa(birthDate)

      return {
        ascendant,
        planets: planetsWithHouses,
        currentDasha: dashaInfo,
        yogas,
        ayanamsa,
      }
    } catch (error) {
      console.error("Chart generation error:", error)
      return this.getFallbackChart()
    }
  }

  private getFallbackPlanets(): Record<string, PlanetData> {
    return {
      Sun: { longitude: 145, sign: "Leo", degree: 25, nakshatra: "Purva Phalguni", pada: 2, house: 1 },
      Moon: { longitude: 100, sign: "Cancer", degree: 10, nakshatra: "Pushya", pada: 1, house: 12 },
      Mars: { longitude: 68, sign: "Gemini", degree: 8, nakshatra: "Mrigashira", pada: 3, house: 11 },
      Mercury: { longitude: 140, sign: "Leo", degree: 20, nakshatra: "Purva Phalguni", pada: 1, house: 1 },
      Jupiter: { longitude: 168, sign: "Virgo", degree: 18, nakshatra: "Hasta", pada: 4, house: 2 },
      Venus: { longitude: 95, sign: "Cancer", degree: 5, nakshatra: "Punarvasu", pada: 2, house: 12 },
      Saturn: { longitude: 82, sign: "Gemini", degree: 22, nakshatra: "Punarvasu", pada: 4, house: 11 },
      Rahu: { longitude: 42, sign: "Taurus", degree: 12, nakshatra: "Rohini", pada: 1, house: 10 },
      Ketu: { longitude: 222, sign: "Scorpio", degree: 12, nakshatra: "Anuradha", pada: 1, house: 4 },
    }
  }

  private getFallbackChart(): ChartData {
    return {
      ascendant: { longitude: 135, sign: "Leo", degree: 15, nakshatra: "Magha", pada: 2, house: 1 },
      planets: this.getFallbackPlanets(),
      currentDasha: { mahadasha_lord: "Moon", balance_years: 6.5, nakshatra: 9 },
      yogas: ["Budha-Aditya Yoga", "Raja Yoga combinations"],
      ayanamsa: 24.0,
    }
  }
}
