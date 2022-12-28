const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const https = require('https')
const fs = require('fs')
const app = express()
app.use(express.json())
app.use(express.static('src'))
app.use(bodyParser.urlencoded({ extended: true }))

let jokeType
let jokeCategory

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs')
app.set('views', __dirname)

function validateForm(req, res, next) {
  const jokeDecoded = req.body
  const objectKeys = Object.keys(jokeDecoded)
  if (objectKeys.some(data => data == 'Single' || data == 'Two')) {
    if (
      objectKeys.some(
        data => data == 'Programming' || data == 'Misc' || data == 'Pun'
      )
    ) {
      next()
    }
  }
  res.send({
    error:
      'Missing parameter, please select at least one checkbox of each parameter.'
  })
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/', (req, res) => {
  const jokeDecoded = req.body
  const objectKeys = Object.keys(jokeDecoded)
  console.log(jokeDecoded)
  jokeType = objectKeys.filter(data => {
    if (data == 'Single' || data == 'Two') {
      //console.log(data)
      return data
    }
  })

  jokeCategory = objectKeys.filter(data => {
    if (data == 'Programming' || data == 'Misc' || data == 'Pun') {
      return data
    }
  })

  let URL
  let jokeCategoryParameters = jokeCategory.join(',')
  console.log(jokeType)
  console.log(jokeType.length)
  if (jokeType.length == 1) {
    let jokeTypeParameters = jokeType[0]
    URL = `https://v2.jokeapi.dev/joke/${jokeCategoryParameters}?blacklistFlags=nsfw,religious,racist,sexist&type=${jokeTypeParameters}`
  } else {
    URL = `https://v2.jokeapi.dev/joke/${jokeCategoryParameters}?blacklistFlags=nsfw,religious,racist,sexist`
  }

  https.get(URL, function (response) {
    response.on('data', function (data) {
      const jokeInfo = JSON.parse(data)
      if (jokeInfo.type == 'single') {
        res.render('singlejoke.ejs', { newJoke: jokeInfo.joke })
      } else if (jokeInfo.type == 'twopart') {
        res.render('twoWayJoke.ejs', {
          setup: jokeInfo.setup,
          delivery: jokeInfo.delivery
        })
      }

      res.end()
    })
  })
})

module.exports = app
