var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;  

var analisisSchema = new Schema({  
	codigo: {type:String,unique:true,require:true, validate: /[0-9]+[a-zA-Z]*[-]*/},
	determinaciones: {type:String,require:true},
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
	formula: [],
	multiple: Boolean
	
},{
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

module.exports = mongoose.model("analisis", analisisSchema); 