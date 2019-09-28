const User = require('../model/User')

exports.register = (req, res) => {
    let user = new User(req.body)
    user.register()
        .then(() => {
            
            req.session.user = {username: user.data.username, _id: user.data._id}
            req.session.save(function() {
                res.redirect('/')
            })
        })
        .catch(err => {
            req.flash('errors', err)
            req.session.save(function() {
                res.redirect('/registration');
            })
        })
}

exports.login = (req, res) => {
    let pizza = new User(req.body)
    pizza.login()
        .then(result => {
            /* we added session to express, in app js which allows
             us to attach it to the req object. 
             We decided to attach another object 
             to sessions (user, which can be anything). 
             The obect that equals can be anything, 
             however, the user object attached to sessions 
             contains the data entered in the from. Which includes the username. */
             
             //attach the results from the model to the session object under the variable user. 
            req.session.user = { username: result.username, _id: result._id }
            req.session.save(function() {
                res.render('logged-in-landing')
            })
        })
        .catch(err => {
            //req.session.flash.error = [e]
            req.flash('errors', err)
            req.session.save(function () {
                res.redirect('/')
            })
        })
}

exports.logout = (req, res) => {
    req.session.destroy(function () {
        res.redirect('/')
    })
}

//check if user is logged in
exports.loggedInUser = (req, res, next) => {
    if(req.session.user) {
        next()
    } else {
        req.flash('errors', 'You must be logged to perform that action')
        req.session.save(function() {
            res.redirect('/')
        })
    }
}


exports.registeration = (req, res) => {
    if (req.session.user) {
        res.render('logged-in-landing')
    } else {
        //as soon as you access the data, it also deletes itself
        res.render('registration', { errors: req.flash('errors') })
    }
}

exports.home = (req, res) => {
    //session.user will only exist if a successful login was performed.
    if (req.session.user) {
        res.render('logged-in-landing')
    } else {
        //as soon as you access the data, it also deletes itself
        res.render('landing-page', { errors: req.flash('errors') })
    }
}