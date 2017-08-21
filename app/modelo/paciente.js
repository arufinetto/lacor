var mongoose = require('mongoose');  
var Schema = mongoose.Schema;  


var pacienteSchema = new Schema({  
		nombre: {type: String,require:true},
		apellido: {type: String,require:true},
		fechaNacimiento: {type:Date,require:false
		},
		domicilio: {type:String,require:false
		},
		tipoDocumento:  { type: String, enum: ['DNI','LE','LC','']},
		obraSocial: [{"obraSocial":{type:String},"afiliado":{type:String}}],
		documento: {type:String,require:false},
		medicacion: {type:String,require:false},
		telefono: {type:String,require:false},
		celular:{type:String,require:false},
		email:{type:String,require:false},
		ciudad: {type:String,require:false}
});

module.exports = mongoose.model("paciente", pacienteSchema); 