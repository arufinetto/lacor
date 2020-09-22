var User = require('./modelo/user');
var ObjectId = require('mongoose').Types.ObjectId;
var passport = require('passport');
var mongoose = require('mongoose');

 /*exports.findByCode= function(req, res) {
	 Analisis.find({$or:[{determinaciones: {$regex: req.params.codigo,$options:"ix"}},{codigo: {$regex:req.params.codigo}}]},function(err,analisis){
					if(err) return res.status(500).send(err.message);
					res.status(200).jsonp(analisis);
    		});

};*/


exports.register = function(req, res) {
  var user = new User();

  user.username = req.body.username;
  user.setPassword(req.body.password);

  user.save(function(err) {
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : "OK"
    });
  });
};

exports.login = function(req, res){
    User.findOne({ username: req.body.username }, function (err, user) {
      if (err) { return res.status(500).send(err.message); }
      // Return if user not found in database
      if (!user) {
        return res.status(404).send({"message":'User not found'});
      }
      // Return if password is wrong
      if (!user.validPassword(req.body.password)) {
        return res.status(400).send({"message":'Password is wrong'});
      }
      //If credentials are correct, return the user objects
      if(user){
        var token = user.generateJwt();
        return res.status(200).send({"user": user.username, "token":token});
      }

    });
  }
