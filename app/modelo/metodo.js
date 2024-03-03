var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var metodoSchema = new Schema({   
	nombre: String
});

module.exports = mongoose.model("metodo", metodoSchema); 