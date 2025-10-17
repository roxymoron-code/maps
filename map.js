let map;
let overlay;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { ControlPosition } = await google.maps.importLibrary("core");

  map = new Map(document.getElementById("map"), {
    zoom: 2,
    center: { lat: 0, lng: 0 },
    mapId: 'DEMO_MAP_ID',
  });

  // Create the panel programmatically
  const panel = document.createElement("div");
  panel.classList.add("heatmap-panel");
  panel.innerHTML = `
    <h2>CSV Heatmap</h2>
    <div id="panel-content"><p>Loading data from '/data/disp_postcodes_latlng'...</p></div>
  `;
  map.controls[ControlPosition.TOP_LEFT].push(panel);
  const panelContent = document.getElementById("panel-content");


  overlay = new deck.GoogleMapsOverlay({});
  overlay.setMap(map);

  try {
    const response = await fetch('maps/data/disp_postcodes_latlng');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvData = await response.text();
    const data = parseCSVData(csvData);

    if (data.length > 0) {
      updateHeatmap(data);
      panelContent.innerHTML = "<p>This heatmap visualizes data loaded from the CSV file specified in the script.</p>";
    } else {
      throw new Error("No data could be parsed from the CSV. Check headers and format.");
    }
  } catch (error) {
    console.error('Error loading or processing CSV data:', error);
    panelContent.innerHTML = `<p><strong>Error:</strong> Could not load or parse the CSV data from the path '/data/disp_postcodes_latlng'.</p>
                       <p>Please ensure the file exists at that path on your server and is publicly accessible. The preview may not work if the file is not hosted, but the code will work in your local environment if the file structure is correct.</p>`;
  }
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
  const lines = text.trim().split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) {
      console.error("CSV data must have a header and at least one data row.");
      return [];
  }

  const headers = lines.toLowerCase().split(',').map(header => header.trim());
  const latIndex = headers.indexOf('latitude');
  const lngIndex = headers.indexOf('longitude');

  if (latIndex === -1 || lngIndex === -1) {
      console.error("CSV data must contain 'Latitude' and 'Longitude' columns.");
      return [];
  }

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length > Math.max(latIndex, lngIndex)) {
        const lat = parseFloat(values[latIndex]);
        const lng = parseFloat(values[lngIndex]);

        if (!isNaN(lat) && !isNaN(lng)) {
            data.push([lng, lat]);
        }
    }
  }
  return data;
}

initMap();
