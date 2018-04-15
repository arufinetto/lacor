var Paciente = require('./modelo/paciente');
//var dateFormat = require('dateformat');
//var moment = require('m');

//GET - Return all paciente in the DB
// con exports conseguimos modularizarlo y que pueda ser llamado desde el archivo principal de la aplicación.
exports.findAll = function(req, res) { 
var page = req.params.page || 1;
var perPage = 25; 
    Paciente.find({})
			.sort({apellido:1})
			.skip((perPage*page)-perPage)
			.limit(perPage)
			.exec(function(err, paciente) {
				if(err) res.send(500, err.message);
				res.status(200).jsonp(paciente);
			})
};

exports.add = function(req, res) {  
  var paciente = new Paciente({
		nombre: req.body.nombre,
		apellido: req.body.apellido,
		fechaNacimiento: req.body.fechaNacimiento,
		obraSocial: req.body.obraSocial,
		domicilio: req.body.domicilio,
		tipoDocumento: req.body.tipoDocumento,
		documento: req.body.documento,
		medicacion: req.body.medicacion,
		telefono: req.body.telefono,
		celular: req.body.celular,
		email:req.body.email,
		ciudad:req.body.ciudad
    });

    paciente.save(function(err, paciente) {
        if(err) return res.status(500).send( err.message);
    res.status(200).jsonp(paciente);
    });
};

exports.update = function(req, res) {  
    Paciente.update({
    	_id:req.params.id
    }, {

    	$set:{
			nombre: req.body.nombre,
			apellido: req.body.apellido,
			fechaNacimiento: req.body.fechaNacimiento,
			ciudad:req.body.ciudad,
			email:req.body.email,
			obraSocial:req.body.obraSocial,
			documento: req.body.documento,
			tipoDocumento: req.body.tipoDocumento,
			medicacion: req.body.medicacion,
			telefono: req.body.telefono,
			celular: req.body.celular,
			domicilio: req.body.domicilio
		
    		}

    	},function(err,paciente){
    		Paciente.find(function(err,paciente){
    			res.json(paciente);
    		});
    	}
   );
};


exports.updateObraSocial = function(req, res) {  
    Paciente.update({
    	_id:req.params.id,
		"obraSocial._id":req.params.ob_id
    }, 

    	{$set :
			{
			"obraSocial.$.obraSocial": req.body.obraSocial,
			"obraSocial.$.afiliado": req.body.afiliado
			}

    	},function(err,paciente){
    		Paciente.find({_id:req.params.id},function(err,paciente){
    			res.json(paciente);
    		});
    	}
   );
};
 exports.filter= function(req, res) {
	 Paciente.find({$or:[{apellido: {$regex: req.query.apellido, $options:"ix"}},{nombre: {$regex: req.query.apellido,$options:"ix"}},{documento: {$regex:req.query.apellido}}]},function(err,paciente){
					if(err) return res.status(500).send(err.message);
					res.status(200).jsonp(paciente);
					
    		});
			
};


exports.deletePaciente = function(req, res) {  
    Paciente.remove({
     _id:req.params.id

	},function(err,data){
		Paciente.find(function(err,data){
    			res.json(data);
    	});
	});
};
    

