var Gasto = require('./modelo/gasto');
var LibroGasto = require('./modelo/libroGasto');
var MotivoGasto = require('./modelo/motivoGasto');
var ObjectId = require('mongoose').Types.ObjectId;

exports.findLibroGasto = function(req, res) {  
//var page = req.query.page || 1;
//var perPage = 25; 
//var skip =(perPage*page)-perPage;
  LibroGasto.find({}, null, {sort:{year:-1,month:-1,'gastos.dia':1}},function(err, data) {
	  if(err) res.send(500, err);
			res.status(200).jsonp(data);
		});
}

exports.findLibroGasto1 = function(req, res) {  
//var page = req.query.page || 1;
//var perPage = 25; 
//var skip =(perPage*page)-perPage;
  LibroGasto.aggregate([{ $unwind: '$gastos' }],function(err, data) {
		LibroGasto.find({},null,{sort:{year:-1,month:-1,'gastos.$.dia':1 }},function(err,gastos){
			res.json(gastos);
				if(err) res.send(500, err);
				res.status(200).jsonp(data);
		});
    });
	 
}

exports.findMotivoGastos = function(req, res) {  

		MotivoGasto.find({},null,{sort:{nombre:1 }},function(err,data){
				if(err) res.send(500, err);
				res.status(200).jsonp(data);
		});
	 
}

exports.agregarGasto = function(req, res) {  
   LibroGasto.update({
	   _id:req.params.id},
 
		 {$push:{
			 gastos:{
				$each:[{dia: req.body.dia, costo:req.body.costo,referencia:req.body.referencia,motivo:req.body.motivo}],
				$sort:{dia:1}
				
				}
		 }
    	},function(err,gastos){
    		LibroGasto.find({},null,{sort:{year:-1,month:-1}},function(err,gastos){
    			res.json(gastos);
    		});
    	});
};

exports.createLibroGasto = function(req, res) {  
  var libroGasto = new LibroGasto ({
	  year: req.body.year,
	  month: req.body.month,
	  monthName: req.body.monthName,
	  gastos:req.body.gastos
  });
  libroGasto.save(function(err, gasto) {
    LibroGasto.find({},null,{sort:{year:-1,month:-1}},function(err, data) {
		if(err) res.send(500, err);
			res.status(200).jsonp(data);
		});
  })
};

exports.agruparGastoPorMotivo = function(req, res) {  
LibroGasto.aggregate([


	{$match: {_id: ObjectId(req.params.id)}},
		{
			 $unwind: '$gastos' 
			  
		},
		
	   
        {
            $group: {
				
				_id:"$gastos.motivo",
                subtotal: {$sum: "$gastos.costo"},
				quantity: {$sum: 1}	
            }
        },
		{
			$sort:{subtotal:-1}
		}
    ], function (err, result) {
        if (err) {
            res.send(500, err);
        } else {
			
			res.status(200).jsonp(result);
        }
    });

};

