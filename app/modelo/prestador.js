var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var prestadorSchema = new Schema({   
	nombre: {type:String,unique:true}
});

module.exports = mongoose.model("prestador", prestadorSchema); 