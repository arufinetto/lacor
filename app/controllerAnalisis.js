var Analisis = require('./modelo/analisis');
var fs = require('fs');
var ObjectId = require('mongoose').Types.ObjectId;
//const sqlite3 = require('sqlite3').verbose();
//var path = process.cwd() + "\\app\\Equipo\\Data\\";
//var db = new sqlite3.Database('RESULTST.DB');

exports.openFile = function(){
var path = process.cwd();
console.log("PATH:" + path)
var buffer = fs.readFileSync(path + "\\app\\Equipo\\Data\\RESULTST.DB");
console.log(buffer.toString());
}

exports.openFile1 = function(){
}


exports.findAllAnalysisWithoutPag = function(req, res) {
    Analisis.aggregate([
			{ $project: {codigo:1, determinaciones:1, muestraDefault:1, metodoDefault:1, multiple:1, formula:1 } }
			],function(err, analisis) {
				res.status(200).jsonp(analisis);
	    });

};

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
	 Analisis.find({$or:[{determinaciones: {$regex: req.params.codigo,$options:"ix"}},{codigo: {$regex:req.params.codigo}}]},function(err,analisis){
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
		pedidoList:[],
		formula:req.body.formula,
		valorReferencia:[],
		unidad:req.body.unidad,
		metodoDefault:req.body.metodoDefault,
		muestraDefault:req.body.muestraDefault,
		multiple: req.body.multiple

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
			UB: req.body.UB,
			metodoDefault:req.body.metodoDefault,
			muestraDefault:req.body.muestraDefault,
			multiple: req.body.multiple,
      valorReferenciaAnimal: req.body.valorReferenciaAnimal

			}

    	},function(err,analisis){
    		Analisis.find(function(err,analisis){
    			res.json(analisis);
    		});
    	}
   );
};

exports.updateValorReferenciaAnimal = function(req, res) {
    Analisis.update({
    	_id:req.params.id
    }, {

    	$set:{
			valorReferenciaAnimal: req.body.valorReferenciaAnimal,

			}

    	},function(err,analisis){
    		Analisis.find({_id:ObjectId(req.params.id)},function(err,analisis){
    			res.json(analisis);
    		});
    	}
   );
};

exports.updatePrice = function(req, res) {
    Analisis.update({

    }, {
    	$set:{
			valor: req.body.valor
		}
	},
		{multi:true},function(err,analisis){
    		Analisis.find(function(err,analisis){
    			res.json("Se actualizo correctamente el precio de la Unidad Bioquimica");
    		});
    	}
   );
};
