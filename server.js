// server.js
// where your node app starts
// init project
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const createWTClient = require('@wetransfer/js-sdk');
var crypto = require('crypto');

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static('/tmp'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE if not exists transfers (link_hash TEXT, transfer_link TEXT, transfer_lat TEXT, transfer_long TEXT)');
    console.log('New table transfers created!!!');    
  }
  else {
    console.log('Database "transfers" ready to go!');
    db.each('SELECT * FROM transfers', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/show/:link_hash', (req, res) => {
  db.each('SELECT * FROM transfers WHERE link_hash = ?', req.params.link_hash, function(err,row){
    console.log(row);
    res.sendFile(__dirname + '/views/show.html', {transfer: row})
  })
});


app.post("/create", async (request, response) => {
  const file = request.files.file;
  try {
    const apiClient = await createWTClient(process.env.WT_API_SDK_KEY);
    var lat = request.body["latitude"]
    var long = request.body["longitude"]

    const transfer = await apiClient.transfer.create({
      name: "I was living at...",
      description: lat + ' x ' + long
    });
    const transferItems = await apiClient.transfer.addItems(transfer.id, [{
      content_identifier: 'file',
      local_identifier: file.name.substr(0,30),
      filename: file.name,
      filesize: file.data.length
    }]);
    await apiClient.transfer.uploadFile(transferItems[0], file.data);
    var stmt = db.prepare("INSERT INTO transfers VALUES (?, ?, ?, ?)");
      var link = transfer.shortened_url
      var link_hash = crypto.createHash('md5').update(link).digest("hex");
      var lat = request.body["latitude"]
      var long = request.body["longitude"]
    stmt.run(link_hash, link, lat, long);
    stmt.finalize();
    response.sendFile(__dirname + '/views/index.html');
  } catch (error) {
    console.log(error);
  }
})



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
var sassMiddleware = require("node-sass-middleware");

app.use(sassMiddleware({
  src: __dirname + '/public',
  dest: '/tmp',
  //debug: true,
  //outputStyle: 'compressed',
}));

// http://expressjs.com/en/starter/static-files.html

