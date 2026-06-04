
import { RESTRICTED_ZONES } from "../data/zones";
import { ZoneType } from "../types";
import { lineString, polygon, booleanIntersects } from '@turf/turf';

export const getCaptainCritique = async (
  askCaptainAction: any,
  userMessage: string,
  riskLevel: number,
  violations: string[],
  flightDetails: any,
  weather?: any,
  _flightStats?: { distance: number; waypoints: number },
  _telemetry?: { speed: number; heading: number; battery: number; altitudeAGL: number },
  path?: { lat: number, lng: number }[]
): Promise<string> => {
  const weatherContext = weather 
    ? `- Weather: ${weather.condition}, Wind: ${weather.windSpeed} km/h`
    : "- Weather telemetry not synced";

  let zoneContext = "Primary airspace is clear of active restrictions.";
  if (path && path.length >= 2) {
    try {
      const line = lineString(path.map(p => [p.lng, p.lat]));
      const intersected = RESTRICTED_ZONES.filter(zone => {
        if (zone.type === ZoneType.CONTROLLED) return false;
        const polyCoords = [...zone.coordinates.map(c => [c.lng, c.lat]), [zone.coordinates[0].lng, zone.coordinates[0].lat]];
        const poly = polygon([polyCoords as any]);
        return booleanIntersects(line, poly);
      }).map(z => z.name);
      
      if (intersected.length > 0) zoneContext = `CRITICAL: Flight vector enters restricted zones: ${intersected.join(", ")}.`;
    } catch (_e) {
      console.warn("Zone intersection check failed during AI context generation");
    }
  }

  const droneModelContext = `${flightDetails.model} (Operating Height: ${flightDetails.altitude}m)`;

  try {
    const text = await askCaptainAction({
      userMessage,
      riskLevel,
      violations,
      droneModelContext,
      weatherContext,
      zoneContext
    });

    return text;
  } catch (error: any) {
    console.error("Convex API Error:", error);
    return "Relay Error: Could not connect to the AI Tactical Core. Check logs.";
  }
};
