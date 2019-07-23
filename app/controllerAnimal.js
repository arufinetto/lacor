var Animal = require('./modelo/animal');
var moment = require('moment');


exports.create = function(req, res) {  
  var animal = new Animal ({
	  nombre: req.body.nombre,
	  tipo: req.body.tipo,
	  raza: req.body.raza,
	  contacto: req.body.contacto
  });
  animal.save(function(err, data) {
    Animal.find(function(err, data) {
		if(err) res.send(500, err);
			res.status(200).jsonp(data);
		});
  })
};
exports.getByName= function(req, res) {
  Animal.find({nombre: {$regex: req.query.nombre, $options:"ix"}},null,{sort:{nombre:1}},function(err, data) {
    if(err) res.send(500, err);
        res.status(200).jsonp(data);
    });
};





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
		"analisisList.$.repetido": req.body.repetido}
			
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
  
