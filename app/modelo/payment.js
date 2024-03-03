var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var paymentSchema = new Schema({
	pedido: { type: Schema.Types.ObjectId, ref: "pedido",required:true},
	totalAmount: Number,
	discount: Number,
	deliverAmount: Number,
	observations: String
},{
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
});

module.exports = mongoose.model("payment", paymentSchema);
