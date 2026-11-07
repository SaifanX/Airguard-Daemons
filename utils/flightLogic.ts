import { 
  lineString, 
  length, 
  booleanIntersects, 
  polygon, 
  pointToLineDistance, 
  center, 
  point, 
  booleanPointInPolygon, 
  polygonToLine, 
  nearestPointOnLine, 
  bearing, 
  destination, 
  midpoint, 
  bbox, 
  distance 
} from '@turf/turf';
import { Coordinate, DroneSettings, ZoneType } from '../types';
import { RESTRICTED_ZONES } from '../data/zones';

export const calculatePathRisk = (
  path: Coordinate[],
  settings: DroneSettings
): { riskScore: number; violations: string[] } => {
  let riskScore = 0;
  const violations: string[] = [];

  if (path.length < 2) return { riskScore: 0, violations: [] };

  const lineCoordinates = path.map(p => [p.lng, p.lat]);
  const line = lineString(lineCoordinates);
  const isMicro = settings.model.includes('Micro');

  // 1. Altitude Violations (Drone Rules 2021, Rule 33)
  if (settings.altitude > 120) {
    const altExcess = settings.altitude - 120;
    riskScore += 40 + (altExcess * 0.15);
    violations.push(`RULE_33_BREACH: Flight altitude of ${settings.altitude}m exceeds the 120m (400ft) AGL limit for Green Zones without special ATC clearance.`);
  } else if (settings.altitude > 60 && isMicro) {
    violations.push(`CAUTION: Flight above 60m for heavy assets (>2kg) increases kinematic risk in urban corridors.`);
  }

  // 2. VLOS (Visual Line of Sight) Distances (Drone Rules 2021, Rule 36)
  const lengthKm = length(line, { units: 'kilometers' });
  if (lengthKm > 2.0) {
    const distanceRisk = Math.min(30, (lengthKm - 2.0) * 15);
    riskScore += distanceRisk;
    violations.push(`BVLOS_BREACH (RULE 36): Total vector length (${lengthKm.toFixed(2)}km) exceeds Visual Line of Sight (VLOS) operating radius of 2.0km.`);
  }

  // 3. Airspace Category Violations (Drone Rules 2021, Rule 31)
  RESTRICTED_ZONES.forEach(zone => {
    if (zone.type === ZoneType.CONTROLLED) return;

    const polyCoords = [...zone.coordinates.map(c => [c.lng, c.lat]), [zone.coordinates[0].lng, zone.coordinates[0].lat]];
    const zonePolygon = polygon([polyCoords as any]);

    const intersects = booleanIntersects(line, zonePolygon);
    
    if (intersects) {
      if (zone.type === ZoneType.CRITICAL) {
        riskScore = 100;
        violations.push(`RED_ZONE_INCURSION: Critical infrastructure breach at ${zone.name}. Rule 31 prohibits flight in No-Fly Zones without MoD/MHA security clearance.`);
      } else if (zone.type === ZoneType.RESTRICTED) {
        riskScore = Math.max(riskScore, 85);
        violations.push(`YELLOW_ZONE_VIOLATION: Flight path intersects restricted airspace at ${zone.name}. Requires active Digital Sky permit and local ATC transponder link.`);
      }
    } else if (zone.type === ZoneType.CRITICAL) {
      try {
        const distToNFZ = pointToLineDistance(center(zonePolygon), line, { units: 'meters' });
        if (distToNFZ < 500) {
          riskScore += (500 - distToNFZ) / 10;
          violations.push(`PROXIMITY_ALERT: Trajectory within ${Math.round(distToNFZ)}m of Critical Asset (${zone.name}). Maintain 500m radial clearance per security protocols.`);
        }
      } catch (e) {}
    }
  });

  return { 
    riskScore: parseFloat(Math.min(riskScore, 100).toFixed(2)), 
    violations 
  };
};

