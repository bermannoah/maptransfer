(function(){
  const transfers = [];

  const transfersList = document.getElementById('transfers');
  const transfersForm = document.getElementById('create-transfer');

  function appendNewTransfer(transfer) {
    const newListItem = document.createElement('li');
    newListItem.innerHTML = transfer;
    transfersList.appendChild(newListItem);
  }

  fetch('/transfers')
    .then((response) => response.json())
    .then((transfers) => transfers.forEach(appendNewTransfer));

  transfersForm.addEventListener('submit', (event) => {
    // stop our form submission from refreshing the page
    event.preventDefault();

    const data = new FormData();
    data.append('file', event.target.elements.files.files[0]);
    data.append('radius', event.target.elements.radius.value);
    data.append('latitude', event.target.elements.latitude.value);
    data.append('longitude', event.target.elements.longitude.value);

    console.log(data);

    fetch('/transfers/create', {
      method: 'POST',
      body: data
    })
      .then((response) => response.json())
      .then((success) => console.log(success))
      .catch((error) => console.log(error));
  });
})()
