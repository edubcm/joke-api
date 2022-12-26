const express = require('express')

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

module.exports = app
