var Analisis = require('./modelo/analisis');

//GET - Return all analisis in the DB
// con exports conseguimos modularizarlo y que pueda ser llamado desde el archivo principal de la aplicación.

exports.findAllAnalysis = function(req, res) {  
	var page = req.params.page || 1;
	var perPage = 50;
   Analisis.find({})
			.sort({codigo:1})
			.skip((perPage*page)-perPage)
			.limit(perPage)
			.exec(function(err, lab) {
				if(err) res.send(500, err.message);
				res.status(200).jsonp(lab);
			})
			
};

exports.find = function(req, res) {  
    Analisis.find({_id:req.params.id}, function(err, analisis) {
			res.status(200).jsonp(analisis);
    });
};

/*exports.findByProfile = function(req, res) {  
    Analisis.find({perfil:req.params.perfil}, function(err, analisis) {
			res.status(200).jsonp(analisis);
		})
};*/

 exports.findByCode= function(req, res) {
	 Analisis.find({$or:[{codigo: {$regex: req.params.codigo}},{determinaciones: {$regex:req.params.codigo}}]},function(err,analisis){
					if(err) return res.status(500).send(err.message);
					res.status(200).jsonp(analisis);
    		});
			
};

exports.addAnalysis = function(req, res) {  
if (req.body.batch){
  Analisis.create(req.body.batch, function(err){
    if(err)
      res.send(err);

    else
      res.json(req.body);
  });
}
// Single JSON Object
else {
  var analisis = new Analisis({
        codigo: req.body.codigo,
        determinaciones: req.body.determinaciones,
		urgencia:req.body.urgencia,
		NI: req.body.NI,
		UB: req.body.UB,
        valor: req.body.valor,
		otro:req.body.otro,
		pedidoList:null,
		formula:null,
		valorReferencia:[],
		unidad:null,
		metodoDefault:req.body.metodoDefault,
		muestraDefault:req.body.muestraDefault
    });

    analisis.save(function(err, lab) {
        if(err) return res.status(500).send( err.message);
    res.status(200).jsonp(lab);
    });
  }
}


exports.convertExcelToJson = function (){
 var excel2json = require("xls-to-json");
  excel2json({
      input: "analisis.xls",
      output: "output.json"
   }, function(err, result) {
    if(err) {
      console.error(err);
    } else {
      console.log(result);
    }
  });
}




exports.update = function(req, res) {  
    Analisis.update({
    	_id:req.params.id
    }, {

    	$set:{
    	determinaciones: req.body.determinaciones,
		valorReferencia: req.body.valorReferencia,
		unidad: req.body.unidad,
		formula: req.body.formula,
		valor: req.body.valor,
		metodoDefault:req.body.metodoDefault,
		muestraDefault:req.body.muestraDefault
		
    		}

    	},function(err,analisis){
    		Analisis.find(function(err,analisis){
    			res.json(analisis);
    		});
    	}
   );
};

 