var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var perfilSchema = new Schema({   
	nombre: String,
	analisisList:[{"analisis":{type: Schema.Types.ObjectId, ref: "analisis"}}]
});

module.exports = mongoose.model("perfil", perfilSchema); 