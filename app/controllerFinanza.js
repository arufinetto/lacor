var Finanza = require('./modelo/finanza');
//var LibroGasto = require('./modelo/libroGasto');
var MotivoGasto = require('./modelo/motivoGasto');
var ObjectId = require('mongoose').Types.ObjectId;



exports.findMotivoGastos = function(req, res) {  

		MotivoGasto.find({},null,{sort:{nombre:1 }},function(err,data){
				if(err) res.send(500, err);
				res.status(200).jsonp(data);
		});
	 
}


exports.createFinanza = function(req, res) {  
  var finanza = new Finanza ({
	  pedido: req.body.pedido,
	  costo: req.body.costo,
	  autorizado: req.body.autorizado,
	  pago: req.body.pago,
	  gasto: req.body.gasto,
	  motivo: req.body.motivo,
	  aporte: req.body.aporte,
	  egreso: req.body.egreso
  });
  finanza.save(function(err, finanza) {
    Finanza.find({},function(err, data) {
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

