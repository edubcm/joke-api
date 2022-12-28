const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

app.use(express.json());
app.use(express.static('src'));
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname);

function validateForm(req, res, next) {
  const jokeDecoded = req.body;
  const objectKeys = Object.keys(jokeDecoded);
  console.log(objectKeys);
  if (objectKeys.some(data => data == 'single' || data == 'twopart')) {
    if (objectKeys.some(data => data == 'Programming' || data == 'Misc' || data == 'Pun')) {
      next();
    } else {
      res.sendFile(__dirname + '/error.html');
    }
  } else {
    res.sendFile(__dirname + '/error.html');
  }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', validateForm, (req, res) => {
  const jokeDecoded = req.body;
  const objectKeys = Object.keys(jokeDecoded);
  let jokeType = objectKeys.filter(data => {
    if (data == 'single' || data == 'twopart') {
      return data;
    }
  });

  let jokeCategory = objectKeys.filter(data => {
    if (data == 'Programming' || data == 'Misc' || data == 'Pun') {
      return data;
    }
  });

  let URL;
  let jokeCategoryParameters = jokeCategory.join(',');
  if (jokeType.length == 1) {
    let jokeTypeParameters = jokeType[0];
    URL = `https://v2.jokeapi.dev/joke/${jokeCategoryParameters}?blacklistFlags=nsfw,religious,racist,sexist&type=${jokeTypeParameters}`;
  } else {
    URL = `https://v2.jokeapi.dev/joke/${jokeCategoryParameters}?blacklistFlags=nsfw,religious,racist,sexist`;
  }

  https.get(URL, function (response) {
    response.on('data', function (data) {
      const jokeInfo = JSON.parse(data);
      if (jokeInfo.type == 'single') {
        res.render('singlejoke.ejs', { newJoke: jokeInfo.joke });
      } else if (jokeInfo.type == 'twopart') {
        res.render('twoWayJoke.ejs', {
          setup: jokeInfo.setup,
          delivery: jokeInfo.delivery
        });
      }

      res.end();
    });
  });
});

module.exports = app;
