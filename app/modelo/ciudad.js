var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;  

var ciudadSchema = new Schema({  
	nombre: String
});

module.exports = mongoose.model("ciudad", ciudadSchema); 