const router = require('express').Router();

const { createTransfer } = require('../services/wetransfer');
const { insertTransfer, getTransfer } = require('../services/sqlite');

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

    const linkHash = insertTransfer({
      shortened_url: transfer,
      latitude,
      longitude,
      radius
    });

    response.json({
      linkHash
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/:hash', async (request, response) => {
  const transfer = await getTransfer(request.params.hash);
  response.render('show', { transfer });
});

module.exports = router;
