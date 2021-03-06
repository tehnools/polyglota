const express = require('express')

const langDB = require('../db/languages.db')

const router = express.Router()

// get route to get all languages (has ticket)

router.get('/', (req, res) => {
  langDB.getAllLanguages()
    .then(languages => {
      res.status(200).json(languages)
    })
    .catch(err => {
      res.status(500).send('DATABASE ERROR: ' + err.message)
    })
})

module.exports = router
