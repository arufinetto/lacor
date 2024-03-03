var Medico = require('./modelo/medico');


exports.findAllMedicos= function(req, res) {
  Medico.find(function(err, medico) {
    if(err) res.send(500, err.message);
        res.status(200).jsonp(medico);
    });
};
exports.addMedico = function(req, res) {  
if (req.body.batch){
  Medico.create(req.body.batch, function(err){
    if(err)
      res.send(err);

    else
      res.json(req.body);
  });
}
// Single JSON Object
else {
  var medico = new Medico({
        nombre: req.body.nombre,
        matricula: req.body.matricula,
		telefono: req.body.telefono
    });

    medico.save(function(err, medico) {
        if(err) return res.status(500).send( err.message);
		Medico.find({},null,{sort:{nombre:1}},function(err, medico) {
		if(err) res.send(500, err.message);
			res.status(200).jsonp(medico);
		});
    });
  }
}


exports.convertExcelToJson = function (){
 var excel2json = require("xls-to-json");
  excel2json({
      input: "medicos.xls",
      output: "medicos.json"
   }, function(err, result) {
    if(err) {
      console.error(err);
    } else {
      console.log(result);
    }
  });
}

exports.deleteMedico = function(req, res) {  
  Medico.remove({
     _id:req.params.id

	},function(err,data){
		Medico.find(function(err,data){
		res.status(200).jsonp(data);
		})
	});
};

exports.updateMedico = function(req, res) {  
  Medico.update({
     _id:req.params.id

	},{

    	$set:{
    	matricula: req.body.matricula,
		nombre: req.body.nombre,
		telefono: req.body.telefono
	
    		}

    	},function(err,data){
		Medico.find(function(err,data){
		res.status(200).jsonp(data);
		})
	});
};


 