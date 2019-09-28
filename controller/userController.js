const User = require('../model/User')

exports.register = (req, res) => {
    let user = new User(req.body)
    user.register()
    .then((result) => {
        res.send(result)
    })
    .catch(err => res.send(err))

}

exports.login = (req, res) => {
    let user = new User(req.body)
    user.login()
    .then(result => {
        /* we added session to express, in app js which allows
         us to attach it to the req object. 
         We decided to attach another object 
         to sessions (user, which can be anything). 
         The obect that equals can be anything, 
         however, the user object attached to sessions 
         contains the data entered in the from. Which includes the username. */
        req.session.user = {username: user.data.username}
        res.render('logged-in-landing')
    })
    .catch(err => res.send(err))
}

exports.logout = (req, res) => {
    req.session.destroy(function() {
        res.redirect('/')
    })
}

exports.home = (req, res) => {
    //session.user will only exist if a successful login was performed.
    if (req.session.user) {
        res.render('logged-in-landing')
    } else {
        res.render('landing-page')
    }
    
}