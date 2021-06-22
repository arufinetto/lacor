var Pedido = require('./modelo/pedido');
var Paciente = require('./modelo/paciente');
var Animal = require('./modelo/animal');
var Ciudad = require('./modelo/ciudad');
var Prestador = require('./modelo/prestador');
var Analisis = require('./modelo/analisis');
var Formula = require('./modelo/formula');
var Medico = require('./modelo/medico');
var SMS = require('./modelo/sms');
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
var async = require('async');

//GET - Return all pedido in the DB
// con exports conseguimos modularizarlo y que pueda ser llamado desde el archivo principal de la aplicación.

exports.findAll = function(req, res) {
var page = req.query.page || 1;
var perPage = 25;
var skip =(perPage*page)-perPage;
Pedido.aggregate([
	{$match:{estado:req.query.estado}},
	{ $lookup: { from: "medicos", localField: "medico", as:"medico",foreignField: "_id"}},
	{ $lookup: { from: "pacientes", localField: "paciente", as:"paciente",foreignField: "_id"}},
	{ $lookup: { from: "animals", localField: "animal", as:"animal",foreignField: "_id"}},
	{ $project: {
        fechaModified: { $dateToString: { format: "%d/%m/%Y", date: "$fecha" } },
		fecha:1,
		//'analisisList.analisis': 1,
		//'analisisList.resultado': 1,
		analisisList: 1,
		//analisisList: {$array:['$analisisList']},
		paciente: {$arrayElemAt: [ '$paciente', 0 ]},
		medico: {$arrayElemAt: [ '$medico', 0 ]},
		estado:1,
		protocolo:1,
		protocoloAnimal:1,
		diagnostico:1,
		derivadorDescripcion:1,
		obrasocial:1,
		animal:{$arrayElemAt: [ '$animal', 0 ]}
		  }
       },

	{$sort:{protocolo:1}},
	{$skip: skip},
		{$limit: perPage}
	], function (err, pedido) {
		Analisis.populate(pedido, {path: "analisisList.analisis", select:{determinaciones:1,codigo:1,formula:1,valorReferencia:1,unidad:1,muestraDefault:1,metodoDefault:1,multiple:1,valorReferenciaAnimal:1}},function(err,labs){

		if (err) return res.send(500, err.message)
		return res.status(200).json(pedido);
	})
	}
)

}

exports.findAllOpens = function(req, res) {

Pedido.aggregate([
	{$match:{estado:'Abierto'}},
	{ $lookup: { from: "medicos", localField: "medico", as:"medico",foreignField: "_id"}},
	{ $lookup: { from: "pacientes", localField: "paciente", as:"paciente",foreignField: "_id"}},
	{ $lookup: { from: "animals", localField: "animal", as:"animal",foreignField: "_id"}},
	{ $project: {
        fechaModified: { $dateToString: { format: "%d/%m/%Y", date: "$fecha" } },
		fecha:1,
		//'analisisList.analisis': 1,
		//'analisisList.resultado': 1,
		analisisList: 1,
		//analisisList: {$array:['$analisisList']},
		paciente: {$arrayElemAt: [ '$paciente', 0 ]},
		medico: {$arrayElemAt: [ '$medico', 0 ]},
		estado:1,
		protocolo:1,
		protocoloAnimal:1,
		diagnostico:1,
		derivadorDescripcion:1,
		obrasocial:1,
		animal:{$arrayElemAt: [ '$animal', 0 ]}
		  }
       },

	{$sort:{protocolo:1}}
	], function (err, pedido) {
		Analisis.populate(pedido, {path: "analisisList.analisis", select:{determinaciones:1,codigo:1,formula:1,valorReferencia:1,unidad:1,muestraDefault:1,metodoDefault:1,multiple:1,valorReferenciaAnimal:1}},function(err,labs){

		if (err) return res.send(500, err.message)
		return res.status(200).json(pedido);
	})
	}
)

}

