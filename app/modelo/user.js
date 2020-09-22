var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken'); // used for authorization
var co = require('constants');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  hash: String,
  salt: String
});

//To save the reference to the password we use the method setPassword
userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash= crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
};

//we just want to encrypt the salt and the password and see if the output matches the stored hash.
userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha512').toString('hex');
  return this.hash === hash;
};

//Adding a generateJwt method to userSchema in order to return a JWT
userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 365); // adding one day
//  expiry.setMinutes(expiry.getMinutes() + 2);

  return jwt.sign({
    _id: this._id,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, co.SECRET);
};

module.exports = mongoose.model("user", userSchema);
