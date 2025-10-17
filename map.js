async function initMap() {
  const { Map } = 
    await google.maps.importLibrary("maps");
    await google.maps.importLibrary("marker");

  const map = new Map(document.getElementById("map"), {
    center: { lat: 52.396, lng: -0.725 },
    zoom: 10,
    gestureHandling: "greedy"
  });

  Papa.parse("data/disp_postcodes_latlng.csv", {
    download: true,
    header: true,
    complete: function (results) {
      results.data.forEach(row => {
        if (row.Latitude && row.Longitude) {
          const marker = new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: { lat: parseFloat(row.Latitude), lng: parseFloat(row.Longitude) },
            title: row.postcode,
          });
        }
      });
    }
  });
})();

initMap();
