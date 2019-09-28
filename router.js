const express = require('express')
const router = express.Router()
const userController = require('./controller/userController')
const postController = require('./controller/postController')

//user related routes
router.get('/', userController.home)
router.get('/registration', (req, res) => {
    res.render('registration');   
})
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

//post related routes
router.get('/create-post', postController.createScreen)
router.post('/create-post', userController.loggedInUser, postController.createPost)

module.exports = router