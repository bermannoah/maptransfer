const https = require('https');
const createWTClient = require('@wetransfer/js-sdk');

async function createTransfer(message, files) {
  const wtClient = await createWTClient(process.env.wt_api_key, {
    logger: {
      level: 'silly',
    },
  });

  const transfer = await wtClient.transfer.create({
    message,
    files
  });

  return transfer;
}

async function getUploadUrl(transferId, fileId, partNumber) {
  const wtClient = await createWTClient(process.env.wt_api_key, {
    logger: {
      level: 'silly',
    },
  });

  return await wtClient.transfer.getFileUploadURL(
    transferId,
    fileId,
    partNumber
  );
}

async function completeFileUpload(transfer, file) {
  const wtClient = await createWTClient(process.env.wt_api_key, {
    logger: {
      level: 'silly',
    },
  });

  return await wtClient.transfer.completeFileUpload(
    transfer,
    file
  );
}

async function finalizeTransfer(transferId) {
  const wtClient = await createWTClient(process.env.wt_api_key, {
    logger: {
      level: 'silly',
    },
  });

  return await wtClient.transfer.finalize(
    { id: transferId }
  );
}

module.exports = {
  createTransfer,
  getUploadUrl,
  completeFileUpload,
  finalizeTransfer
};
