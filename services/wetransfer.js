const https = require('https');
const createWTClient = require('@wetransfer/js-sdk');

async function createTransfer(name, description, files) {
  const wtClient = await createWTClient(process.env.wt_api_key);

  const transfer = await wtClient.transfer.create({
    name,
    description
  });

  const transferFileItems = await wtClient.transfer.addFiles(
    transfer,
    files.map((file, index) => ({
      filename: file.name,
      filesize: file.data.length
    }))
  );

  transferFileItems.forEach((item, index) => {
    // Don't hit the API limit for public keys
    setTimeout(() => wtClient.transfer.uploadFile(item, files[index].data), index * 200);
  });

  return transfer.shortened_url;
}

module.exports = {
  createTransfer
};
