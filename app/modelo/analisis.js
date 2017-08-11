var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;  

var analisisSchema = new Schema({  
	codigo: String,
	determinaciones: String,
	urgencia: String,
	NI: String,
	UB: String ,
	valor: String,
	otro: String,
	valorReferencia:[String],
	unidad:String,
	muestraDefault:String,
	metodoDefault: String,
	pedidoList : [{type: Schema.ObjectId, ref: 'pedido'}],
	formula: []
	
});

module.exports = mongoose.model("analisis", analisisSchema); 