const router = require('express').Router();

const { createTransfer, getUploadUrl, completeFileUpload, finalizeTransfer } = require('../services/wetransfer');
const { insertTransfer, getTransfer } = require('../services/sqlite');

router.post('/create', async (request, response, next) => {
  const files = request.body.files;
  const latitude = request.body.latitude;
  const longitude = request.body.longitude;

  try {
    const transfer = await createTransfer(
      `I was living at... ${latitude} x ${longitude}`,
      files
    );

    response.json(transfer);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/:transferId/files/:fileId/upload-url/:partNumber', async (request, response) => {
  response.json(await getUploadUrl(
    request.params.transferId,
    request.params.fileId,
    request.params.partNumber
  ));
});

router.post('/upload-complete', async (request, response) => {
  response.json(await completeFileUpload(
    request.body.transfer,
    request.body.file
  ));
});

router.put('/:transferId/finalize', async (request, response) => {
  const transfer = await finalizeTransfer(
    request.params.transferId
  );

  const linkHash = insertTransfer({
    url: transfer.url,
    latitude: request.body.latitude,
    longitude: request.body.longitude,
    radius: request.body.radius
  });

  response.json({
    linkHash
  });
});

router.get('/:hash', async (request, response) => {
  const transfer = await getTransfer(request.params.hash);
  response.render('show', { transfer });
});

module.exports = router;
