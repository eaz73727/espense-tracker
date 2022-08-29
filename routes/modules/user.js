const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.post('/login', userController.postLogin)
router.get('/login', userController.pageLogin)
router.get('/register', userController.pageRegister)
router.post('/register', userController.postRegister)

module.exports = router