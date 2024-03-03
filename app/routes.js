//var ControllerFormula= require('./ControllerFormula');
var ControllerAnalisis= require('./controllerAnalisis');
var ControllerPacientes = require('./controllerPaciente');
var ControllerPedidos= require('./controllerPedido');
var ControllerMedico= require('./controllerMedico');
var ControllerMuestraMetodo= require('./controllerMuestraMetodo');
var ControllerLogin= require('./controllerLogin');
var ControllerPerfil= require('./controllerPerfil');
var ControllerGasto= require('./controllerGasto');
var ControllerAnimal= require('./controllerAnimal');
var ControllerUser= require('./controllerUsers');
var ControllerPayment= require('./controllerPayment');
var ControllerSms= require('./controllerSMS');
var jwt = require('jsonwebtoken');

/*var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload',
  algorithms:  ['HS512']
});*/

var verifyToken = function (req, res, next) {
/* const authHeader = req.headers['authorization']
  if(typeof authHeader !== 'undefined'){
    const token = authHeader.split(' ')
   jwt.verify(token[1],"MY_SECRET",(err, authData) => {
      if(err){
        res.status(401).send({"message":'Not Authorized'});
      }else{
        next()
      }
    });
  }else{
    return res.status(403).send({"message":'Forbidden'});
  }*/
}

/*var expiredToken = function(req, res){
  const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')
  jwt.verify(token[1],"MY_SECRET",(err, authData) => {
    if(err){
    return  res.status(200).send({"expired":true});
  }else{
    return res.status(200).send({"expired":false});
  }
})
}*/