export const intelligentReroute = (
  path: Coordinate[],
  settings?: DroneSettings
): Coordinate[] => {
  if (path.length < 2) return path;

  let optimizedPath: Coordinate[] = path.map(p => ({ ...p }));
  const origin = point([optimizedPath[0].lng, optimizedPath[0].lat]);
  const MAX_VLOS_KM = 1.95; // 1.95km safe threshold under Rule 36 (2.0km max)

  const forbiddenPolygons = RESTRICTED_ZONES
    .filter(z => z.type !== ZoneType.CONTROLLED)
    .map(z => {
      const coords = [...z.coordinates.map(c => [c.lng, c.lat]), [z.coordinates[0].lng, z.coordinates[0].lat]];
      return { 
        poly: polygon([coords as any]), 
        name: z.name,
        type: z.type
      };
    });

  // Step 1: Resolve all forbidden zone polygon incursions and 500m proximity buffers
  let iterations = 0;
  const MAX_ITERATIONS = 6;

  while (iterations < MAX_ITERATIONS) {
    let changeInThisPass = false;
    
    // Check points inside polygons
    for (let i = 0; i < optimizedPath.length; i++) {
      const p = point([optimizedPath[i].lng, optimizedPath[i].lat]);
      for (const { poly } of forbiddenPolygons) {
        if (booleanPointInPolygon(p, poly)) {
          const boundary = polygonToLine(poly) as any;
          const nearest = nearestPointOnLine(boundary, p);
          const c = center(poly);
          const b = bearing(c, nearest);
          // Push 650m beyond boundary to clear the 500m proximity threshold
          const safePos = destination(nearest, 0.65, b, { units: 'kilometers' });

          optimizedPath[i] = {
            lat: safePos.geometry.coordinates[1],
            lng: safePos.geometry.coordinates[0]
          };
          changeInThisPass = true;
        }
      }
    }

    // Check line segments intersecting polygons or encroaching within 500m of critical zones
    const nextIterPath: Coordinate[] = [optimizedPath[0]];
    for (let i = 0; i < optimizedPath.length - 1; i++) {
      const p1 = optimizedPath[i];
      const p2 = optimizedPath[i+1];
      const segment = lineString([[p1.lng, p1.lat], [p2.lng, p2.lat]]);
      let detourAdded = false;

      for (const { poly } of forbiddenPolygons) {
        const intersects = booleanIntersects(segment, poly);
        let tooClose = false;
        try {
          const d = pointToLineDistance(center(poly), segment, { units: 'meters' });
          if (d < 550) tooClose = true;
        } catch (e) {}

        if (intersects || tooClose) {
          const midPoint = midpoint(point([p1.lng, p1.lat]), point([p2.lng, p2.lat]));
          const zoneCenter = center(poly);
          const b = bearing(zoneCenter, midPoint);
          const box = bbox(poly);
          const diag = distance(point([box[0], box[1]]), point([box[2], box[3]]), { units: 'kilometers' });
          
          // Generous clearance: half diameter + 650m
          const detourPoint = destination(zoneCenter, (diag / 2) + 0.65, b, { units: 'kilometers' });
          
          nextIterPath.push({
            lat: detourPoint.geometry.coordinates[1],
            lng: detourPoint.geometry.coordinates[0]
          });
          
          changeInThisPass = true;
          detourAdded = true;
          break;
        }
      }
      nextIterPath.push(p2);
    }

    optimizedPath = nextIterPath;
    if (!changeInThisPass) break;
    iterations++;
  }

  // Step 2: Enforce Rule 36 VLOS Distance Envelope (<= 2.0km max distance rule)
  // Ensure every waypoint stays within the 1.95km legal radial envelope from take-off origin
  for (let i = 1; i < optimizedPath.length; i++) {
    const pt = point([optimizedPath[i].lng, optimizedPath[i].lat]);
    const distFromOrigin = distance(origin, pt, { units: 'kilometers' });
    
    if (distFromOrigin > MAX_VLOS_KM) {
      const b = bearing(origin, pt);
      // Clamp back to safe VLOS perimeter
      const clampedPt = destination(origin, MAX_VLOS_KM, b, { units: 'kilometers' });
      optimizedPath[i] = {
        lat: clampedPt.geometry.coordinates[1],
        lng: clampedPt.geometry.coordinates[0]
      };
    }
  }

  // Check total path length: if total vector length still exceeds 2.0km, compress intermediate legs
  const fullLine = lineString(optimizedPath.map(p => [p.lng, p.lat]));
  const totalLength = length(fullLine, { units: 'kilometers' });

  if (totalLength > 2.0 && optimizedPath.length > 2) {
    const scaleFactor = 1.95 / totalLength;
    for (let i = 1; i < optimizedPath.length; i++) {
      const pt = point([optimizedPath[i].lng, optimizedPath[i].lat]);
      const d = distance(origin, pt, { units: 'kilometers' });
      const b = bearing(origin, pt);
      const scaledPt = destination(origin, d * scaleFactor, b, { units: 'kilometers' });
      optimizedPath[i] = {
        lat: scaledPt.geometry.coordinates[1],
        lng: scaledPt.geometry.coordinates[0]
      };
    }
  }

  // Deduplicate very close points
  return optimizedPath.filter((p, i, arr) => {
    if (i === 0) return true;
    const prev = arr[i - 1];
    return Math.abs(p.lat - prev.lat) > 0.0001 || Math.abs(p.lng - prev.lng) > 0.0001;
  });
};
