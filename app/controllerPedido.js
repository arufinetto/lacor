var Pedido = require('./modelo/pedido');
var Paciente = require('./modelo/paciente');
var Animal = require('./modelo/animal');
var Ciudad = require('./modelo/ciudad');
var Prestador = require('./modelo/prestador');
var Analisis = require('./modelo/analisis');
var Formula = require('./modelo/formula');
var Medico = require('./modelo/medico');
var SMS = require('./modelo/sms');
var Counter19 = require('./modelo/counter19');
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
var async = require('async');
const { parse } = require("csv-parse");
const fs = require('fs');


//GET - Return all pedido in the DB
// con exports conseguimos modularizarlo y que pueda ser llamado desde el archivo principal de la aplicación.

exports.loadAutomaticResultOriginal = function(req, res){

	//buscar todos los pedidos abiertos
	
	    let csv = [];
		const coolPath = path.join(__dirname, 'prueba.csv');
		console.log(coolPath)
		fs.createReadStream(coolPath)
		.pipe(parse({ delimiter: ",", relax_column_count: true, ltrim: true, from_line: 1 }))
		.on("data", function(row) {	
			    //pongo en un array cada fila del archivo
				csv.push(row);
		})
		.on("end", function () {
			var identificadores = []
			var pedidos = []

		
			for( var a = 0; a< csv.length; a++){

				identificadores.push(csv[a][2])

				/*let parsed = parseInt(csv[a][2])
				
				if(!isNaN(parsed)){	
					//obtengo todos los id para buscar pedidos abiertos por paciente que coincidan con el archivo
					protocolos.push(parsed)
				}*/
				
			}

			
			Pedido.find({$and:[{'protocolo': { $in: protocolos}}, {estado: "Abierto"}]
			}, function(err, docs){
				pedidos.push(docs)

				csv.forEach(function(cs){
					docs.forEach(function(doc){
						if(cs[2] == doc.identificador){ 
							Pedido.find({'protocolo':doc.protocolo}, function(err, pedido){
								Analisis.populate(pedido, {path: "analisisList.analisis", select:{determinaciones:1,codigo:1,formula:1}},function(err,labs){
									result = labs;
									//res.status(200).jsonp(labs)
									//console.log("ver.. ", b)
				
									for(var i =0; i< result.length; i++){
										//console.log("pedido id " + labs._id + "-" + labs.protocolo)
										console.log("pedido2 id " + doc._id + "-" + doc.protocolo)

											analisis = result[i].analisisList
										
											for(var j =0; j< analisis.length; j++){
				

												for(var h=8; h<(cs[7]*3)+7; h=h+3){

													if(cs[h] == "GLUL" && analisis[j].analisis.codigo.toString() == "0412"){
														/*console.log("tiene la glucemia")
														console.log("analisis id " + analisis[j].analisis._id)
														console.log("pedido id " + doc._id)
														console.log("valor hallado " + cs[h+1])*/
														this.updateAutomaticallyRequest(doc._id, analisis[j].analisis._id, cs[h+1], res)
														
													}
													if(cs[h] == "UREL" && analisis[j].analisis.codigo.toString() == "0902"){
														console.log("tiene la uremia")
														this.updateAutomaticallyRequest(doc._id, analisis[j].analisis._id, cs[h+1], res)
								
														
													}
													if(cs[h]== "CREL" && analisis[j].analisis.codigo.toString() == "0192"){
														console.log("tiene la creatinina")
														this.updateAutomaticallyRequest(doc._id, analisis[j].analisis._id, cs[h+1], res)
								
													}
													if(cs[h]=="TGL" && analisis[j].analisis.codigo=="876"){
														console.log("tiene trigliceridos")
														this.updateAutomaticallyRequest(doc._id, analisis[j].analisis._id, cs[h+1], res)
								
														
													}
								
												}
										}
										
									}//FIN FOR RESULT
								})
							})//aca va
						}
					})

					res.status(200).json("success");
				})
				
			});

		})
		
		.on("error", function (error) {
		  console.log(error.message);
		});
}

convertDate = function(str){
const [day, month, year] = str.split('/');

var yearModified = "20" + year
const date = new Date(+yearModified, +month - 1, +day);
return date.setDate(date.getDate(), 0)
}