exports.filter = function(req, res) {
    Pedido.find({estado:req.query.estado}).sort({fecha: 1}, function(err, pedido) {
		Animal.populate(pedido, {path: "animal"},function(err,pedido){
		Paciente.populate(pedido, {path: "paciente"},function(err,pedido){
			res.status(200).jsonp(pedido);
		})
	})
    });

};

exports.count = function(req, res) {
    Pedido.countDocuments({estado:req.query.estado}, function(err, pedido) {
			res.status(200).jsonp(pedido);

    });

};

exports.getPedidoByPaciente  = function(req, res) {
//console.log("LA FUNCION")
Pedido.aggregate([
{$match: {paciente:ObjectId(req.params.paciente)}},
{ $project: {
        fechaModified: { $dateToString: { format: "%d/%m/%Y", date: "$fecha" } },
		fecha:1,
		analisisList:1,
		paciente:1,
		animal:1,
		medico:1,
		estado:1,
		protocolo:1,
		diagnostico:1,
		derivadorDescripcion:1
		  }
       },
	   {$sort: {fecha:-1}}
], function(err, pedido){
	Paciente.populate(pedido, {path: "paciente"},function(err,pedido){
	Medico.populate(pedido, {path: "medico"},function(err,pedido){
		Analisis.populate(pedido, {path: "analisisList.analisis", select:{determinaciones:1,codigo:1,formula:1,valorReferencia:1,unidad:1,muestraDefault:1,metodoDefault:1,multiple:1}},function(err,labs){
			res.status(200).jsonp(labs);
	})
})

})
});
}


exports.getLastResult = function(req, res) {

Pedido.aggregate([
{$unwind: '$analisisList'},
{$match:{$and:[{$or:[{paciente:ObjectId(req.params.paciente)},{animal:ObjectId(req.params.paciente)}]},{estado:{$ne:"Invalido"}}, {protocolo: {$lt:Number(req.params.protocolo)}},{ 'analisisList.analisis':ObjectId(req.params.analisis) }]}},
{$project:  	{
					fecha:1,
					protocolo:1,
					diagnostico:1,
					'analisisList.analisis': 1,
					'analisisList.resultado': 1,
					'analisisList.repetido': 1,
					fechaModified: { $dateToString: { format: "%d/%m/%Y", date: "$fecha" } }
					}
	},
{$sort:{fecha: -1}},
{$limit:3},
],function(err, pedido) {
				if(err) res.send(500, err.message);
				res.status(200).jsonp(pedido);
})
}

exports.getLastResult1 = function(req, res){
	Pedido.find({},{paciente:ObjectId(req.params.paciente)},
				{estado:{$ne:"Invalido"}},
				{ 'analisisList.analisis': { $elemMatch: { analisis:ObjectId(req.params.analisis) } }},function(err, pedido) {
				if(err) res.send(500, err.message);
				res.status(200).jsonp(pedido);
})
}


exports.filterPedidoByFechaAndMedico = function(req, res) {

Pedido.aggregate([
		{
			$match:{estado:{$ne:"Invalido"}}
		},
        {
            $group: {
                _id: "$medico",  //$medico is the column name in collection
                count: {$sum: 1}
            }
        },
		{
			$sort:{count:-1}
		}
    ], function (err, result) {
        if (err) {
            res.send(500, err);
        } else {
			Medico.populate(result, {path: "_id"},function(err,result){
				res.status(200).jsonp(result);
			})
        }
    });

};

exports.filterPedidoByDiagnostico = function(req, res) {

Pedido.aggregate([
		{
			$match:{estado:{$ne:"Invalido"}}
		},
        {
            $group: {
                _id: "$diagnostico",
                count: {$sum: 1}
            }
        },
		{
			$sort:{count:-1}
		}
    ], function (err, result) {
        if (err) {
            res.send(500, err);
        } else {

			res.status(200).jsonp(result);
        }
    });

};

