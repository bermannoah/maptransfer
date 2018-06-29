const crypto = require('crypto');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const query = {
  CREATE_TABLE: `CREATE TABLE
    if not exists transfers
    (link_hash TEXT, transfer_link TEXT, transfer_lat TEXT, transfer_long TEXT, transfer_radius TEXT)`,
  SELECT_ALL_TRANSFERS: 'SELECT * FROM transfers',
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
  const stmt = db.prepare('INSERT INTO transfers VALUES (?, ?, ?, ?, ?)');
  const link = transfer.shortened_url;
  const link_hash = crypto.createHash('md5').update(link).digest('hex');
  stmt.run(link_hash, link, transfer.latitude, transfer.longitude, transfer.radius);
  stmt.finalize();
}

function getTransfers() {
  return new Promise(async (resolve, reject) => {
    db.all(query.SELECT_ALL_TRANSFERS, (err, rows) => {
      if (err) {
        reject(err);
      }

      resolve(rows);
    });

  });
}

module.exports = {
  init,
  insertTransfer,
  getTransfers
};
