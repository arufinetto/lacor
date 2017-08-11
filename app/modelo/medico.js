var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var medicoSchema = new Schema({   
	nombre: String,
	matricula: String 
});

module.exports = mongoose.model("medico", medicoSchema); 


