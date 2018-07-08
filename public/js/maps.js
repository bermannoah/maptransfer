(function() {
  const mymap = window.mymap = L.map('mapid').setView([52.3754419819, 4.930586814], 13);
  const marker = L.marker();
  const circle = new L.circle();

  function formatter(num) {
    return num > 999 ? (num / 1000).toFixed(0) + " km" : num + " m";
  }

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidGhvbWFzb2ZmaW5nYSIsImEiOiJjamc3cTlyczgwdWs0MndrbDhmeWdrd3RkIn0.44lDtgLNa9soBfbU67ASpQ'
  }).addTo(mymap);

  // Our list of range selectable values
  let radius = 500; // sets default radius
  const availableRadius = [50, 100, 500, 1000, 5000, 20000, 50000, 100000, 250000, 500000];

  // Form elements
  const radiusInput = document.getElementById('radius');
  const latitudeInput = document.getElementById('latitude');
  const longitudeInput = document.getElementById('longitude');
  const range = document.getElementById('range-input');
  const output = document.getElementById('range-output');

  if (!output || !range) {
    return;
  }

  output.innerHTML = formatter(radius);
  range.addEventListener('input', (event) => {
    const step = event.target.value - 1;
    radius = availableRadius[step];
    output.innerHTML = formatter(radius);
    circle.setRadius(radius);
  });

  mymap.on('click', function(event) {
    latitudeInput.value = event.latlng.lat;
    longitudeInput.value = event.latlng.lng;
    radiusInput.value = radius;

    marker
      .setLatLng(event.latlng)
      .addTo(mymap);

    circle
      .setLatLng(event.latlng)
      .setRadius(radius)
      .addTo(mymap);
  });
})();