exports.loadAutomaticResult = function(req, res){

	//buscar todos los pedidos abiertos
	
	    let csv = [];
		//var mensaje = "success no proceso";
		var code = 200;
		var encontroIdentificador = false
		var actualizo = false
		var archivo = []
		var archivoActualizo = []
		var fechasDistintas = false
		console.log(_dirname)

		const coolPath = path.join(__dirname, 'prueba.csv');
		fs.createReadStream(coolPath)
		.pipe(parse({ delimiter: ",", relax_column_count: true, ltrim: true, from_line: 1 }))
		.on("data", function(row){
			csv.push(row);
		})
		.on("end", function() {
			Pedido.find({$and:[{_id:req.params.id}, {estado: "Abierto"}]
			}, function(err, doc){
				Analisis.populate(doc, {path: "analisisList.analisis", select:{determinaciones:1,codigo:1,formula:1}},function(err,labs){
				result = labs;
				csv.forEach(function(cs){
						if(cs[2] == doc[0].identificador){
							encontroIdentificador = true 
							archivo = cs
							//console.log("Dif:... ", convertDate(cs[6]) - (new Date(doc[0].fecha)))
							//console.log("fecha del sistema... " )

							const threeDays = 259200000
							const dif = (convertDate(cs[6]) - new Date(doc[0].fecha))		
							if(dif < 0 || dif >= threeDays){
								fechasDistintas = true
								return;
							}
							
									
									for(var i =0; i< result.length; i++){
										//console.log("pedido id " + labs._id + "-" + labs.protocolo)
											analisis = result[i].analisisList
										
											for(var j =0; j< analisis.length; j++){
				
												for(var h=8; h<(cs[7]*3)+7; h=h+3){
													

													if(cs[h] == "GLUL" && analisis[j].analisis.codigo.toString() == "0412"){
														actualizo = true
														archivoActualizo.push(cs[h])
														this.updateAutomaticallyRequest(doc[0]._id, analisis[j].analisis._id, cs[h+1], res)
														
													}
													if(cs[h] == "UREL" && analisis[j].analisis.codigo.toString() == "0902"){
														console.log("tiene la uremia")
														actualizo = true
														archivoActualizo.push(cs[h])
														this.updateAutomaticallyRequest(doc[0]._id, analisis[j].analisis._id, cs[h+1], res)
								
														
													}
													if(cs[h]== "CREL" && analisis[j].analisis.codigo.toString() == "0192"){
														console.log("tiene la creatinina")
														actualizo = true
														archivoActualizo.push(cs[h])
														this.updateAutomaticallyRequest(doc[0]._id, analisis[j].analisis._id, cs[h+1], res)
								
													}
													if(cs[h]=="TGL" && analisis[j].analisis.codigo=="876"){
														console.log("tiene trigliceridos")
														actualizo = true
														archivoActualizo.push(cs[h])
														this.updateAutomaticallyRequest(doc[0]._id, analisis[j].analisis._id, cs[h+1], res)
														
													}
								
												}

										}
										
									}//FIN FOR RESULT
									
									
						}	
					})
							
					if(actualizo == true){
						mensaje = "Actualizo correctamente"
						code = 200
						for(var i=0; i< archivoActualizo.length; i++){
							mensaje = mensaje + " " + archivoActualizo[i]	
						}
					}else{
						var mensaje = "No hay coincidencia de estudios, estos estudios presenta en el equipo: "
						for(var i=8; i< 8+ 3*archivo[7]; i=i+3){
							mensaje = mensaje + " " + archivo[i]	
						}
					}
					//return res.status(code).json({status: code, message: mensaje})
	
					if(fechasDistintas == true){
						console.log("archivo ", archivo.length)
						mensaje = "En el archivo cargado hay registros con fechas antiguas o posteriores a los 3 días respecto al protocolo. \n Fecha encontrada: " + archivo[6]
						code = 400
					}
					if(encontroIdentificador == false){
						mensaje = "No existe en el archivo un pedido con ese identificador."
						code = 400
					}
					return res.status(code).json({message: mensaje})			

				})
						
		})
		})	
		.on("error", function (error) {
			console.log(error.message);
		  })
		.on("finish", function(){

		  });
			
}

