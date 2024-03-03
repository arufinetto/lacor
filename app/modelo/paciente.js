var mongoose = require('mongoose');  
var Schema = mongoose.Schema;  


var pacienteSchema = new Schema({  
		nombre: {type: String},
		apellido: {type: String},
		fechaNacimiento: {type:Date
		},
		domicilio: {type:String
		},
		tipoDocumento:  { type: String, enum: ['DNI','LE','LC','']},
		obraSocial: [{"obraSocial":{type:String},"afiliado":{type:String}}],
		documento: {type:String},
		medicacion: {type:String},
		telefono: {type:String},
		celular:{type:String},
		email:{type:String},
		ciudad: {type:String},
		fechaCreacion: {type:Date}
},{
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

module.exports = mongoose.model("paciente", pacienteSchema); 