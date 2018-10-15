var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var ingresoSchema = new Schema({  
	pedido:{ type: Schema.Types.ObjectId, ref: "pedido",required:true}, 
	costo: {type:Number},
	montoTotalPagado: {type:Number},
	coseguro: {type:Number},
	montoCoseguroPagado: {type:Number}
	
});

module.exports = mongoose.model("ingreso", ingresoSchema); 