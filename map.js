async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  const map = new Map(document.getElementById("map"), {
    center: { lat: 37.422, lng: -122.084 }, // Centered on Googleplex
    zoom: 10,
    mapId: 'DEMO_MAP_ID', // Using a demo map ID
    gestureHandling: "greedy"
  });
}

initMap();
