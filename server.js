/*var express  = require('express');
var mongoose = require('mongoose'); 
var app      = express();
var port	 = 3000;
var path = require('path');

// Connection to DB
mongoose.connect('mongodb://localhost:27017/laboratorios', function(err, res) {
 if(err)
 {
	console.log('failed to connect to database:'+ err);
	throw err;
 }
 else{console.log('Connected to Database');}
 
});

app.configure(function() {
	app.use(express.static(__dirname + '/angular')); 
	console.log('dirname:'+__dirname)
	app.use(express.bodyParser());
});

require('./app/routes.js')(app);

app.listen(port);
console.log("APP por el puerto " + port);
----------------------------------------------------*/

var express  = require('express'),
	app=express(),
	bodyParser=require('body-parser'),
	methodOverride=require('method-override'),
	queryParams = require('express-query-params');
	mongoose = require('mongoose'); 
	path = require('path');
	favicon = require('serve-favicon');
	//logger = require('morgan');
	cookieParser = require('cookie-parser');
	passport = require('passport');

app.configure(function() {
	app.use(express.static(__dirname + '/angular')); 
	app.use(bodyParser.urlencoded({extended:false}));
	app.use(express.bodyParser());
	app.use(methodOverride());
	app.use(queryParams());
	app.disable('x-powered-by');
	app.use(passport.initialize());
});


require('./app/routes.js')(app);
mongoose.connect('mongodb://127.0.0.1:27017/laboratorios',function(err,res){

	if(err){console.log("Error al conectarse a la db:"+err);}
    app.listen(3000,function(){
	console.log("APP por el puerto 3000");
    });
});