var Formula = require('./modelo/formula');
var Analisis = require('./modelo/analisis');
var async = require('async');


exports.findAll = function(req, res) {  
    Formula.find(function(err, formula) {
		//Analisis.populate(formula, {path:'analisis'},function(err, formula){
		if(err) res.send(500, err.message);

			res.status(200).jsonp(formula);
		//});
	});
};

exports.add = function(req, res) { 

 var formula = new Formula({
		nombre: req.body.nombre,
		valorReferencia: req.body.valorReferencia,
		orden:req.body.orden,
		analisis:req.body.analisis,
		unidad:req.body.unidad

    })
	
	formula.save(function(err, formula) {
			if(err) return res.status(500).send( err.message);
				res.status(200).jsonp(formula);
			})
	   
  
/*asyn.waterfall([
	   function(req, res) = 
		
		
		function(req, res) =  
			Analisis.update({
				_id:formula.analisis
			}, {

				$push:{
					formula: formula._id
				}

				},function(err,paciente){
					Paciente.find(function(err,paciente){
						res.json(paciente);
					});
				});
			
		
		])*/
		

  }


exports.findFormulaByAnalisis = function(req, res) {  
    Formula.find({analisis:req.query.analisis},null,{sort:{"orden":1}},function(err,formula){
		if(err) res.send(500, err.message);
		res.status(200).jsonp(formula);
	})
};


 
