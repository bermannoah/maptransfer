require('dotenv').config();

const express = require('express');
const exphbs  = require('express-handlebars');
const fileUpload = require('express-fileupload');

const sqlite = require('./services/sqlite');

const app = express();
app.use(express.json());
app.use(fileUpload());

app.use(require('./routes'));

// Server static assets directly from public folder
app.use(express.static('public'));

// Register handlebars  as template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

sqlite.init('./.data/sqlite.db')
  .then(() => {
    // Register all the routes

    app.get('/', (request, response) => {
      response.render('home');
    });

    const listener = app.listen(process.env.PORT, () => {
      const port = listener.address().port;
      console.log(`Your app is listening at http://localhost:${port}/`);
    });
  });


