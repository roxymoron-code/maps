let map, heatmap;
let statusMessage, errorDisplay; // UI elements

// Provides sample data for the heatmap as a fallback.
const getSampleData = () => [
    new google.maps.LatLng(37.782551, -122.445368),
    new google.maps.LatLng(37.782745, -122.444586),
    new google.maps.LatLng(37.782842, -122.443688),
    new google.maps.LatLng(37.782919, -122.442815),
    new google.maps.LatLng(37.782992, -122.442112),
    new google.maps.LatLng(37.783100, -122.441461),
    new google.maps.LatLng(37.783206, -122.440829),
    new google.maps.LatLng(37.783273, -122.440324),
    new google.maps.LatLng(37.783316, -122.439878),
    new google.maps.LatLng(37.783357, -122.439498),
    new google.maps.LatLng(37.783381, -122.439169)
];

async function initMap() {
  // Get references to UI elements
  statusMessage = document.getElementById('status-message');
  errorDisplay = document.getElementById('error-display');

  // Defensive check to ensure UI elements are present before proceeding
  if (!statusMessage || !errorDisplay) {
    console.error("Fatal Error: UI elements 'status-message' or 'error-display' not found.");
    return;
  }

  const { Map } = await google.maps.importLibrary("maps");
  const { HeatmapLayer } = await google.maps.importLibrary("visualization");
  await google.maps.importLibrary("core");

  map = new Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 37.774546, lng: -122.433523 },
    mapId: 'DEMO_MAP_ID'
  });

  heatmap = new HeatmapLayer({
    data: [],
    map: map,
  });

  loadHeatmapData();

  document.getElementById("change-gradient").addEventListener("click", changeGradient);
  document.getElementById("change-radius").addEventListener("click", changeRadius);
  document.getElementById("change-opacity").addEventListener("click", changeOpacity);
}

async function loadHeatmapData() {
    try {
        statusMessage.textContent = 'Loading data from /data/heatmap-data.csv...';
        const response = await fetch('./data/heatmap-data.csv');
        if (!response.ok) {
            throw new Error('CSV file not found or failed to load.');
        }
        const csvData = await response.text();
        const points = parseCSV(csvData);
        if (points.length > 0) {
            heatmap.setData(points);
            fitBoundsToData(points);
            statusMessage.textContent = 'Successfully loaded data from /data/heatmap-data.csv.';
            clearError();
        } else {
            throw new Error('Could not parse CSV or file is empty. Ensure it has "latitude" and "longitude" columns.');
        }
    } catch (error) {
        console.warn('Heatmap data error:', error.message);
        statusMessage.textContent = 'Using sample data.';
        const samplePoints = getSampleData();
        heatmap.setData(samplePoints);
        fitBoundsToData(samplePoints);
        displayError('Could not load `/data/heatmap-data.csv`. Displaying sample data instead. Make sure your file is in the `/data` directory and has `latitude` and `longitude` columns.');
    }
}

function fitBoundsToData(points) {
    const bounds = new google.maps.LatLngBounds();
    points.forEach(p => bounds.extend(p));
    map.fitBounds(bounds);
}

function displayError(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
}

function clearError() {
    errorDisplay.style.display = 'none';
}

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) return [];
  const header = lines.toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
  const latIndex = header.indexOf('latitude');
  const lngIndex = header.indexOf('longitude');

  if (latIndex === -1 || lngIndex === -1) {
    return [];
  }

  const points = [];
  for (let i = 1; i < lines.length; i++) {
    const data = lines[i].split(',');
    if (data.length > Math.max(latIndex, lngIndex)) {
      const lat = parseFloat(data[latIndex]);
      const lng = parseFloat(data[lngIndex]);
      if (!isNaN(lat) && !isNaN(lng)) {
        points.push(new google.maps.LatLng(lat, lng));
      }
    }
  }
  return points;
}

function changeGradient() {
  const gradient = [
    "rgba(0, 255, 255, 0)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 127, 255, 1)",
    "rgba(0, 63, 255, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(0, 0, 223, 1)",
    "rgba(0, 0, 191, 1)",
    "rgba(0, 0, 159, 1)",
    "rgba(0, 0, 127, 1)",
    "rgba(63, 0, 91, 1)",
    "rgba(127, 0, 63, 1)",
    "rgba(191, 0, 31, 1)",
    "rgba(255, 0, 0, 1)",
  ];
  heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
}

function changeRadius() {
  heatmap.set("radius", heatmap.get("radius") ? null : 20);
}

function changeOpacity() {
  heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
}

initMap();
