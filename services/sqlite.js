const crypto = require('crypto');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const query = {
  CREATE_TABLE: `CREATE TABLE
    if not exists transfers
    (link_hash TEXT, link TEXT, lat TEXT, long TEXT, radius TEXT)`,
  SELECT_ALL_TRANSFERS: 'SELECT * FROM transfers',
  SELECT_BY_LINK_HASH: 'SELECT * FROM transfers WHERE link_hash = ?',
  INSERT_TRANSFER: 'INSERT INTO transfers VALUES (?, ?, ?, ?, ?)'
};

let db = null;

function dbExists(filePath) {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (error) => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });
}

async function init(filePath) {
  return new Promise(async (resolve, reject) => {
    try {
      await dbExists(filePath);
      db = new sqlite3.Database(filePath);

      const rows = [];
      db.each(query.SELECT_ALL_TRANSFERS, (err, row) => {
        if (err) {
          reject(err);
        }

        rows.push(row);
      });

      resolve(rows);
    } catch(error) {
      // DB does not exist, create it
      db = new sqlite3.Database(filePath);
      db.serialize(() => {
        db.run(query.CREATE_TABLE);
        resolve();
      });
    }
  });
}

function insertTransfer(transfer) {
  const stmt = db.prepare(query.INSERT_TRANSFER);
  const link = transfer.shortened_url;
  const linkHash = crypto.createHash('md5').update(link).digest('hex');
  stmt.run(linkHash, link, transfer.latitude, transfer.longitude, transfer.radius);
  stmt.finalize();

  return linkHash;
}

function getTransfer(link_hash) {
  return new Promise(async (resolve, reject) => {
    console.log(link_hash);
    db.get(query.SELECT_BY_LINK_HASH, link_hash, (error, row) => {
      if (error) {
        reject(error);
      }

      resolve(row);
    });
  });
}

module.exports = {
  init,
  insertTransfer,
  getTransfer
};
