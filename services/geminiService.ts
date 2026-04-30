import { RESTRICTED_ZONES } from "../data/zones";
import { ZoneType } from "../types";
import { lineString, polygon, booleanIntersects } from '@turf/turf';

export const buildFlightContext = (
  flightPath?: { lat: number, lng: number }[],
  weather?: any,
): { weatherContext: string, zoneContext: string } => {
  const weatherContext = weather 
    ? `- Weather: ${weather.condition}, Wind: ${weather.windSpeed} km/h`
    : "- Weather telemetry not synced";

  let zoneContext = "Primary airspace is clear of active restrictions.";
  if (flightPath && flightPath.length >= 2) {
    try {
      const line = lineString(flightPath.map(p => [p.lng, p.lat]));
      const intersected = RESTRICTED_ZONES.filter(zone => {
        if (zone.type === ZoneType.CONTROLLED) return false;
        const polyCoords = [...zone.coordinates.map(c => [c.lng, c.lat]), [zone.coordinates[0].lng, zone.coordinates[0].lat]];
        const poly = polygon([polyCoords as any]);
        return booleanIntersects(line, poly);
      }).map(z => z.name);
      
      if (intersected.length > 0) zoneContext = `CRITICAL: Flight vector enters restricted zones: ${intersected.join(", ")}.`;
    } catch (e) {
      console.warn("Zone intersection check failed during AI context generation");
    }
  }

  return { weatherContext, zoneContext };
};
