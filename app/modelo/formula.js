var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var formulaSchema = new Schema({  
	nombre: String, 
	valorReferencia: [String],
	orden: { type: Number, min: 1 },
	unidad : { type: String},
	analisis:{ type: Schema.Types.ObjectId, ref: "analisis"},

});

module.exports = mongoose.model("formula", formulaSchema);  
