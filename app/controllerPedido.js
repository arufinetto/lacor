var Pedido = require('./modelo/pedido');
var Paciente = require('./modelo/paciente');
var Ciudad = require('./modelo/ciudad');
var Prestador = require('./modelo/prestador');
var Analisis = require('./modelo/analisis');
var Formula = require('./modelo/formula');
var Medico = require('./modelo/medico');
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
var async = require('async');

//GET - Return all pedido in the DB
// con exports conseguimos modularizarlo y que pueda ser llamado desde el archivo principal de la aplicación.

exports.findAll = function(req, res) {  
    Pedido.aggregate([
	{$match:{estado:req.query.estado}},
			{
       $project: {
        fecha: { $dateToString: { format: "%d/%m/%Y", date: "$fecha" } },
		
		analisisList:1,
		paciente:1,
		medico:1,
		estado:1,
		protocolo:1,
		derivadorDescripcion:1
		  }
       } 
   ],function(err, pedido) {
		Paciente.populate(pedido, {path: "paciente"},function(err,pedido){
			Medico.populate(pedido, {path: "medico"},function(err,pedido){
				Analisis.populate(pedido, {path: "analisisList.analisis", select:{determinaciones:1,codigo:1,formula:1,valorReferencia:1,unidad:1,muestraDefault:1,metodoDefault:1,multiple:1}},function(err,labs){
				//Formula.populate(labs, {path: "analisisList.resultado.formula"},function(err,data){
				//Formula.populate(labs, {path: "analisisList.analisis.formula"},function(err,data){
							res.status(200).jsonp(labs);
			})
			//})
		//})
	})
	})
		
    })	

};



exports.filter = function(req, res) {  
    Pedido.find({estado:req.query.estado}, function(err, pedido) {
		Paciente.populate(pedido, {path: "paciente"},function(err,pedido){
			res.status(200).jsonp(pedido);
		})
		
    });
};


exports.getPedido = function(req, res) {  
 Pedido.aggregate([
	{$match:{_id:ObjectId(req.params.id)}},
			{
       $project: {
        fecha: { $dateToString: { format: "%d/%m/%Y", date: "$fecha" } },
		medico:1,
		analisisList:1,
		paciente:1,
		protocolo:1,
		derivadorDescripcion:1
		  }
       } 
   ],function(err, pedido) {
		Paciente.populate(pedido, {path: "paciente"},function(err,pedido){
			Medico.populate(pedido,{path: "medico"},function(err,pedido){
				Analisis.populate(pedido, {path: "analisisList.analisis", select:{determinaciones:1,codigo:1,formula:1,valorReferencia:1,unidad:1,muestraDefault:1,metodoDefault:1,multiple:1}},function(err,labs){
			
							res.status(200).jsonp(labs);

			});
			

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
		medico: req.body.medico,
		fecha: Date.now(),
		estado: req.body.estado,
		derivador: req.body.derivador,
		derivadorDescripcion: req.body.derivadorDescripcion,
		diagnostico: req.body.diagnostico,
		obrasocial: req.body.obrasocial,
		afiliado: req.body.afiliado,
		analisisList : req.body.analisisList
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

		{ $push: { 'analisisList': { analisis: req.body.analisis, muestra:req.body.muestra,metodo:req.body.metodo, resultado:req.body.resultado } }
			
   		},function(err,pedido){
    		Pedido.find(function(err,pedido){
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
		"analisisList.$.metodo": req.body.metodo}
			
   		},function(err,pedido){
			
				Pedido.find(function(err,pedido){
					if(err) res.status(500).json("Error " +err)
					res.json(pedido);
				});
			}
    	
   );
    
}

  
