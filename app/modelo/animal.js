var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;  

var animalSchema = new Schema({  
	nombre: String,
	raza: String,
	tipo: { type: String, enum: ['GATO','PERRO','CABALLO','VACA','CERDO','PALOMA']},
	contacto: String
});

module.exports = mongoose.model("animal", animalSchema); 