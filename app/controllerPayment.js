var Payment = require('./modelo/payment');
var PaymentHealthInsurance = require('./modelo/paymentHealthInsurance');

exports.findPaymentByOrder= function(req, res) {
  Payment.find({pedido:req.params.id}, function(err, payment) {
    if(err) res.send(500, err.message);
        res.status(200).jsonp(payment);
    });
};

exports.addPayment = function(req, res) {
  var payment = new Payment({
        pedido: req.body.pedido,
        totalAmount: req.body.total_amount,
        discount: req.body.discount,
      	deliverAmount: req.body.deliver_amount,
      	observations: req.body.observations
    });

    payment.save(function(err, payment) {
        if(err) return res.status(500).send( err.message);
    	  else res.status(200).jsonp(payment);

    });
}

exports.updatePayment = function(req, res) {
  Payment.update({
     _id:req.params.id

	},{

    	$set:{
        totalAmount: req.body.total_amount,
        discount: req.body.discount,
      	deliverAmount: req.body.deliver_amount,
      	observations: req.body.observations

    		}

    	},function(err,data){
		Payment.find(function(err,data){
		res.status(200).jsonp(data);
		})
	});
};


exports.addPaymentHealthInsurance = function(req, res) {
  var paymentHealthInsurance = new PaymentHealthInsurance({
        pedido: req.body.pedido,
        healthInsurance: req.body.health_insurance,
        authorized: req.body.authorized,
      	deliveredOrder: req.body.deliver_order,
      	observations: req.body.observations,
        analysisNotAuthorized:req.body.analysis_not_authorized
    });

    PaymentHealthInsurance.save(function(err, payment) {
        if(err) return res.status(500).send( err.message);
    	  else res.status(200).jsonp(payment);

    });
}


exports.updatePaymentHealthInsurance = function(req, res) {
  PaymentHealthInsurance.update({
     _id:req.params.id

	},{

    	$set:{
        healthInsurance: req.body.health_insurance,
        authorized: req.body.authorized,
        deliveredOrder: req.body.deliver_order,
        observations: req.body.observations,
        analysisNotAuthorized:req.body.analysis_not_authorized
    		}

    	},function(err,data){
		PaymentHealthInsurance.find(function(err,data){
		res.status(200).jsonp(data);
		})
	});
};

exports.findPaymentHealthInsuranceByOrder= function(req, res) {
  PaymentHealthInsurance.find({pedido:req.params.id}, function(err, payment) {
    if(err) res.send(500, err.message);
        res.status(200).jsonp(payment);
    });
};