updateAutomaticallyRequest = function(pedidoId, analisisId, value, res){
	Pedido.update({
		_id:pedidoId,
		"analisisList.analisis":analisisId,

	},

		{$set : {"analisisList.$.resultado": [{"valorHallado": [value], "formula": ""}]}
		//parseFloat(row[h+1].replace(",",".").toString())}

		   },function(err,savedPedido){
			  		Pedido.find({_id:pedidoId},function(err,savedPedido){
					if(err) res.status(500).json("Error " +err)
					//res.status(200).json(savedPedido);
				});
			}

   );
}

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
		paciente: {$arrayElemAt: [ '$paciente', 0 ]},
    fechaModified: { $dateToString: { format: "%d/%m/%Y", date: "$fecha" } },
		animal:{$arrayElemAt: [ '$animal', 0 ]},
		animalModified:{ $arrayElemAt: ["$animal.nombre", 0] },
		pacienteModified: { $concat: [ {$arrayElemAt: ["$paciente.apellido",0]}, ", ", {$arrayElemAt: ["$paciente.nombre",0]} ] },
		fecha:1,
		analisisList: 1,
		medico: {$arrayElemAt: [ '$medico', 0 ]},
		estado:1,
		protocolo:1,
		protocoloAnimal:1,
		diagnostico:1,
		derivadorDescripcion:1,
		identificador:1,
		obrasocial:1

		  }
   },

	{$sort:{protocolo:1}},
//	{$skip: skip},
	//	{$limit: perPage}
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
		identificador:1,
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

