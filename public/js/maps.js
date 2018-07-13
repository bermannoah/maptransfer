(function() {
  const mymap = (window.mymap = L.map('map').setView([52.378663542, 4.9005202576], 14));
  const circle = new L.circle();

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox.streets-satellite',
    accessToken: 'pk.eyJ1IjoidGhvbWFzb2ZmaW5nYSIsImEiOiJjamc3cTlyczgwdWs0MndrbDhmeWdrd3RkIn0.44lDtgLNa9soBfbU67ASpQ'
  }).addTo(mymap);

  // Our list of range selectable values
  let radius = 400; // sets default radius
  const availableRadius = [50, 100, 200, 400, 600, 800, 1000, 5000, 20000, 50000, 100000, 250000, 500000];

  // Form elements
  const radiusInput = document.getElementById('radius');
  const latitudeInput = document.getElementById('latitude');
  const longitudeInput = document.getElementById('longitude');
  const fileInput = document.getElementById('files');
  const rangeContainer = document.querySelector('.range');
  const range = document.getElementById('range-input');

  if (!range) {
    return;
  }

  fileInput.addEventListener('input', (event) => {
    document.querySelector('.files').classList.add('done');
  });

  range.addEventListener('input', (event) => {
    const step = event.target.value - 1;
    radius = availableRadius[step];
    circle.setRadius(radius);
    rangeContainer.classList.add('done');
  });

  mymap.addEventListener('click', function(event) {
    latitudeInput.value = event.latlng.lat;
    longitudeInput.value = event.latlng.lng;
    radiusInput.value = radius;

    document.querySelector('.location').classList.add('done');
    document.getElementById('location-output').innerHTML = `${event.latlng.lat}, ${event.latlng.lng}`;

    circle
      .setLatLng(event.latlng)
      .setRadius(radius)
      .addTo(mymap);

    rangeContainer.classList.remove('disabled');
  });
})();
