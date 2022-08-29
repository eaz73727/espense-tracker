const express = require('express')
const router = express.Router()
const expenseTrackerController = require('../../controllers/expense-tracker-controller')

router.get('/', expenseTrackerController.homePage)

module.exports = router