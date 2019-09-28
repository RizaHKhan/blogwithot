const userCollection = require('../db').db().collection('users')
const validator = require('validator')
const bcrypt = require('bcryptjs')

let User = function(data) {
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function() {
    if(typeof(this.data.username) != "string") {this.data.username = ''}
    if(typeof(this.data.email) != "string") {this.data.email = ''}
    if(typeof(this.data.password) != "string") {this.data.password = ''}

    //get rid of any bogus properties
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validation = function() {

  return new Promise(async (resolve, reject) => {
        //critera's cannot be empty
    if(this.data.username == '') {this.errors.push('Username cannot be empty')}
    if(this.data.email == '') {this.errors.push('Email cannot be empty')}
    if(this.data.password == '') {this.errors.push('Password cannot be empty')}

    //length of username
    if(this.data.username.length < 3 ||
         this.data.username.length > 20){
             this.errors.push('Username much be at least 3 characters and less then 20 characters.')}

    //username is only alphanumeric
    if(!validator.isAlphanumeric(this.data.username)) {
        this.errors.push('The username can only contain letters and numbers')}

    //length of password
    if(this.data.email.length < 5 || 
        this.data.email.length > 50) {
            this.errors.push('Password much be at least 5 characters and less then 50 characters.')}

    //email validation
    if(!validator.isEmail(this.data.email)) {
        this.errors.push('Your much enter a valid email')}

    //Only if user is valid then check to see if it is already in the database
    if(this.data.username.length > 2 && 
        this.data.username.length < 21 && 
        validator.isAlphanumeric(this.data.username)) {
        let usernameExists = await userCollection.findOne({
            username: this.data.username})
        if (usernameExists) {
            this.errors.push('Username already exists in database')}
    }

    if(validator.isEmail(this.data.email)) {
        let emailExists = await userCollection.findOne({
            email: this.data.email})
        if(emailExists) {
            this.errors.push('That email already exists')}
    }

    resolve()

  })
}

User.prototype.register = function() {
  return new Promise(async (resolve, reject) => {
    
    //validate user input
    this.cleanUp()
    await this.validation()

    //insert validated information into database
    if(!this.errors.length) {

        //hash user password prior to entering into database
        let salt = bcrypt.genSaltSync(10)
        this.data.password = bcrypt.hashSync(this.data.password, salt)

        //insert 
        await userCollection.insertOne(this.data)
        resolve('Information inserted into database')
    } else {
        reject(this.errors)
    }
    })
  }

  User.prototype.login = function() {
      return new Promise((resolve, reject) => {
        
        //run this prior to reading
        this.cleanUp()

        userCollection.findOne({username: this.data.username})
            .then((attemptedUser) => {
                if(attemptedUser && 
                    bcrypt.compareSync(this.data.password, attemptedUser.password)) 
                    {
                    // this.data = attemptedUser
                    resolve(attemptedUser)
                } else {
                    reject('Invalid Username / Password')
                }
            })
            .catch(function() {
                //error at the database, not in the code
                reject('Please try again later')
            })
      })
  }

module.exports = User