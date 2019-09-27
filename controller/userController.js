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
    console.log(req.body)
}



exports.home = (req, res) => {
    res.render('index')
}

