(function() {
  const transfersForm = document.getElementById('transfer-create');
  const formSubmit = document.getElementById('submit');

  if (!transfersForm) {
    return;
  }

  function createTransfer(event) {
    // Stop our form submission from refreshing the page
    event.preventDefault();

    formSubmit.disabled = true;
    formSubmit.value = 'Uploading...';

    const files = Array.from(event.target.elements.files.files).map((file) => ({
      name: file.name,
      size: file.size,
    }));

    const radius = event.target.elements.radius.value;
    const latitude = event.target.elements.latitude.value;
    const longitude = event.target.elements.longitude.value;

    fetch('/transfers/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files,
        latitude,
        longitude
      })
    })
      .then((response) => response.json())
      .then((transfer) => uploadFiles(transfer, event.target.elements.files.files))
      .then((transfer) => finalizeTransfer(transfer.id, radius, latitude, longitude))
      .then((success) => window.location.assign(`/transfers/${success.linkHash}`))
      .catch((error) => console.log(error));
  }

  async function uploadFiles(transfer, files) {
    console.info('Uploading files...');
    const fileUploads = transfer.files.map(async (file, index) => {
      console.info(`Uploading file with name ${file.name} and size ${file.size}B`);
      for (
        let partNumber = 0;
        partNumber < file.multipart.part_numbers;
        partNumber++
      ) {
        const chunkStart = partNumber * file.multipart.chunk_size;
        const chunkEnd = (partNumber + 1) * file.multipart.chunk_size;

        console.info(`Requesting upload URL for part #${partNumber+1} of ${file.multipart.part_numbers}`);
        const { url } = await fetch(
          `/transfers/${transfer.id}/files/${file.id}/upload-url/${partNumber+1}`, {
            headers: {
              'Content-Type': 'application/json',
            }
          }).then((response) => response.json());

        console.info(`Uploading chunk from ${chunkStart} to ${chunkEnd}`);
        await fetch(url, {
          method: 'PUT',
          body: files[index].slice(chunkStart, chunkEnd),
        });
      }

      // Complete file upload
      console.info(`${file.name} upload complete`);
      return await fetch(
        `/transfers/upload-complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transfer,
            file
          })
        }).then((response) => response.json());
    });

    // Wait until all files have been uploaded
    await Promise.all(fileUploads);

    return transfer;
  }

  async function finalizeTransfer(transferId, radius, latitude, longitude) {
    // Finalize transfer
    console.info('Finalize transfer!');
    return await fetch(
      `/transfers/${transferId}/finalize`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
          radius
        })
      }).then((response) => response.json());
  }

  transfersForm.addEventListener('submit', createTransfer);
})();
