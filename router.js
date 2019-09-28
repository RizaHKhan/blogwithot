const express = require('express')
const router = express.Router()
const userController = require('./controller/userController')

router.get('/', userController.home)
router.get('/registration', (req, res) => {
    res.render('registration');   
})
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

module.exports = router