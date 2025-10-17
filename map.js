async function initMap() {
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { LatLngBounds } = await google.maps.importLibrary("core");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const map = new Map(document.getElementById("map"), {
    center: { lat: 52.396, lng: -0.725 },
    zoom: 7,
    mapId: 'DEMO_MAP_ID',
    gestureHandling: "greedy"
  });

  // Create one InfoWindow to be reused on marker clicks.
  const infoWindow = new InfoWindow();

  // Inlined CSV data. You can replace this with a URL using the `download` property.
  const csvData = `postcode,Latitude,Longitude\nSW1A 0AA,51.5010,-0.1419\nPE35 6EN,52.8318,0.5297\nBT7 1NN,54.5843,-5.9331\nTR21 0HE,49.9360,-6.3220`;

  Papa.parse(csvData, {
    header: true,
    complete: function (results) {
      const bounds = new LatLngBounds();
      
      results.data.forEach(row => {
        if (row.Latitude && row.Longitude) {
          const position = { lat: parseFloat(row.Latitude), lng: parseFloat(row.Longitude) };
          const marker = new AdvancedMarkerElement({
            map: map,
            position: position,
            title: row.postcode,
          });

          // Add a click listener for each marker.
          marker.addListener('click', () => {
            infoWindow.close();
            infoWindow.setContent(`<b>Postcode:</b> ${marker.title}`);
            infoWindow.open(map, marker);
          });

          bounds.extend(position);
        }
      });

      // Fit the map to the bounds of the markers
      if (results.data.length > 0) {
        map.fitBounds(bounds);
      }
    },
    error: function(error) {
        console.error("Error parsing CSV:", error);
        // In a real app, you would display this error in an HTML element
    }
  });
}

initMap();