exports.filterPedidoByObraSocial = function(req, res) {

/*var fech=new Date(req.query.fechahasta).toISOString();
fech.setUTCHours(26,59,59)
var fech1=new Date(req.query.fechadesde).toISOString();
fech1.setUTCHours(03,00,0)
console.log("DESDE "+ fech1 +"-HASTA ")*/
Pedido.aggregate([
		{
			$match: {$and: [{estado:{$ne:"Invalido"}}]}
			//,{fecha:{$gte:fech1}},{fecha:{$lte: fech}}
		},
        {
            $group: {
                _id: "$obrasocial",
                count: {$sum: 1},
				protocolo:{"$push": {id:"$protocolo"}}
			}
        },

		{
			$sort:{count:-1}
		}

    ], function (err, result) {
        if (err) {
            res.send(500, err);
        } else {
			//Pedido.find({},{select:{protocolo:1}},function(err,result){
				res.status(200).jsonp(result);
			//})

        }
    });

};

exports.filterPedidoByAnalisis = function(req, res) {

Pedido.aggregate([
		{
			$match: {$and:[{estado:{$ne:"Invalido"}}]}

		},
		{
			 $unwind: '$analisisList'

		},
        {
            $group: {
                _id: "$analisisList.analisis",
                count: {$sum: 1}
            }
        },
		{
			$sort:{count:-1}
		}
    ], function (err, result) {
        if (err) {
            res.send(500, err);
        } else {
			Analisis.populate(result, {path: "_id",select:{determinaciones:1}},function(err,result){
				res.status(200).jsonp(result);

			})
        }
    });

};

exports.proporcionEstudiosDerivados = function(req, res) {
var start_date = new Date("2018-08-31T00:00:00.000Z");
var end_date = new Date("2018-09-31T24:59:00.000Z");

Pedido.aggregate([
{$match:{$and:[{fecha:{"$gte": start_date.toISOString()}},{fecha:{"$lte": end_date.toISOString()}}]}},
{$unwind:"$analisisList"},
{$group: {
           _id: "$analisisList.analisis",
           count: {$sum: 1}
          }},
            {$sort:{count:-1}}
        ], function (err, result) {
        if (err) {
            res.send(500, err);
        } else {
			Analisis.populate(result, {path: "_id",select:{determinaciones:1}},function(err,result){
				res.status(200).jsonp(result);

			})
        }
    });
}

exports.getPedido = function(req, res) {
 Pedido.aggregate([
	{$match:{_id:ObjectId(req.params.id)}},
			{
       $project: {
        fechaModified: { $dateToString: { format: "%d/%m/%Y", date: "$fecha" } },
		fecha:1,
		medico:1,
		analisisList:1,
		paciente:1,
		animal:1,
		protocolo:1,
		diagnostico:1,
		derivadorDescripcion:1
		  }
       }
   ],function(err, pedido) {
		Paciente.populate(pedido, {path: "paciente"},function(err,pedido){
			Medico.populate(pedido,{path: "medico"},function(err,pedido){
			Animal.populate(pedido, {path: "animal"}, function(err,pedido){
				Analisis.populate(pedido, {path: "analisisList.analisis", select:{determinaciones:1,codigo:1,formula:1,valorReferencia:1,unidad:1,muestraDefault:1,metodoDefault:1,multiple:1,valorReferenciaAnimal:1}},function(err,labs){

							res.status(200).jsonp(labs);

			});
		})

		})

		})
	})

}

exports.retrieveAnalisis = function(req, res) {
    Pedido.find({_id:req.params.id},{formulaList:1}, function(err, pedido) {
		Analisis.populate(pedido, {path: "analisisList.analisis", select:{determinaciones:1,codigo:1,formula:1}},function(err,labs){

				Formula.populate(labs, {path: "analisisList.analisis.formula"},function(err,data){
							res.status(200).jsonp(data);

			});

		})
    });
};

/*exports.getCiudades= function(req, res) {
  Ciudad.find(function(err, data) {
    if(err) res.send(500, err);
        res.status(200).jsonp(data);
    },{sort:{nombre:1}},function(err,datao){
		res.status(200).jsonp(datao);
	});
};*/
exports.getPrestadores= function(req, res) {
  Prestador.find(function(err, data) {
    if(err) res.send(500, err);
        res.status(200).jsonp(data);
    });
};


