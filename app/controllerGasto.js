var Gasto = require('./modelo/gasto');
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');



exports.findGastos = function(req, res) {  
       var month= req.query.mes
		Gasto.aggregate([
		{ $project: {
			fechaModified: { $dateToString: { format: "%d/%m/%Y", date: "$fecha" } },
			fecha:1,
			motivo:1,
			referencia:1,
			costo:1,
			mes:{$month:'$fecha'},
			anio:{$year:'$fecha'}
		 }
		},
		
		{$match: {$and:[{mes: parseInt(req.query.mes) },{anio:parseInt(req.query.anio)}]}},
		//{$group:{_id:'$fechaModified', gasto:{"$push": {motivo:"$motivo",referencia:"$referencia",costo:"$costo"}}}},
			
			
			{$sort: {fecha:1}}
		],function(err,data){
				if(err) res.send(500, err);
				console.log(data)
				res.status(200).jsonp(data);
		});
	 
}

exports.getLastResult1 = function(req, res){
	Gasto.find({},{fecha:{$ne:"Invalido"}}, function(err, pedido) {
				if(err) res.send(500, err.message);
				res.status(200).jsonp(pedido);
}) 
}


exports.createGasto = function(req, res) {  
  var gasto = new Gasto ({
	  fecha: req.body.fecha,
	  referencia: req.body.referencia,
	  motivo: req.body.motivo,
	  costo: req.body.costo
  });
  gasto.save(function(err, gasto) {
    Gasto.find({},function(err, data) {
		if(err) res.send(500, err);
			res.status(200).jsonp(data);
		});
  })
};

/*exports.agruparGastoPorMotivo = function(req, res) {  
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

};*/

