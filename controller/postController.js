
const Post = require('../model/Post')

exports.createPost = (req, res) => {
    let post = new Post(req.body)
    post.createPost()
    .then((result) => {
        req.flash('success', result)
        req.session.save(function() {
            res.redirect('/create-post')
        })
    })
    .catch(err => {
        console.log(err)
    })
}

exports.createScreen = (req, res) => {
    res.render('create-post', {success: req.flash('success')})
}
