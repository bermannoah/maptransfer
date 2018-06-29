const router = require('express').Router();

const { createTransfer } = require('../services/wetransfer');
const { getTransfers, insertTransfer } = require('../services/sqlite');

router.get('/', async (request, response, next) => {
  console.log('Transfers: ', await getTransfers())
  response.json(await getTransfers());
});

router.post('/create', async (request, response, next) => {
  const file = request.files.file;
  const latitude = request.body.latitude;
  const longitude = request.body.longitude;
  const radius = request.body.radius;

  try {
    const transfer = await createTransfer(
      'I was living at...',
      `${latitude} x ${longitude}`,
      [file]
    );

    insertTransfer({
      shortened_url: transfer,
      latitude,
      longitude,
      radius
    });

    response.json({
      transfer
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
