const express = require('express')
const router = require('./router')
const app = express()

//add the body object to the req object
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//utilize the public files
app.use(express.static('public'))

app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)

 let port = process.env.PORT
 if (port == null || port == '') {
     port = 3000
 }

module.exports = app