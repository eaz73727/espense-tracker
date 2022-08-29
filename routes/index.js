const express = require('express')
const router = express.Router()
const expenseTracker = require('./modules/expense-tracker')

router.use('/tracker', expenseTracker)

router.use('/', (req, res) => {
  res.redirect('/tracker')
})

module.exports = router