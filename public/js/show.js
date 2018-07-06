(function(){
  const target = new L.circle();
  window.mymap.setView([transfer.lat, transfer.long], 13);
  target
    .setLatLng({ lat: transfer.lat, lng: transfer.long })
    .setRadius(transfer.radius)
    .addTo(window.mymap);

  navigator.geolocation.getCurrentPosition(function(location) {
    L.marker([location.coords.latitude, location.coords.longitude]).addTo(window.mymap);
    window.mymap.fitBounds([
      [location.coords.latitude, location.coords.longitude],
      [transfer.lat, transfer.long]
    ]);

    const distance = L.latLng(location.coords.latitude, location.coords.longitude).distanceTo(L.latLng(transfer.lat, transfer.long));
    if (distance <= transfer.radius) {
      alert('YEPA!');
    }
  }, function(error) {
    console.log(error);
  });
})();
