const express = require('express')
const router = require('./router')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')

const app = express()

let sessionOptions = session({
    secret: 'Icannotbeguessed',
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, httpOnly: true
    }
})

app.use(sessionOptions)
app.use(flash())


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