module.exports = function(app,passport) {
	/**Controler Analisis**/
	//app.get('/api/expired-token', expiredToken);

	app.get('/api/analisis/:page', ControllerAnalisis.findAllAnalysis);

	app.get('/api/analisis/:id', ControllerAnalisis.find);

	app.get('/api/analisisByCode/:codigo', ControllerAnalisis.findByCode);

	app.post('/api/analisis',ControllerAnalisis.addAnalysis);

	app.put('/api/analisis/:id',ControllerAnalisis.update);

	app.put('/api/unidad-bioquimica/precio', ControllerAnalisis.updatePrice);

	app.get('/api/excel', ControllerAnalisis.convertExcelToJson);

  app.get('/api/analisis', ControllerAnalisis.findAllAnalysisWithoutPag)


	/**Fin Controler Analisis**/

	 /**Controler Muestra Metodos**/
	app.get('/api/muestras',ControllerMuestraMetodo.findMuestra);

	app.get('/api/metodos', ControllerMuestraMetodo.findMetodo);

	app.post('/api/muestra', ControllerMuestraMetodo.createMuestra);

	app.post('/api/metodo', ControllerMuestraMetodo.createMetodo);

	app.delete('/api/metodo/:id', ControllerMuestraMetodo.deleteMetodo);

	app.delete('/api/muestra/:id', ControllerMuestraMetodo.deleteMuestra);

	/**Controler perfil **/

	 app.post('/api/perfil', ControllerPerfil.createPerfil);

	 app.get('/api/perfils', ControllerPerfil.findPerfils);

	 app.get('/api/perfil',ControllerPerfil.findPerfil);

	 /**Controler Paciente**/
	app.get('/api/pacientes/:page', ControllerPacientes.findAll);

	app.get('/api/pacienteBy', ControllerPacientes.filter);

	app.delete('/api/paciente/:id', ControllerPacientes.deletePaciente);

  app.get('/api/paciente/:id',ControllerPacientes.findPacienteById);

	app.post('/api/paciente', ControllerPacientes.add);

	app.put('/api/paciente/:id', ControllerPacientes.update);

	app.put('/api/paciente/:id/obrasocial/:ob_id', ControllerPacientes.updateObraSocial);

	app.get('/api/paciente/ciudad', ControllerPacientes.getPacienteByCiudad);
	app.get('/api/nuevos/pacientes', ControllerPacientes.nuevosPacientes);

	app.get('/api/pacientes',ControllerPacientes.findAllWithoutPag);

  app.get('/api/animal', ControllerAnimal.getByName)
  app.post('/api/animal', ControllerAnimal.create)
  app.get('/api/animales', ControllerAnimal.find)
  app.put('/api/valor-referencia-animal/:id', ControllerAnalisis.updateValorReferenciaAnimal);
  app.put('/api/animal/:id', ControllerAnimal.update);

	/**fin controler paciente**/

	/**Controler pedido**/
	app.get('/api/pedidos/count', ControllerPedidos.count);

	app.put('/api/pedido/:id/analisis/:analisis/include', ControllerPedidos.includeAnalysis);

	app.get('/api/pedidos', ControllerPedidos.findAll);

	app.get('/api/pedidosBy' , ControllerPedidos.filter);

  app.get('/api/pedidos/open', ControllerPedidos.findAllOpens);

	app.post('/api/pedidos', ControllerPedidos.add);

	app.put('/api/loadResults/pedido/:id/analisis/:analisis_id', ControllerPedidos.saveResults);

	app.put('/api/saveObservaciones/pedido/:id/analisis/:analisis_id', ControllerPedidos.saveObservaciones);

	app.put('/api/updateState/pedido/:id', ControllerPedidos.updateState);

	app.post('/api/ciudad', ControllerPedidos.createCiudad);

	app.delete('/api/pedido/:id', ControllerPedidos.deletePedido);

	app.get('/api/pedidosByPaciente/:paciente', ControllerPedidos.getPedidoByPaciente);

	app.get('/api/pedidos/:id', ControllerPedidos.getPedido);

	app.get('/api/ciudades', ControllerPedidos.getCiudades);

	app.get('/api/prestadores', ControllerPedidos.getPrestadores);

	app.post('/api/prestadores', ControllerPedidos.createPrestadores);

	app.get('/api/pedidos/:id/analisis', ControllerPedidos.retrieveAnalisis);

	app.put('/api/pedidos/:id/add-analisis', ControllerPedidos.addAnalysis);

	app.put('/api/pedidos/:id/remove-analisis', ControllerPedidos.removeAnalisis);

	app.get('/api/pedidoByMedico', ControllerPedidos.filterPedidoByFechaAndMedico);

	app.get('/api/pedidoByAnalisis', ControllerPedidos.filterPedidoByAnalisis);

	app.get('/api/pedidoByDiagnostico', ControllerPedidos.filterPedidoByDiagnostico);

	app.get('/api/pedidoByObraSocial', ControllerPedidos.filterPedidoByObraSocial);

	app.get('/api/last-result/:paciente/analisis/:analisis/protocolo/:protocolo', ControllerPedidos.getLastResult)

	app.get('/api/pedidos/proporcion-estudios-derivados', ControllerPedidos.proporcionEstudiosDerivados)

	app.get('/api/pedidos-estadisticas', ControllerPedidos.nuevosPedidos)
  app.get('/api/send-sms/:phoneNumber/protocol/:protocolo/patient/:patientName/message/:message', ControllerPedidos.sendSMS);
	/**fin controler pedido**/

	/**Controler Medico**/
	app.post('/api/medico', ControllerMedico.addMedico);

	app.get('/api/medico/cargamasiva', ControllerMedico.convertExcelToJson);

	app.get('/api/medicos',ControllerMedico.findAllMedicos);

	app.put('/api/medico/:id',ControllerMedico.updateMedico);

	app.delete('/api/medico/:id',ControllerMedico.deleteMedico);
	/**fin controler medico**/

	/**Controller Finanza**/
	//app.put('/api/librogasto/:id', ControllerGasto.agregarGasto);
	app.post('/api/gasto', ControllerGasto.createGasto);

	app.get('/api/gastos', ControllerGasto.findGastos);

  app.post('/api/user', ControllerUser.register);
  app.post('/api/login', ControllerUser.login);
	//app.get('/api/motivos', ControllerGasto.findMotivoGastos);
	//app.get('/api/gasto-motivo/:id', ControllerGasto.agruparGastoPorMotivo);

	/**Controller Payment**/
  app.post('/api/payment', ControllerPayment.addPayment);
  app.put('/api/payment/:id', ControllerPayment.updatePayment);
  app.get('/api/payment/:id', ControllerPayment.findPaymentByOrder);

  app.post('/api/payment-health-insurance', ControllerPayment.addPaymentHealthInsurance);
  app.put('/api/payment-health-insurance/:id', ControllerPayment.updatePaymentHealthInsurance);
  app.get('/api/payment-health-insurance/:id', ControllerPayment.findPaymentHealthInsuranceByOrder);

  /*Controller SMS*/
  app.get('/api/sent-sms/:protocolo', ControllerSms.findSentSMSbyProtocol);
  app.get('/api/sms/:protocolo', ControllerSms.findSMSbyProtocol);

  app.get('/api/sms-status/:referenceId', ControllerSms.updateInProgressSMS);
  app.get('/api/sms', ControllerSms.process);
  app.get('/api/sms-text', ControllerSms.getSmsText);
  app.put('/api/sms-text', ControllerSms.updateSmsText);
};
