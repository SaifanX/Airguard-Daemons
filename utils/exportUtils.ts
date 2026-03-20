
import { Coordinate, DroneSettings } from '../types';

export const exportToGPX = (path: Coordinate[], settings: DroneSettings) => {
  const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="AirGuard Mission Control" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>AirGuard Mission Plan</name>
    <desc>Drone Class: ${settings.model}, Altitude: ${settings.altitude}m</desc>
  </metadata>
  <rte>
    <name>Flight Path</name>`;

  const gpxFooter = `
  </rte>
</gpx>`;

  const gpxPoints = path.map((pt, i) => `
    <rtept lat="${pt.lat}" lon="${pt.lng}">
      <name>Waypoint ${i + 1}</name>
      <ele>${settings.altitude}</ele>
    </rtept>`).join('');

  const blob = new Blob([gpxHeader + gpxPoints + gpxFooter], { type: 'application/gpx+xml' });
  downloadFile(blob, `AirGuard_Mission_${Date.now()}.gpx`);
};

export const exportToKML = (path: Coordinate[], settings: DroneSettings) => {
  const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>AirGuard Mission</name>
    <Style id="flightPathStyle">
      <LineStyle>
        <color>ff00aaff</color>
        <width>4</width>
      </LineStyle>
    </Style>
    <Placemark>
      <name>Flight Path</name>
      <styleUrl>#flightPathStyle</styleUrl>
      <LineString>
        <extrude>1</extrude>
        <tessellate>1</tessellate>
        <altitudeMode>relativeToGround</altitudeMode>
        <coordinates>
          ${path.map(pt => `${pt.lng},${pt.lat},${settings.altitude}`).join('\n          ')}
        </coordinates>
      </LineString>
    </Placemark>
  </Document>
</kml>`;

  const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
  downloadFile(blob, `AirGuard_Mission_${Date.now()}.kml`);
};

const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
