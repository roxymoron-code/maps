let map;
let overlay;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    zoom: 2,
    center: { lat: 0, lng: 0 },
    mapId: 'DEMO_MAP_ID',
  });

  // Sample CSV data as a multi-line string.
  // You can replace this with your own data.
  const csvData = `lat,lng
37.7749,-122.4194
34.0522,-118.2437
40.7128,-74.0060
41.8781,-87.6298
29.7604,-95.3698
39.9526,-75.1652
33.4484,-112.0740
25.7617,-80.1918
36.1699,-115.1398
47.6062,-122.3321
51.5074,-0.1278
48.8566,2.3522
35.6895,139.6917
-33.8688,151.2093
-34.6037,-58.3816
`;

  const data = parseCSVData(csvData);

  overlay = new deck.GoogleMapsOverlay({});
  overlay.setMap(map);
  updateHeatmap(data);
}

function updateHeatmap(data) {
  const heatmapLayer = new deck.HeatmapLayer({
    id: 'heatmap',
    data: data,
    getPosition: d => d,
    getWeight: 1,
    radiusPixels: 30,
  });
  overlay.setProps({ layers: [heatmapLayer] });
}

function parseCSVData(text) {
  const data = [];
  // Trim whitespace and split by new lines, filtering out empty lines
  const lines = text.trim().split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) {
      console.error("CSV data must have a header and at least one data row.");
      return [];
  }

  const headers = lines[0].toLowerCase().split(',').map(header => header.trim());
  const latIndex = headers.indexOf('lat');
  const lngIndex = headers.indexOf('lng');

  if (latIndex === -1 || lngIndex === -1) {
      console.error("CSV data must contain 'lat' and 'lng' columns.");
      return [];
  }

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length > Math.max(latIndex, lngIndex)) {
        const lat = parseFloat(values[latIndex]);
        const lng = parseFloat(values[lngIndex]);

        if (!isNaN(lat) && !isNaN(lng)) {
            // deck.gl expects data in [longitude, latitude] format
            data.push([lng, lat]);
        }
    }
  }
  return data;
}

initMap();


