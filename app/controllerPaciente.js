var Paciente = require('./modelo/paciente');
var Pedido= require('./modelo/pedido');
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

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

exports.findAllWithoutPag = function(req, res) {
  console.log("llega hasta aca")
    Paciente.aggregate([
			{ $project: {id:1, nombre:1, apellido:1 } },
      { $sort: { apellido:1 } },
    ],function(err, paciente) {
        console.log("response code" + err)
      	if(err) return res.send(500, err.message);
        res.status(200).jsonp(paciente);
	    });

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
		ciudad:req.body.ciudad,
		fechaCreacion: new Date()
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
	 Paciente.find({$or:[{apellido: {$regex: req.query.apellido, $options:"ix"}},{nombre: {$regex: req.query.apellido,$options:"ix"}},{documento: {$regex:req.query.apellido}}]},
   null,{sort: {apellido:1}},
   function(err,paciente){
					if(err) return res.status(500).send(err.message);
					res.status(200).jsonp(paciente);

    		});

};

exports.findPacienteById= function(req, res) {
  Paciente.find({_id: req.params.id},
  function(err,paciente){
         if(err) return res.status(500).send(err.message);
         res.status(200).jsonp(paciente);

       });

};

exports.deletePaciente = function(req, res) {

  Pedido.countDocuments({$and:[{paciente:req.params.id},{estado:{$in:['Creado','Abierto','Entregado','Para Entregar']}}]},
  function(err,result){
      if (err) return res.status(500).jsonp(err);
   if(result > 0){
      res.status(403).jsonp({message:"El paciente no se puede eliminar porque tiene pedidos asociados."})
    }else{
      Paciente.remove({
         _id:req.params.id

      },function(err,data){
          if(err) return res.status(500).send(err.message);
          res.status(200).jsonp({message:"El paciente se elimino correctamente"})
        });
    }
  })
}

exports.getPacienteByCiudad = function(req, res){
	Paciente.aggregate(
	[{$group:{_id:"$ciudad", cantidad:{$sum:1}}}, {$sort: {cantidad:-1}}],function (err, result) {
        if (err) {
            res.send(500, err);
        } else {
			//Pedido.find({},{select:{protocolo:1}},function(err,result){
				res.status(200).jsonp(result);
			//})

        }
	})
}


exports.nuevosPacientes = function(req, res) {
       var today = new Date();
		Paciente.aggregate([
		{ $project: {
			//fechaModified: { $dateToString: { format: "%d/%m/%Y", date: "$fechaCreacion" } },
			fechaCreacion:1,
			apellido:1,
			nombre:1,
			ciudad:1,
			mes:{$month:'$fechaCreacion'},
			anio:{$year:'$fechaCreacion'}
		 }
		},

		{$match: {$and:[{mes: parseInt(req.query.mes) },{anio:parseInt(req.query.anio)}]}},
		//{$group:{_id:'$fechaModified', gasto:{"$push": {motivo:"$motivo",referencia:"$referencia",costo:"$costo"}}}},


			{$sort: {fechaCreacion:1}}
		],function(err,data){
				if(err) res.send(500, err);
				res.status(200).jsonp(data);
		});

}
