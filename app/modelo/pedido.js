var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');


var pedidoSchema = new Schema({
	paciente: { type: Schema.Types.ObjectId, ref: "paciente",required:false},
	animal: { type: Schema.Types.ObjectId, ref: "animal",required:false},
	medico: { type: Schema.Types.ObjectId, ref:"medico", required:true},
	protocolo: { type:Number, unique:true},
	fecha:  { type: Date },
	obrasocial:  { type: String },
	afiliado:  { type: String },
	derivador: {type:String,enum:['Ambulatorio','Derivado','Internado'],required:false, default:"Ambulatorio"},
	derivadorDescripcion:{type:String},
	diagnostico:{type:String},
	estado: { type: String, enum: ['Creado','Abierto','Para Entregar','Entregado','Invalido']},
	identificador:{type:String},
	analisisList : [{"analisis": { type: Schema.Types.ObjectId, ref: "analisis"},
	"metodo":{type:String},
	"muestra":{type:String},
	"resultado": [{"formula":{type:String},"valorHallado":{type:Array}}],
	//si el analisis no tiene formula, entonces formula en resultado va a ser null.
	"repetido": {type: Boolean},
	"imprimir": {type: Boolean},
	"observacion": {type:String}
	}]

});
autoIncrement.initialize(mongoose.connection);
pedidoSchema.plugin(autoIncrement.plugin, { model: 'pedido',field: 'protocolo',startAt:"0000000000",
incrementBy:1})

module.exports = mongoose.model("pedido", pedidoSchema);


//npm install mongoose-schema-formatdate
