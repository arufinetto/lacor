var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var paymentHealthInsuranceSchema = new Schema({
	pedido: { type: Schema.Types.ObjectId, ref: "pedido",required:true},
	healthInsurance: String,
	authorized: Boolean,
	deliveredOrder: Boolean,
	analysisNotAuthorized: [{"name":{type:String},"price":{type:Number}}],
	observations: String
},{
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
});

module.exports = mongoose.model("paymentHealthInsurance", paymentHealthInsuranceSchema);
