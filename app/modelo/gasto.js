var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var gastoSchema = new Schema({  
	costo: {type:Number},
	fecha:{type:Date},
	motivo:{type:String},
	referencia: {type:String}
	
});

module.exports = mongoose.model("gasto", gastoSchema); 