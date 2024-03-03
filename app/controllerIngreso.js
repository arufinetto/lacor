var Ingreso = require('./modelo/ingreso');
var ObjectId = require('mongoose').Types.ObjectId;


exports.createIngreso = function(req, res) {  
  var ingreso = new Ingreso ({
	  pedido: req.body.pedido,
	  coseguro: req.body.coseguro,
	  montoCoseguroPagado: req.body.montoCoseguroPagado,
	  costo: req.body.costo,
	  costoPagado: req.body.costoPagado,
	  
  });
  ingreso.save(function(err, ingreso) {
    Ingreso.find({},function(err, data) {
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

