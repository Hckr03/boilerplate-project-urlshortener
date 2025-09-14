require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

//mis librerias
const bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//mis midlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//mis cambios
const urlDatabase = [];
let short_url_counter = 1;

app.post('/api/shorturl', (req, res) => {
  const urlOriginal = req.body.url;
  const hostname = urlParser.parse(urlOriginal).hostname;

  dns.lookup(hostname, (err, address) => {
    if (err || !address) return res.json({ error: 'invalid url' });

    const short_url = short_url_counter++;
    urlDatabase.push({ original_url: urlOriginal, short_url });
    
    res.json({ original_url: urlOriginal, short_url });
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const short_url = parseInt(req.params.short_url);
  const found = urlDatabase.find(entry => entry.short_url === short_url);

  if (found) res.redirect(found.original_url);
  else res.json({ error: 'No short URL found for the given input' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
