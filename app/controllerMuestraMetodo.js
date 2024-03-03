var Muestra = require('./modelo/muestra');
var Metodo = require('./modelo/metodo');

exports.findMuestra = function(req, res) {  
  Muestra.find({},null,{sort:{nombre:1}},function(err, data) {
    if(err) res.send(500, err);
        res.status(200).jsonp(data);
    });

};

exports.findMetodo = function(req, res) {  
  Metodo.find({},null,{sort:{nombre:1}},function(err, data) {
    if(err) res.send(500, err);
        res.status(200).jsonp(data);
    });

};

exports.createMetodo = function(req, res) {  
  var metodo = new Metodo ({
	  nombre: req.body.nombre
  });
  metodo.save(function(err, metodo) {
     Metodo.find({},null,{sort:{nombre:1}},function(err, data) {
		if(err) res.send(500, err);
			res.status(200).jsonp(data);
		});
  })
};

exports.createMuestra = function(req, res) {  
  var muestra = new Muestra ({
	  nombre: req.body.nombre
  });
  muestra.save(function(err, muestra) {
    Muestra.find({},null,{sort:{nombre:1}},function(err, data) {
		if(err) res.send(500, err);
			res.status(200).jsonp(data);
		});
  })
};

exports.deleteMuestra = function(req, res) {  
  Muestra.remove({
     _id:req.params.id

	},function(err,data){
		Muestra.find(function(err,data){
		res.status(200).jsonp(data);
		})
	});
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
