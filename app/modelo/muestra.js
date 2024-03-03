var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var muestraSchema = new Schema({   
	nombre: String
});

module.exports = mongoose.model("muestra", muestraSchema); 