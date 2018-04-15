var User = require('./modelo/user');
//var bcrypt =require('bcrypt');

exports.register = function(req, res) {
  console.log("Registering user: " + req.body.email);
  res.status(200);
  res.json({
    "message" : "User registered: " + req.body.email
  });
};