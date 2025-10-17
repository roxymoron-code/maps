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
  const csvData = "/data/disp_postcodes_latlng.csv";

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
  const latIndex = headers.indexOf('Latitude');
  const lngIndex = headers.indexOf('Longitude');

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


