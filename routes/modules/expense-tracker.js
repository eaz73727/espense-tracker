const express = require('express')
const router = express.Router()
const expenseTrackerController = require('../../controllers/expense-tracker-controller')

router.get('/:id/edit', expenseTrackerController.editTrackerPage)
router.post('/new', expenseTrackerController.postNewTracker)
router.get('/new', expenseTrackerController.newTrackerPage)
router.get('/', expenseTrackerController.homePage)

module.exports = router
