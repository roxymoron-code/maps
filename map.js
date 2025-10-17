
// Load Google Maps and CSV data
(async function () {
  await google.maps.importLibrary("maps");
  await google.maps.importLibrary("marker");

  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 52.396, lng: -0.725 },
    zoom: 10,
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
            gmpClickable: true,
          });
        }
      });
    }
  });
})();

// Make initMap globally accessible for Google Maps callback
window.initMap = function () {
  // This function is required if using callback=initMap in the API URL
};
