

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
  // Use named import lineString
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
  // Use named import length
  const lengthKm = length(line, { units: 'kilometers' });
  if (lengthKm > 2) {
    const distanceRisk = Math.min(30, (lengthKm - 2) * 15);
    riskScore += distanceRisk;
    violations.push(`BVLOS_CAUTION: Total vector length (${lengthKm.toFixed(2)}km) exceeds Visual Line of Sight (VLOS) operating radius of 2km. Rule 36 requires a certified BVLOS observer.`);
  }

  // 3. Airspace Category Violations (Drone Rules 2021, Rule 31)
  RESTRICTED_ZONES.forEach(zone => {
    if (zone.type === ZoneType.CONTROLLED) return;

    const polyCoords = [...zone.coordinates.map(c => [c.lng, c.lat]), [zone.coordinates[0].lng, zone.coordinates[0].lat]];
    // Use named import polygon and renamed local to avoid conflict
    const zonePolygon = polygon([polyCoords as any]);

    // Use named import booleanIntersects
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
        // Use named imports pointToLineDistance and center
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

export const intelligentReroute = (path: Coordinate[]): Coordinate[] => {
  if (path.length < 2) return path;

  let optimizedPath: Coordinate[] = path.map(p => ({ ...p }));
  let iterations = 0;
  const MAX_ITERATIONS = 4;

  const forbiddenPolygons = RESTRICTED_ZONES
    .filter(z => z.type !== ZoneType.CONTROLLED)
    .map(z => {
      const coords = [...z.coordinates.map(c => [c.lng, c.lat]), [z.coordinates[0].lng, z.coordinates[0].lat]];
      // Use named import polygon
      return { poly: polygon([coords as any]), name: z.name };
    });

  while (iterations < MAX_ITERATIONS) {
    let changeInThisPass = false;
    
    for (let i = 0; i < optimizedPath.length; i++) {
      // Use named import point
      const p = point([optimizedPath[i].lng, optimizedPath[i].lat]);
      for (const { poly } of forbiddenPolygons) {
        // Use named import booleanPointInPolygon
        if (booleanPointInPolygon(p, poly)) {
          // Use named import polygonToLine and cast to any to fix missing type export issues
          const boundary = polygonToLine(poly) as any;
          // Use named import nearestPointOnLine
          const nearest = nearestPointOnLine(boundary, p);
          // Use named import center
          const c = center(poly);
          // Use named import bearing
          const b = bearing(c, nearest);
          // Use named import destination
          const safePos = destination(nearest, 0.15, b, { units: 'kilometers' });

          optimizedPath[i] = {
            lat: safePos.geometry.coordinates[1],
            lng: safePos.geometry.coordinates[0]
          };
          changeInThisPass = true;
        }
      }
    }

    const nextIterPath: Coordinate[] = [optimizedPath[0]];
    for (let i = 0; i < optimizedPath.length - 1; i++) {
      const p1 = optimizedPath[i];
      const p2 = optimizedPath[i+1];
      // Use named import lineString
      const segment = lineString([[p1.lng, p1.lat], [p2.lng, p2.lat]]);
      let detourAdded = false;

      for (const { poly } of forbiddenPolygons) {
        // Use named import booleanIntersects
        if (booleanIntersects(segment, poly)) {
          // Use named imports midpoint and point
          const midPoint = midpoint(point([p1.lng, p1.lat]), point([p2.lng, p2.lat]));
          const zoneCenter = center(poly);
          const b = bearing(zoneCenter, midPoint);
          // Use named import bbox
          const box = bbox(poly);
          // Use named import distance
          const diag = distance(point([box[0], box[1]]), point([box[2], box[3]]), { units: 'kilometers' });
          const detourPoint = destination(zoneCenter, (diag / 2) + 0.2, b, { units: 'kilometers' });
          
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

  return optimizedPath.filter((p, i, arr) => {
    if (i === 0) return true;
    const prev = arr[i - 1];
    return Math.abs(p.lat - prev.lat) > 0.00001 || Math.abs(p.lng - prev.lng) > 0.00001;
  });
};