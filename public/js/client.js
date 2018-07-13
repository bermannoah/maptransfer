(function() {
  const transfersForm = document.getElementById('transfer-create');

  if (!transfersForm) {
    return;
  }

  transfersForm.addEventListener('submit', (event) => {
    // stop our form submission from refreshing the page
    event.preventDefault();

    const data = new FormData();
    data.append('file', event.target.elements.files.files[0]);
    data.append('radius', event.target.elements.radius.value);
    data.append('latitude', event.target.elements.latitude.value);
    data.append('longitude', event.target.elements.longitude.value);

    fetch('/transfers/create', {
      method: 'POST',
      body: data
    })
      .then((response) => response.json())
      .then((success) => window.location.assign(`/transfers/${success.linkHash}`))
      .catch((error) => console.log(error));
  });
})();
