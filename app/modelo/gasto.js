var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var gastoSchema = new Schema({   
	motivo: {type:String},
	referencia: {type:String},
	costo: {type:Number},
	fecha:{type:Date}
	
});

module.exports = mongoose.model("gasto", gastoSchema); 