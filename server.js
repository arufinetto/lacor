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
	app=express(), //inicializamos express
	bodyParser=require('body-parser'), //para los middleware
	methodOverride=require('method-override'),
	queryParams = require('express-query-params');
	mongoose = require('mongoose');
	path = require('path'); //para hacerlo multiplataforma
	favicon = require('serve-favicon');
	//logger = require('morgan');
	cookieParser = require('cookie-parser');
	passport = require('passport');

app.configure(function() {
  app.use(function(req, res,next) {
    /*res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()*/
		res.setHeader("Access-Control-Allow-Origin", 'http://localhost:4200');
		res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept,Authorization');
		next()
});
	app.use(express.static(__dirname + '/angular'));
	app.use(bodyParser.urlencoded({extended:false})); //para los formularios
	app.use(express.bodyParser());
	app.use(methodOverride());
	app.use(queryParams());
	app.disable('x-powered-by');
	app.use(passport.initialize());
	app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

});
app.set('port', process.env.PORT || 3000 );
console.log(process.env.PORT)

//settings del server

//seccion de rutas
require('./app/routes.js')(app);
//require('./app/modelo/user');
require('./app/config/passport');


mongoose.connect('mongodb://127.0.0.1:27017/laboratorios',function(err,res){

	if(err){console.log("Error al conectarse a la db:"+err);}
    app.listen(app.get('port'),function(){
	console.log("APP por el puerto 3000");
    });
});

module.exports = app;
