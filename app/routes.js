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
  const authHeader = req.headers['authorization']
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
  }
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

	app.get('/api/analisis/:page', verifyToken, ControllerAnalisis.findAllAnalysis);

	app.get('/api/analisis/:id',  verifyToken, ControllerAnalisis.find);

	app.get('/api/analisisByCode/:codigo', verifyToken, ControllerAnalisis.findByCode);

	app.post('/api/analisis', verifyToken,ControllerAnalisis.addAnalysis);

	app.put('/api/analisis/:id', verifyToken,ControllerAnalisis.update);

	app.put('/api/unidad-bioquimica/precio', verifyToken, ControllerAnalisis.updatePrice);

	app.get('/api/excel', verifyToken, ControllerAnalisis.convertExcelToJson);

  app.get('/api/analisis', verifyToken, ControllerAnalisis.findAllAnalysisWithoutPag)


	/**Fin Controler Analisis**/

	 /**Controler Muestra Metodos**/
	app.get('/api/muestras',verifyToken,ControllerMuestraMetodo.findMuestra);

	app.get('/api/metodos', verifyToken, ControllerMuestraMetodo.findMetodo);

	app.post('/api/muestra', verifyToken, ControllerMuestraMetodo.createMuestra);

	app.post('/api/metodo', verifyToken, ControllerMuestraMetodo.createMetodo);

	app.delete('/api/metodo/:id', verifyToken, ControllerMuestraMetodo.deleteMetodo);

	app.delete('/api/muestra/:id', verifyToken, ControllerMuestraMetodo.deleteMuestra);

	/**Controler perfil **/

	 app.post('/api/perfil', verifyToken, ControllerPerfil.createPerfil);

	 app.get('/api/perfils', verifyToken, ControllerPerfil.findPerfils);

	 app.get('/api/perfil', verifyToken,ControllerPerfil.findPerfil);

	 /**Controler Paciente**/
	app.get('/api/pacientes/:page', verifyToken, ControllerPacientes.findAll);

	app.get('/api/pacienteBy', verifyToken, ControllerPacientes.filter);

	app.delete('/api/paciente/:id', verifyToken, ControllerPacientes.deletePaciente);

  app.get('/api/paciente/:id', verifyToken,ControllerPacientes.findPacienteById);

	app.post('/api/paciente',verifyToken, ControllerPacientes.add);

	app.put('/api/paciente/:id', verifyToken, ControllerPacientes.update);

	app.put('/api/paciente/:id/obrasocial/:ob_id', verifyToken, ControllerPacientes.updateObraSocial);

	app.get('/api/paciente/ciudad', verifyToken, ControllerPacientes.getPacienteByCiudad);
	app.get('/api/nuevos/pacientes', verifyToken, ControllerPacientes.nuevosPacientes);

	app.get('/api/pacientes', verifyToken,ControllerPacientes.findAllWithoutPag);

  app.get('/api/animal', verifyToken, ControllerAnimal.getByName)
  app.post('/api/animal', verifyToken, ControllerAnimal.create)
  app.get('/api/animales', verifyToken, ControllerAnimal.find)
  app.put('/api/valor-referencia-animal/:id', verifyToken, ControllerAnalisis.updateValorReferenciaAnimal);
  app.put('/api/animal/:id', verifyToken, ControllerAnimal.update);

	/**fin controler paciente**/

	/**Controler pedido**/
	app.get('/api/pedidos/count', verifyToken, ControllerPedidos.count);

	app.put('/api/pedido/:id/analisis/:analisis/include', verifyToken, ControllerPedidos.includeAnalysis);

	app.get('/api/pedidos', verifyToken, ControllerPedidos.findAll);

	app.get('/api/pedidosBy', verifyToken, ControllerPedidos.filter);

  app.get('/api/pedidos/open', verifyToken, ControllerPedidos.findAllOpens);

	app.post('/api/pedidos', verifyToken, ControllerPedidos.add);

	app.put('/api/loadResults/pedido/:id/analisis/:analisis_id', verifyToken, ControllerPedidos.saveResults);

	app.put('/api/saveObservaciones/pedido/:id/analisis/:analisis_id', verifyToken, ControllerPedidos.saveObservaciones);

	app.put('/api/updateState/pedido/:id', verifyToken, ControllerPedidos.updateState);

	app.post('/api/ciudad', verifyToken, ControllerPedidos.createCiudad);

	app.delete('/api/pedido/:id',verifyToken, ControllerPedidos.deletePedido);

	app.get('/api/pedidosByPaciente/:paciente', verifyToken, ControllerPedidos.getPedidoByPaciente);

	app.get('/api/pedidos/:id', verifyToken, ControllerPedidos.getPedido);

	app.get('/api/ciudades', verifyToken, ControllerPedidos.getCiudades);

	app.get('/api/prestadores', verifyToken, ControllerPedidos.getPrestadores);

	app.post('/api/prestadores', verifyToken, ControllerPedidos.createPrestadores);

	app.get('/api/pedidos/:id/analisis', verifyToken, ControllerPedidos.retrieveAnalisis);

	app.put('/api/pedidos/:id/add-analisis', verifyToken, ControllerPedidos.addAnalysis);

	app.put('/api/pedidos/:id/remove-analisis', verifyToken, ControllerPedidos.removeAnalisis);

	app.get('/api/pedidoByMedico', verifyToken, ControllerPedidos.filterPedidoByFechaAndMedico);

	app.get('/api/pedidoByAnalisis', verifyToken, ControllerPedidos.filterPedidoByAnalisis);

	app.get('/api/pedidoByDiagnostico', verifyToken, ControllerPedidos.filterPedidoByDiagnostico);

	app.get('/api/pedidoByObraSocial', verifyToken, ControllerPedidos.filterPedidoByObraSocial);

	app.get('/api/last-result/:paciente/analisis/:analisis/protocolo/:protocolo', verifyToken, ControllerPedidos.getLastResult)

	app.get('/api/pedidos/proporcion-estudios-derivados', verifyToken, ControllerPedidos.proporcionEstudiosDerivados)

	app.get('/api/pedidos-estadisticas', verifyToken, ControllerPedidos.nuevosPedidos)
  app.get('/api/send-sms/:phoneNumber/protocol/:protocolo/patient/:patientName', ControllerPedidos.sendSMS);
	/**fin controler pedido**/

	/**Controler Medico**/
	app.post('/api/medico', verifyToken, ControllerMedico.addMedico);

	app.get('/api/medico/cargamasiva',verifyToken, ControllerMedico.convertExcelToJson);

	app.get('/api/medicos', verifyToken,ControllerMedico.findAllMedicos);

	app.put('/api/medico/:id', verifyToken,ControllerMedico.updateMedico);

	app.delete('/api/medico/:id', verifyToken,ControllerMedico.deleteMedico);
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
  app.post('/api/payment', verifyToken, ControllerPayment.addPayment);
  app.put('/api/payment/:id', verifyToken, ControllerPayment.updatePayment);
  app.get('/api/payment/:id', verifyToken, ControllerPayment.findPaymentByOrder);

  app.post('/api/payment-health-insurance', verifyToken, ControllerPayment.addPaymentHealthInsurance);
  app.put('/api/payment-health-insurance/:id', verifyToken, ControllerPayment.updatePaymentHealthInsurance);
  app.get('/api/payment-health-insurance/:id', verifyToken, ControllerPayment.findPaymentHealthInsuranceByOrder);

  /*Controller SMS*/
  app.get('/api/sent-sms/:protocolo', ControllerSms.findSentSMSbyProtocol);
  app.get('/api/sms/:protocolo', ControllerSms.findSMSbyProtocol);

  app.get('/api/sms-status/:referenceId', ControllerSms.updateInProgressSMS);
  app.get('/api/sms', ControllerSms.process);

};
