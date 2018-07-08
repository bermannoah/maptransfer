(function(){
  const target = new L.circle();
  const targetDisplay = document.querySelector('#target p');
  const locationDisplay = document.querySelector('#location p');
  const distanceDisplay = document.querySelector('#distance p');

  targetDisplay.innerText = [transfer.lat.toFixed(6), transfer.long.toFixed(6)];

  window.mymap.setView([transfer.lat, transfer.long], 13);
  target
    .setLatLng({ lat: transfer.lat, lng: transfer.long })
    .setRadius(transfer.radius)
    .addTo(window.mymap);

  navigator.geolocation.getCurrentPosition(function(location) {
    const distance = L.latLng(location.coords.latitude, location.coords.longitude).distanceTo(L.latLng(transfer.lat, transfer.long));
    let distanceToCircle = distance - (transfer.radius / 2);

    // Round up to zero if below zero
    distanceToCircle = distanceToCircle < 0 ? 0 : distanceToCircle;

    locationDisplay.innerText = [location.coords.latitude.toFixed(6), location.coords.longitude.toFixed(6)];
    distanceDisplay.innerText = distanceToCircle.toFixed(0) + 'm';

    L.marker([location.coords.latitude, location.coords.longitude]).addTo(window.mymap);

    window.mymap.fitBounds([
      [location.coords.latitude, location.coords.longitude],
      [transfer.lat, transfer.long]
    ]);

    if (distance <= transfer.radius) {
      const button = document.createElement('a');
      var linkText = document.createTextNode('Go to transfer!');
      button.appendChild(linkText);
      button.setAttribute('href', transfer.link);
      button.setAttribute('target', '_blank');
      document.getElementById('message').innerHTML = button;
    } else {
      document.querySelector('#message p').innerHTML = 'You\'re too far from the target!';
    }


  }, function(error) {
    console.log(error);
  });
})();
