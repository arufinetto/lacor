var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var smsSchema = new Schema({
	phoneNumber: {type:Number},
//	paciente: {type:String},
	code: { type:Number},
	fecha:  { type: Date },
	description:  { type: String },
	referenceId:  { type: String },
	protocolo:{type:Number}
});

module.exports = mongoose.model("sms", smsSchema);


//npm install mongoose-schema-formatdate