exports.updateIdentifier = function(req, res) {
    Pedido.update({
    	_id:req.params.id,
		estado: 'Abierto',
    },

		{$set : {identificador: req.body.identificador}

   		},function(err,pedido){

				Pedido.find({_id:ObjectId(req.params.id)},function(err,pedido){
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
			animal:1,
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
					Animal.populate(data, {path: "animal",select:{nombre:1}},function(err,data){
					Paciente.populate(data, {path: "paciente",select:{nombre:1,apellido:1,ciudad:1}},function(err,data){
					//Analisis.populate(data, {path: "analisisList.analisis"},function(err,data){
					Medico.populate(data, {path: "medico"},function(err,data){

							res.status(200).jsonp(data);
							});

				});

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
const { stringify } = require('querystring');



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


exports.saveResultCounter19 = function(req,res){
	//primero guardamos
//var result = "AAAI10P190000000maru10040120231010009500370007004839008055042503903180971032713441103850821503150505000000000000001000000100801022550261910182360000000000000000000000000000000000000000000000000000001002004007009510013015017020021023026029034042051056064073082095109122131143157171186193199204218230234240241249252255250246244237235233229223218213203196189176168160152141136129120115110106100100094092090086081079078074074075075076079079081082085088091094094097101105112111117122129131132135138142143146147152157161159161165167174175175171175177178177172173173174172168164158157155155153153150149146144140137135128129130126120120118116116113108110111107106108107102100101097097096090089088087082083080075073070068065062057054053051052048046044042041040040038038037036034035033027026026024024023022021020019018018016016014013014012010010010009010009009009009008007007006005005006005004003003004004004003003004004004003003003003003000000000000000000000000000000000000000000000000000000000000000000000000000001002003003004005006006005005004004003002002002002002001001001001001002002002002003004005006007009011015019023029036043052063075087100113128142156169182197209221230239246252255255255249246241236228219209198190179168155144134124116107100092087083078075072069067065065063062061060058056055052051049047045043042040039036036034033031030029027026024023022021019018017017016015013012011011010009009008008008007007006005005005005005004004004004004003003003003003003003002002002003003003003003003003003003003002002002002002002002002002002002002002002002002002002001001002002002001002001001001001001001001000001001001001001001001001001001001000000000000000000001001001001001001001001001000000000000000000000000000000000000000000000000000000000000000000000001002004006009013017022027033040046053061069077086095104114125135145155165173182189196202208213219223228232237239242244247248250251253254255255255254253252251250249247246243241237234229225220216211206203200197194190187183180176173170167164161159157153149146143139135131127124122119116113111108105102100097095093091088086082079076074071068065062060058056054052051050050049048047047047047047047046046046046045044043042040039037035034033032031030030029028027026025024023023023023022022022022021021020020019019018018017017017017016016015015014014014014013013013013012011010010010010009009009010010010010010010010010010010010010010010010009009009009008008007006006006005005005005004004004004004004004004004004004004004"

var result = "AAAI10P1900valentino1003312022111100640023000500363670765574261380340095303231354050256083154212049400000000000000100000010080110255026181018236000000000000000000000000000000000000000000000000000000100400600901101502002402502803103503903804104605706407508409610812013815217519320922123324425225525123924524825125125025124624823322321420519218117316415314713913112511410510510510009309108708708507907407307106806606205905805705405705505305505805806006106006106206206406606506506706606706806706706806706706807007207207107007507908108208008008208608608408508809209609709709909709809409309309810310010610710911411811511611912112712912612713413513413413814314514814514914914915214915615615615616116416316516816817317417917817617617517116816515915715415114614113212612011210710109409309408908708508207707607406706706406405906005805105004604203903803302802902902802702502502302302001601601401201001100901101001001101301301201201201201200000000000000000000000000000000000000000000000000000000000000000000000000000100200300400400500500500500400400300300300300200200200200200200200200200300300300400500600701001101401802202803504305206107208309711212614115517118520021422423323824525125425525124623923222421320219218117216215414313212411611010309909208808408007507106806606406206006005805705505205105105004604404304003903803503303203002902702602402302202102001901801801601501401301301201101101101000900900900800700600600600500500400400400400400400300400400400400300300300300300300300300200200200200200200200200200200200200200200200200200200200200200200200200200200200200100100100100100100100100100100100100100100100100100100100100100100100100100100000000000000000000000000000000000000000100100100100100100100000000000000000000000000000000000000000000000000100100100200400701101602202903704505406207107908809610511412313214215116116917818619420120821321922322823323824124424725125325525525525425325024824524223823523222922622322021721421120820520320119819619419319118918718518218017717417016716416215915715415114714413913412812311711210810410009609409209008808608408308208007907807707607607607607507507507507307207006806606406105805605405205104904804604504304204104003803703603503503503403403403403303303203103002902802802702702702702702802802802802802702702702702702802702702702702602602502502402402302202102001901801701701601601601601501501501501401401301201201201101101101101001000900900900900800800800800800800800800800800700700700700600600600600600600600600600600600600601"
var formattedResult = new Map()

formattedResult["TextIdentifier"] = result[0]
formattedResult["Version"] = result.substring(1,3)
formattedResult["LengthID"] = result.substring(3,6)
formattedResult["NumberParameter"] = result.substring(6,9)
formattedResult["NumberParameterWithFormat"] = result.substring(9,11)
formattedResult["ID"] = result.substring(11,21)
formattedResult["SampleMode"] = result.substring(21,22)
formattedResult["Month"] = result.substring(22,24)
formattedResult["Day"] = result.substring(24,26)
formattedResult["Year"] = result.substring(26,30)
formattedResult["Hour"] = result.substring(30,32)
formattedResult["Minute"] = result.substring(32,34)
formattedResult["WBC"] = result.substring(34,38)
formattedResult["Lymph#"] = result.substring(38,42)
formattedResult["Mid#"] = result.substring(42,46)
formattedResult["Gran#"] = result.substring(46,50)
formattedResult["Lymph%"] = result.substring(50,53)
formattedResult["Mid%"] = result.substring(53,56)
formattedResult["Gran%"] = result.substring(56,59)
formattedResult["RBC"] = result.substring(59,62)
formattedResult["HGB"] = result.substring(62,65)
formattedResult["MCHC"] = result.substring(65,69)
formattedResult["MCV"] = result.substring(69,73)
formattedResult["MCH"] = result.substring(73,77)
formattedResult["RDW-CV"] = result.substring(77,80)
formattedResult["HCT"] = result.substring(80,83)
formattedResult["PLT"] = result.substring(83,87)
formattedResult["MPV"] = result.substring(87,90)
formattedResult["PDW"] = result.substring(90,93)
formattedResult["PCT"] = result.substring(93,97)
formattedResult["RDW-SD"]= result.substring(97,101)

var date= formattedResult["Day"] + formattedResult["Month"] +formattedResult["Year"] 
var hour = formattedResult["Hour"] + ":" + formattedResult["Minute"] 

Counter19.find({$and:[{patientId: formattedResult["ID"]},{date:date},{hour:hour}]}, function(err, counter19) {
	if(counter19.length == 0){
		var counter19 = new Counter19({
			patientId: formattedResult["ID"],
			date: date,
			hour: hour,
			originalResult: result,
			parsedResult: JSON.stringify(formattedResult)
		})
		
		counter19.save(function(err, counter19) {
			if(err) return res.status(500).send(err.message);
			console.log("counter19:"+counter19)
			res.status(200).jsonp(counter19);
		});
	}else{
		res.status(204).jsonp(counter19);
	}
})


}

exports.getAutomaticResultCounter19 = function(req, res) {
    Counter19.find({$and:[{patientId:req.params.id},{date:req.query.date}]}, function(err, counter19) {
		if (err) return res.status(500).send(err.message)
		if (counter19.length == 0) return res.status(404).send("No result found")
		var result = []
	    for(var i=0;i<counter19.length;i++){
			var response = new Map()		
			response["patient"] = counter19[i].patientId,
			response["date"] = counter19[i].date,
			response["hour"] = counter19[i].hour,
			response["result"] = JSON.parse(counter19[i].parsedResult)
			
			result.push(response)
		}
		
		res.status(200).jsonp(result);
    });

};

/*exports.saveAutomaticallyResultCounter19 = function(data){
	var result = "AAAI10P190000000maru10032220231009009000350007004839008053042413903380971032713441103850821503150505000000000000001000000100801022550261910182360000000000000000000000000000000000000000000000000000001002004007009010013015017020021023026029034042051056064073082095109122131143157171186193199204218230234240241249252255250246244237235233229223218213203196189176168160152141136129120115110106100100094092090086081079078074074075075076079079081082085088091094094097101105112111117122129131132135138142143146147152157161159161165167174175175171175177178177172173173174172168164158157155155153153150149146144140137135128129130126120120118116116113108110111107106108107102100101097097096090089088087082083080075073070068065062057054053051052048046044042041040040038038037036034035033027026026024024023022021020019018018016016014013014012010010010009010009009009009008007007006005005006005004003003004004004003003004004004003003003003003000000000000000000000000000000000000000000000000000000000000000000000000000001002003003004005006006005005004004003002002002002002001001001001001002002002002003004005006007009011015019023029036043052063075087100113128142156169182197209221230239246252255255255249246241236228219209198190179168155144134124116107100092087083078075072069067065065063062061060058056055052051049047045043042040039036036034033031030029027026024023022021019018017017016015013012011011010009009008008008007007006005005005005005004004004004004003003003003003003003002002002003003003003003003003003003003002002002002002002002002002002002002002002002002002002001001002002002001002001001001001001001001000001001001001001001001001001001001000000000000000000001001001001001001001001001000000000000000000000000000000000000000000000000000000000000000000000001002004006009013017022027033040046053061069077086095104114125135145155165173182189196202208213219223228232237239242244247248250251253254255255255254253252251250249247246243241237234229225220216211206203200197194190187183180176173170167164161159157153149146143139135131127124122119116113111108105102100097095093091088086082079076074071068065062060058056054052051050050049048047047047047047047046046046046045044043042040039037035034033032031030030029028027026025024023023023023022022022022021021020020019019018018017017017017016016015015014014014014013013013013012011010010010010009009009010010010010010010010010010010010010010010010009009009009008008007006006006005005005005004004004004004004004004004004004004004"
	
	var formattedResult = new Map()
	
	formattedResult["TextIdentifier"] = result[0]
	formattedResult["Version"] = result.substring(1,3)
	formattedResult["LengthID"] = result.substring(3,6)
	formattedResult["NumberParameter"] = result.substring(6,9)
	formattedResult["NumberParameterWithFormat"] = result.substring(9,11)
	formattedResult["ID"] = result.substring(11,21)
	formattedResult["SampleMode"] = result.substring(21,22)
	formattedResult["Month"] = result.substring(22,24)
	formattedResult["Day"] = result.substring(24,26)
	formattedResult["Year"] = result.substring(26,30)
	formattedResult["Hour"] = result.substring(30,32)
	formattedResult["Minute"] = result.substring(32,34)
	formattedResult["WBC"] = result.substring(34,38)
	formattedResult["Lymph#"] = result.substring(38,42)
	formattedResult["Mid#"] = result.substring(42,46)
	formattedResult["Gran#"] = result.substring(46,50)
	formattedResult["Lymph%"] = result.substring(50,53)
	formattedResult["Mid%"] = result.substring(53,56)
	formattedResult["Gran%"] = result.substring(56,59)
	formattedResult["RBC"] = result.substring(59,62)
	formattedResult["HGB"] = result.substring(62,65)
	formattedResult["MCHC"] = result.substring(65,69)
	formattedResult["MCV"] = result.substring(69,73)
	formattedResult["MCH"] = result.substring(73,77)
	formattedResult["RDW-CV"] = result.substring(77,80)
	formattedResult["HCT"] = result.substring(80,83)
	formattedResult["PLT"] = result.substring(83,87)
	formattedResult["MPV"] = result.substring(87,90)
	formattedResult["PDW"] = result.substring(90,93)
	formattedResult["PCT"] = result.substring(93,97)
	formattedResult["RDW-SD"]= result.substring(97,101)
	
	var counter19 = new Counter19({
		patientId: formattedResult["ID"],
		date: formattedResult["Day"] +formattedResult["Month"] +formattedResult["Year"],
		originalResult: result,
		parsedResult: JSON.stringify(formattedResult)
	})
	
	counter19.save(function(err, counter19) {
		if(err) console.log("counter19, error :"+ err.message)
		console.log("counter19:"+counter19)
		//res.status(200).jsonp(counter19);
	});
	
	}*/