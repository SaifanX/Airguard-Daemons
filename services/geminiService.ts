import { GoogleGenAI } from "@google/genai";
import { RESTRICTED_ZONES } from "../data/zones";
import { ZoneType } from "../types";
import { lineString, polygon, booleanIntersects, length } from '@turf/turf';

// Priority model list in order of tested availability
const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-3.8-flash"
];

export const getCaptainCritique = async (
  userMessage: string,
  riskLevel: number,
  violations: string[],
  flightDetails: any,
  weather?: any,
  flightStats?: { distance: number; waypoints: number },
  telemetry?: { speed: number; heading: number; battery: number; altitudeAGL: number },
  path?: { lat: number, lng: number }[]
): Promise<string> => {
  const apiKey = process.env.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("AI_COMMAND_ERROR: API_KEY is missing from environment.");
    return "Tactical link failed. System API_KEY is not configured in the environment.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const weatherContext = weather 
    ? `- Weather: ${weather.condition}, Temp: ${weather.temp}°C, Wind: ${weather.windSpeed} km/h (Safe: ${weather.isFlyable ? 'YES' : 'NO'})`
    : "- Weather telemetry not synced";

  let zoneContext = "Primary airspace is clear of active restrictions.";
  let pathDistanceKm = 0;

  if (path && path.length >= 2) {
    try {
      const line = lineString(path.map(p => [p.lng, p.lat]));
      pathDistanceKm = parseFloat(length(line, { units: 'kilometers' }).toFixed(2));
      
      const intersected = RESTRICTED_ZONES.filter(zone => {
        if (zone.type === ZoneType.CONTROLLED) return false;
        const polyCoords = [...zone.coordinates.map(c => [c.lng, c.lat]), [zone.coordinates[0].lng, zone.coordinates[0].lat]];
        const poly = polygon([polyCoords as any]);
        return booleanIntersects(line, poly);
      }).map(z => z.name);
      
      if (intersected.length > 0) {
        zoneContext = `CRITICAL: Flight vector enters restricted zones: ${intersected.join(", ")}.`;
      }
    } catch (e) {
      console.warn("Zone intersection check failed during AI context generation");
    }
  }

  const systemInstruction = `
    You are 'Guard-1' (Captain Arjun), a disciplined AI flight safety officer for AirGuard (2nd Place Winner, Stonehill TechnoFest 2026).
    Provide actionable, concise tactical flight analysis according to India Drone Rules 2021.
    
    MISSION CONTEXT:
    - Current Risk Assessment: ${riskLevel}%
    - Safety Violations: ${violations.length > 0 ? violations.join("; ") : "None Detected (100% Nominal)"}
    - Drone Config: ${flightDetails.model} (Operating Altitude: ${flightDetails.altitude}m AGL)
    - Vector Distance: ${pathDistanceKm} km
    - ${weatherContext}
    - Airspace Status: ${zoneContext}

    TACTICAL DIRECTIVE:
    - Be authoritative, concise, and professional (Indian Air Force tone).
    - If total vector exceeds 2.0 km, advise maintaining Visual Line of Sight (Rule 36).
    - If altitude exceeds 120m, cite Rule 33 ceiling restriction.
    - If risk is 0%, give clearance: "Airspace clear. Green across all sectors. You are cleared for takeoff, Pilot."
  `;

  // Model cascade: try candidate models with automatic failover
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userMessage,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (error: any) {
      console.warn(`Model ${model} unavailable (${error?.status || error?.message}), attempting failover...`);
      // If error is invalid API key, no need to retry other models
      if (error?.message?.includes("API key not valid") || error?.status === 401) {
        return "SECURITY ERROR: The tactical API key is invalid. Please check your credentials.";
      }
    }
  }

  // Resilient fallback tactical briefing if upstream Google AI Studio is experiencing temporary 503 outage
  const safeMessage = riskLevel === 0
    ? `Captain Arjun reporting: Tactical relay is operating in autonomous offline mode. Your flight corridor (${pathDistanceKm}km at ${flightDetails.altitude}m AGL) is fully compliant with India Drone Rules 2021. Airspace clear. You are cleared for launch, Pilot.`
    : `Captain Arjun warning: Tactical relay operating in autonomous contingency mode. Active safety breaches detected (${violations.join("; ")}). Drone altitude is ${flightDetails.altitude}m with risk score ${riskLevel}%. Recommend using [AUTO-FIX VECTOR] to clear no-fly buffers before takeoff.`;

  return safeMessage;
};
