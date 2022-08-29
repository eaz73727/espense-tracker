const express = require('express')
const router = express.Router()
const expenseTracker = require('./modules/expense-tracker')
const user = require('./modules/user')

router.use('/users', user)
router.use('/tracker', expenseTracker)

router.use('/', (req, res) => {
  res.redirect('/tracker')
})

module.exports = router