exports.createPrestadores = function(req, res) {
  var prestador = new Prestador ({
	  nombre: req.body.nombre
  });
  prestador.save(function(err, data) {
    Prestador.find(function(err, data) {
		if(err) res.send(500, err);
			res.status(200).jsonp(data);
		});
  })
};
exports.getCiudades= function(req, res) {
  Ciudad.find({},null,{sort:{nombre:1}},function(err, data) {
    if(err) res.send(500, err);
        res.status(200).jsonp(data);
    });
};


exports.createCiudad = function(req, res) {
  var ciudad = new Ciudad ({
	  nombre: req.body.nombre
  });
  ciudad.save(function(err, muestra) {
    Ciudad.find({},null,{sort:{nombre:1}},function(err, data) {
		if(err) res.send(500, err);
			res.status(200).jsonp(data);
		});
  })
};


//db.getCollection('pedidos').find({_id:ObjectId("58ec4c1029cf9d7c27000006")},{formulaList:1})
exports.add = function(req, res) {
  var pedido = new Pedido({
		paciente: req.body.paciente,
		animal: req.body.animal,
		medico: req.body.medico,
		fecha: req.body.fecha,
		estado: req.body.estado,
		derivador: req.body.derivador,
		derivadorDescripcion: req.body.derivadorDescripcion,
		diagnostico: req.body.diagnostico,
		obrasocial: req.body.obrasocial,
		afiliado: req.body.afiliado,
		analisisList : req.body.analisisList,
		imprimir: req.body.imprimir
    });

    pedido.save(function(err, pedido) {
        if(err) return res.status(500).send(err.message);
		console.log("pedido:"+pedido)
		res.status(200).jsonp(pedido);
    });
};

exports.removeAnalisis = function(req, res){
	 Pedido.update({
    	_id:req.params.id,
		  estado: 'Abierto'

    },

		{$pull:{ 'analisisList': { analisis: req.body.analisis }}

   		},function(err,pedido){
				Pedido.find({estado:'Abierto'}, function(err, pedido) {
				Paciente.populate(pedido, {path: "paciente"},function(err,pedido){
				Analisis.populate(pedido, {path: "analisisList.analisis", select:{determinaciones:1,codigo:1,formula:1}},function(err,labs){
							res.status(200).jsonp(labs);

			})
			});
	});

})
}


exports.updateState = function(req, res) {
    Pedido.update({
    	_id:req.params.id
    }, {

    	$set:{
    	estado: req.body.estado,

    		}

    	},function(err,pedido){
			var est='';
			if(req.body.estado == 'Abierto') {est='Creado'}
			if(req.body.estado == 'Para Entregar') {est='Abierto'}
			if(req.body.estado == 'Entregado') {est='Para Entregar'}
			console.log(est)
    		 Pedido.find({estado:est}, function(err, pedido) {
				Paciente.populate(pedido, {path: "paciente"},function(err,pedido){
				Analisis.populate(pedido, {path: "analisisList.analisis", select:{determinaciones:1,codigo:1,formula:1}},function(err,labs){
				//Formula.populate(labs, {path: "analisisList.analisis.formula"},function(err,data){
							res.status(200).jsonp(labs);

		//	});

			})

		})
    });
    }
   );

}


exports.addAnalysis = function(req, res) {
    Pedido.update({
    	_id:req.params.id,
				estado: 'Abierto',
    },

		{ $push: { 'analisisList': { analisis: req.body.analisis, muestra:req.body.muestra,metodo:req.body.metodo, observacion:req.body.observacion,resultado:req.body.resultado } }

   		},function(err,pedido){
    		Pedido.find({estado:"Abierto"},function(err,pedido){
    			res.json(pedido);
    		});
    	}
   );

}


/*exports.deleteAnalysis = function(req, res) {
    Pedido.update({
    	_id:req.params.id,
		estado: 'Creado'
    },

		{ $pull: { 'analisisList': { analisis: req.body.analisis } }

   		},function(err,pedido){
    		Pedido.find({_id:req.params.id},function(err,pedido){
    			res.json(pedido);
    		});
    	}
   );

}*/


