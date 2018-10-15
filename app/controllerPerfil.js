var Perfil = require('./modelo/perfil');
var Analisis = require('./modelo/analisis');

exports.findPerfil = function(req, res) {  
  Perfil.find({nombre:req.query.nombre},function(err, data) {
   Analisis.populate(data, {path: "analisisList.analisis", select:{UB:1,valor:1,determinaciones:1,codigo:1,formula:1,unidad:1,muestraDefault:1,metodoDefault:1,multiple:1}},function(err,labs){
			res.status(200).jsonp(labs);
	})
})
}



exports.findPerfils = function(req, res) {  
  Perfil.find({},null,{sort:{nombre:1}},function(err, data) {
   Analisis.populate(data, {path: "analisisList.analisis", select:{determinaciones:1,codigo:1,formula:1,unidad:1,muestraDefault:1,metodoDefault:1,multiple:1}},function(err,labs){
			res.status(200).jsonp(labs);
	})
})
}


exports.createPerfil = function(req, res) {  
  var perfil = new Perfil ({
	  nombre: req.body.nombre,
	  analisisList: req.body.analisisList
  });
  perfil.save(function(err, perfil) {
    Perfil.find({},null,{sort:{nombre:1}},function(err, data) {
		if(err) res.send(500, err);
			res.status(200).jsonp(data);
		});
  })
};



exports.deleteMetodo = function(req, res) {  
    Metodo.remove({
     _id:req.params.id

	},function(err,data){
		Metodo.find(function(err,data){
    			res.json(data);
    	});
	});
};
