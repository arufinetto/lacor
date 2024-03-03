var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var counter19Schema = new Schema({
   originalResult:{type:String},
   parsedResult:{ type: String},
   patientId:{type: String},
   date:{type: String},
   hour:{type: String}

	
});

module.exports = mongoose.model("counter19", counter19Schema);