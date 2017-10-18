var ControllerFormula= require('./ControllerFormula');
var ControllerAnalisis= require('./controllerAnalisis');
var ControllerPacientes = require('./controllerPaciente');
var ControllerPedidos= require('./controllerPedido');
var ControllerMedico= require('./controllerMedico');
var ControllerMuestraMetodo= require('./controllerMuestraMetodo');
var ControllerLogin= require('./controllerLogin');
var ControllerPerfil= require('./controllerPerfil');

module.exports = function(app) {
	
	/**Controller Login**/
	//app.post('/api/user', ControllerLogin.addUser);
	//app.get('/api/user/:username', ControllerLogin.find);
	//app.post('/api/login/:username', ControllerLogin.login);
	
	/**Controler Analisis**/

	app.get('/api/analisis', ControllerAnalisis.findAllAnalysis);

	app.get('/api/analisis/:id',  ControllerAnalisis.find);
	
	app.get('/api/analisisByCode/:codigo',  ControllerAnalisis.findByCode);
	
	app.post('/api/analisis', ControllerAnalisis.addAnalysis);
	
	app.put('/api/analisis/:id', ControllerAnalisis.update);
	
	app.get('/api/excel', ControllerAnalisis.convertExcelToJson);
	
	
	/**Fin Controler Analisis**/
	
	 /**Controler Muestra Metodos**/
	app.get('/api/muestras', ControllerMuestraMetodo.findMuestra);
	
	app.get('/api/metodos', ControllerMuestraMetodo.findMetodo);
	
	app.post('/api/muestra', ControllerMuestraMetodo.createMuestra);
	
	app.post('/api/metodo', ControllerMuestraMetodo.createMetodo);
	
	app.delete('/api/metodo/:id', ControllerMuestraMetodo.deleteMetodo);
	
	app.delete('/api/muestra/:id', ControllerMuestraMetodo.deleteMuestra);
	
	/**Controler perfil **/
	
	 app.post('/api/perfil', ControllerPerfil.createPerfil);
	 
	 app.get('/api/perfils', ControllerPerfil.findPerfils);
	 
	 app.get('/api/perfil', ControllerPerfil.findPerfil);

	 /**Controler Paciente**/
	app.get('/api/pacientes', ControllerPacientes.findAll);
	
	app.delete('/api/paciente/:id', ControllerPacientes.deletePaciente);
	
	app.post('/api/paciente', ControllerPacientes.add);
	
	app.put('/api/paciente/:id', ControllerPacientes.update);
	
	app.get('/api/pacientesBy', ControllerPacientes.filter);
	/**fin controler paciente**/
	
	/**Controler pedido**/
	app.get('/api/pedidos', ControllerPedidos.findAll);
	
	app.get('/api/pedidosBy', ControllerPedidos.filter);
	
	app.post('/api/pedidos', ControllerPedidos.add);
	
	app.put('/api/loadResults/pedido/:id/analisis/:analisis_id', ControllerPedidos.saveResults);
	
	app.put('/api/updateState/pedido/:id', ControllerPedidos.updateState);
	
	app.post('/api/ciudad', ControllerPedidos.createCiudad);

	app.delete('/api/pedido/:id',ControllerPedidos.deletePedido);
	
	app.get('/api/pedidosByPaciente/:paciente', ControllerPedidos.getPedidoByPaciente);
	
	app.get('/api/pedidos/:id', ControllerPedidos.getPedido);
	
	app.get('/api/ciudades', ControllerPedidos.getCiudades);
	
	app.get('/api/prestadores', ControllerPedidos.getPrestadores);
	
	app.post('/api/prestadores', ControllerPedidos.createPrestadores);
	
	app.get('/api/pedidos/:id/analisis', ControllerPedidos.retrieveAnalisis);
	
	app.put('/api/pedidos/:id/add-analisis', ControllerPedidos.addAnalysis);
	
	app.put('/api/pedidos/:id/remove-analisis', ControllerPedidos.removeAnalisis);
	

	/**fin controler pedido**/
	
	/**Controler Medico**/
	app.post('/api/medico', ControllerMedico.addMedico);
	
	app.get('/api/medico/cargamasiva', ControllerMedico.convertExcelToJson);

	app.get('/api/medicos', ControllerMedico.findAllMedicos);
	
	app.delete('/api/medico/:id', ControllerMedico.deleteMedico);
	/**fin controler medico**/
	
	
};