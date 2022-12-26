const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
app.use(express.json())
app.use(express.static('src'))
app.use(bodyParser.urlencoded({ extended: true }))

let jokeType
let jokeCategory

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

  jokeType = objectKeys.filter(data => {
    if (data == 'Single' || data == 'Two') {
      return data
    }
  })

  jokeCategory = objectKeys.filter(data => {
    if (data == 'Programming' || data == 'Misc' || data == 'Pun') {
      return data
    }
  })

  let URL = `https://v2.jokeapi.dev/joke/Any`
  axios
    .get(URL)
    .then(response => {
      console.log(response.data)
      res.status(200).send(response.data.type)
    })
    .catch(error => {
      console.log(error)
    })
})

module.exports = app