exports.saveResults = function(req, res) {

    Pedido.update({
    	_id:req.params.id,
		estado: 'Abierto',
		"analisisList.analisis":req.params.analisis_id,

    },

		{$set : {"analisisList.$.resultado": req.body.resultado,
		"analisisList.$.muestra": req.body.muestra,
		"analisisList.$.metodo": req.body.metodo,
		"analisisList.$.repetido": req.body.repetido,
  	"analisisList.$.imprimir": req.body.imprimir,
   	"analisisList.$.observacion": req.body.observacion}

   		},function(err,pedido){

				Pedido.find(function(err,pedido){
					if(err) res.status(500).json("Error " +err)
					res.json(pedido);
				});
			}

   );

}

exports.includeAnalysis = function(req, res) {

    Pedido.update({
    	_id:req.params.id,
		"analisisList.analisis":req.params.analisis,

		},

		{$set : {"analisisList.$.imprimir": req.body.imprimir}

   		},function(err,pedido){
			if(err) res.status(500).json("Error " +err)
				else{ res.status(200).json("Updated")}
			/*	Pedido.find({},function(err,pedido){
					if(err) res.status(500).json("Error " +err)
					res.json(pedido);
				});
			}*/
});

}

exports.saveObservaciones = function(req, res) {

    Pedido.update({
    	_id:req.params.id,
		estado: 'Abierto',
		"analisisList.analisis":req.params.analisis_id,

    },

		{$set : {"analisisList.$.observacion": req.body.observacion}

   		},function(err,pedido){

				Pedido.find(function(err,pedido){
					if(err) res.status(500).json("Error " +err)
					res.json(pedido);
				});
			}

   );

}


exports.deletePedido = function(req, res) {
    Pedido.remove({
     _id:req.params.id,
	 estado: "Invalido"

	},function(err,data){
		Pedido.find({estado:"Invalido"},function(err,data){
    			res.json(data);
    	});
	});
};


exports.nuevosPedidos = function(req, res) {
	//var currentMonth=parseInt(req.query.mes);
	//var currentYear=parseInt(req.query.anio);
    // var today = new Date(2019,02 , 01, 10, 33, 30, 0);

		Pedido.aggregate([
		{ $project: {
			fechaModified: { $dateToString: { format: "%d/%m/%Y", date: "$fecha" } },
			fecha:1,
			protocolo:1,
			paciente:1,
			medico:1,
			mes:{$month:'$fecha'},
			anio:{$year:'$fecha'},
			analisisList:1
		 }
		},

			{$match: {$and:[{mes: parseInt(req.query.mes) },{anio:parseInt(req.query.anio)}]}},

			{$sort: {fecha:1}}
		],function(err,data){

				if(err) res.send(500, err);
				else{
					Paciente.populate(data, {path: "paciente",select:{nombre:1,apellido:1,ciudad:1}},function(err,data){
					//Analisis.populate(data, {path: "analisisList.analisis"},function(err,data){
					Medico.populate(data, {path: "medico"},function(err,data){

							res.status(200).jsonp(data);
							});

				//});

		});
	}
})
}






/*function messageCallback(error, responseBody, req, res) {
		if (error === null) {

			var sms = new SMS({
		    phoneNumber: phoneNumber,
		    fecha:  new Date(),
		    reason:	`${responseBody['status']['description']}`,
		    status: `${responseBody['status']['code']}`
		    });

		    sms.save(function(err, sms) {
		       // if(err) {return res.status(500).send( err.message);}
					//	else{	res.status(200).jsonp(medico);}
		    });

				console.log(`Messaging response for messaging phone number: ${phoneNumber}` +
						` => code: ${responseBody['status']['code']}` +
						`, description: ${responseBody['status']['description']}`);
		} else {
			var sms = new SMS({
		    phoneNumber: phoneNumber,
		    fecha:  new Date(),
		    reason:	error,
		    status: `${responseBody['status']['code']}`
		    });

		    sms.save(function(err, sms) {
		        if(err) {return res.status(500).send( err.message);}
						else{	res.status(200).jsonp(medico);}
		    });

				console.error("Unable to send message. " + error);
		}
}


exports.sendSMS10 = function(req, res) {
   //client.sms.message(messageCallback, phoneNumber, message, messageType);

	 client.sms.message(function(err, reply){
            if(err){
                console.log("Error: Could not reach TeleSign's servers");
                console.error(err); // network failure likely cause for error
            }
            else{
                console.log("YAY!, the SMS message is being sent now by TeleSign!" + reply.reference_id);
                console.log(reply);

								var sms = new SMS({
							    phoneNumber: phoneNumber,
							    fecha:  new Date(),
							    referenceId: reply.reference_id,  // save the reference_id to check status of the message
									code: reply.status.code,
									description: reply.status.description,

							    });

							    sms.save(function(err, sms) {});
            }
        },
        phoneNumber,
        message,
        messageType
    );

};*/

