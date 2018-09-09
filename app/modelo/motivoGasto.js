var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var motivoGastoSchema = new Schema({   
	nombre: String
});

module.exports = mongoose.model("motivoGasto", motivoGastoSchema); 