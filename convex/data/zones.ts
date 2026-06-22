
import { Zone, ZoneType } from '../types';

export const RESTRICTED_ZONES: Zone[] = [
  {
    id: 'z1',
    name: 'Kempegowda Int. Airport (KIA) - Primary Airspace',
    type: ZoneType.CRITICAL,
    coordinates: [
      { lat: 13.2150, lng: 77.6800 },
      { lat: 13.2200, lng: 77.7300 },
      { lat: 13.2000, lng: 77.7450 },
      { lat: 13.1800, lng: 77.7400 },
      { lat: 13.1750, lng: 77.6950 },
      { lat: 13.1850, lng: 77.6750 },
    ],
  },
  {
    id: 'z2',
    name: 'Yelahanka Air Force Station - Training Grounds',
    type: ZoneType.RESTRICTED,
    coordinates: [
      { lat: 13.1550, lng: 77.5950 },
      { lat: 13.1500, lng: 77.6250 },
      { lat: 13.1300, lng: 77.6350 },
      { lat: 13.1150, lng: 77.6200 },
      { lat: 13.1200, lng: 77.5850 },
      { lat: 13.1400, lng: 77.5800 },
    ],
  },
  {
    id: 'z3',
    name: 'Bangalore Central - High Security Corridor',
    type: ZoneType.CONTROLLED,
    coordinates: [
      { lat: 13.0100, lng: 77.5600 },
      { lat: 13.0150, lng: 77.6150 },
      { lat: 12.9850, lng: 77.6400 },
      { lat: 12.9450, lng: 77.6250 },
      { lat: 12.9400, lng: 77.5750 },
      { lat: 12.9700, lng: 77.5500 },
    ],
  },
  {
    id: 'z4',
    name: 'HAL Airspace Corridor - Industrial Sector',
    type: ZoneType.CRITICAL,
    coordinates: [
      { lat: 12.9650, lng: 77.6450 },
      { lat: 12.9550, lng: 77.6850 },
      { lat: 12.9400, lng: 77.6950 },
      { lat: 12.9350, lng: 77.6550 },
      { lat: 12.9500, lng: 77.6350 },
    ],
  }
];