//const message = "LACOR informa que ya se encuentran sus resultados. Puede retirarlos de LUNES a VIERNES de 17:30 a 20:00 hs, en calle 10 numero 240."+
//"/n No responda a este mensaje";
const messageType = "ARN";
var referenceId = null;
var Client = require('node-rest-client').Client;



exports.sendSMS = function(req, res){

const customerId = "69088F88-661C-45BE-BFA6-4F42A4451D1E";
const apiKey = "TN+9C3H2t60tZw0+gr8Rx9CeKMch8tAddZ93h02VAVJaTjwFE5y1bZqKLXB7pWJuCydNQKEOoaEzHf3ir+t0Ng==";

var options_auth = {
    user: customerId,
    password: apiKey,
    mimetypes: {
        json: ["application/json", "application/json;charset=utf-8"]
    }
};

var client = new Client(options_auth);
let data = customerId+":"+apiKey;
let buf = Buffer.from(data);
let encodedData = buf.toString('base64');

var phoneNumber = req.params.phoneNumber
var patientName = req.params.patientName
var message = req.params.message

//const message = "LACOR informa: sus resultados están listos.Retirar LUN-VIE 17:30-20 hs" //70caract
//const message1 = "LACOR informa: Puede retirar sus resultados de LUN a VIERN de 17-19 hs" //70 cara


if (!phoneNumber.startsWith("54")){
	phoneNumber = "54" + phoneNumber
}
//console.log("COMO MANDA EL TELEFONO " + message)
var args = {
	 data: { message: message, message_type:messageType, phone_number: phoneNumber },
	 headers: { "Content-Type":"application/x-www-form-urlencoded"},
};


client.post("https://rest-api.telesign.com/v1/messaging", args, function (data, response) {
    // parsed response body as js object

		var sms = new SMS({
			phoneNumber: phoneNumber,
			fecha:  new Date(),
			referenceId: data.reference_id,  // save the reference_id to check status of the message
			code: data.status.code,
			description: data.status.description,
			protocolo: req.params.protocolo

			});

    console.log(data)
		sms.save(function(err, sms) {});
			if(data.status.code == 290 || data.status.code == 200  || data.status.code == 10033){

				/*	const Queue = require('bull');
						const myFirstQueue = new Queue('smsNotification', 'redis://127.0.0.1:6379');


						if(data.status.code == 290 || data.status.code == 200){
							const mytasklist =
								{ referenceId: data.reference_id }
					  		myFirstQueue.add('sms', mytasklist);
						}else{
						const data1 = {
							referenceId:data.status.code
						};
							smsQueue.notify(data1)
					}*/
					res.status(200).jsonp(data.status.description);

				/*	var args1 = {
						 data: { reference_id: data.reference_id, status: {code: data.status.code, description:data.status.description }  },
						 headers: { "Content-Type":"application/x-www-form-urlencoded", "Authorization": 'Basic '+ encodedData},
					};

					client.post("https://rest-api.telesign.com/v1/messaging", args1, function (data1, response1) {
						console.log("callback " + data1)
					})*/

			}
			else{
				res.status(400).jsonp("No se pudo realizar el envio del SMS.");
			}

});

}



//var smsQueue = require('./src/lib/queue');
