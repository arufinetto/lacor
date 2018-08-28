var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var libroGastoSchema = new Schema({   
	year: {type:Number},
	month: {type:Number},
	monthName: {type:String},
	gastos: [{dia:Number,referencia:String,costo: Number, motivo:String}]
});

module.exports = mongoose.model("librogasto", libroGastoSchema); 