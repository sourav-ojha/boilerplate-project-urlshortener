require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ extended: true }));


const fs = require("fs");
app.get("/api/shorturl/:id", function (req, res) {
  const data = JSON.parse(fs.readFileSync("./data.json"));
  const id = req.params.id;
  const url = data[id]

  if (!url) {
    res.json({ error: "No short URL found for the given input" });
    return;
  }

  res.redirect(url);
});
app.post("/api/shorturl", function (req, res) {
  const data = JSON.parse(fs.readFileSync("./data.json"));
  const url = req.body.url;
  const id =Object.keys(data).length + 1

  if (!url) {
    res.json({ error: 'invalid url' });
    return;
  }

  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    res.json({ error: 'invalid url' });
    return;
  }

  data[id] =  url
  fs.writeFileSync("./data.json", JSON.stringify(data));

  res.json({
    original_url: url,
    short_url: id,
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
