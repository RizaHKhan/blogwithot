const postCollection = require('../db').db().collection('posts')
const ObjectID = require('mongodb').ObjectID
const validator = require('validator')

let Post = function(data, userid) {
    this.data = data
    this.errors = []
    this.userid = userid
}

Post.prototype.cleanUp = function() {
    if(typeof(this.data.title) != "string") {this.data.title = ''}
    if(typeof(this.data.body) != "string") {this.data.body = ''}
    
    //get rid of any bogus properties
    this.data = {
        title: this.data.title.trim().toLowerCase(),
        body: this.data.body.trim().toLowerCase(),
        createdDate: new Date(),
        author: ObjectID(this.userid)
    }
}

Post.prototype.validate = function() {
    if(this.data.title == '' &&
    !validator.isAlphanumeric(this.data.title)) {
        this.errors.push('Title cannot be empty and must contain letters and numbers')}
    if(this.data.body == '' && 
    !validator.isAlphanumeric(this.data.body)) {
        this.errors.push('You must enter some content for your post and can only contain letters and numbers')}
   
}

Post.getSinglePost = function(id) {
    return new Promise( async (resolve, reject) => {
        if(typeof(id) != 'string' || !ObjectID.isValid(id)) {
            reject()
            return
        } else {
            let post = await postCollection.findOne({_id: new ObjectID(id)})
            post ? resolve(post) : reject()
        }
    })
}

Post.prototype.getFeed = async function(id) {
    
}

Post.prototype.createPost = function() {
    return new Promise(async (resolve, reject) => {

        this.cleanUp()
        this.validate()

        if(!this.errors.length) {
            await postCollection.insertOne(this.data)
            resolve('Your post was added to the database')
        } else {
            reject(this.errors)
        }        
    })
}

module.exports = Post