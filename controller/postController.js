
const Post = require('../model/Post')

exports.createPost = (req, res) => {

    //pass in information from sessions
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

exports.getSinglePost = async (req, res) => {
    
    try {
        let post = await Post.getSinglePost(req.params.id)
        res.render('single-post-screen', {post: post})
    } catch {
        res.send('404 template goes here')
    }
}

exports.createScreen = (req, res) => {
    res.render('create-post', {success: req.flash('success')})
}
