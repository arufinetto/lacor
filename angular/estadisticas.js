starter.controller("estadisticasController", function($route,$scope, $http) {

$scope.pedidosPorMedico = {}
$scope.pedidosPorAnalisis = {}
$scope.pedidosPorDiagnostico = {}
$scope.pacientesPorCiudad = {}
$scope.total=0
$scope.fechaDesde= new Date("2017-08-01").toISOString();
$scope.fechaHasta= new Date("2017-08-15").toISOString();
$scope.pedidoObraSocialSelected = {}
$scope.myStyle={}
$scope.pacientesPorCiudad = {}
$scope.pacientesNuevos = {}
$scope.pacientesNuevosCount = 0
$scope.pedidosNuevos = {};
$scope.currentDate = new Date();
$scope.token= "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjY3OGQ4ZjNmOGZmZDVhN2FjNDM1ZTgiLCJleHAiOjE2MzIxNjI5ODIsImlhdCI6MTYwMDYyNjk4Mn0.1Z1utQmTt1FunQtqINJ3A9cFg2GHNaJgZM1Sk4CueE8";


$scope.calcularCostoPedido = function(pedido){
	var total=0;
	for(var i = 0; i<pedido.analisisList.length;i++){
		total = total + pedido.analisisList[i].analisis.UB*pedido.analisisList[i].analisis.valor;
	}
	return total;
}
   $scope.getPedidosPorMes = function(mes,anio){
				$http.get('/api/pedidos-estadisticas?mes='+mes+'&anio='+anio,{headers:{"authorization":$scope.token}})
					.success(function(data) {
						$scope.pedidosNuevos = data;
						$scope.pedidosNuevosCount = data.length;
					}).error(function(err) {
						console.log('Error: '+err);
					});
			}



	$http.get('/api/nuevos/pacientes',{headers:{"authorization":$scope.token}}).success(
	function(data){
		$scope.pacientesNuevosCount = data.length;
		$scope.pacientesNuevos = data;
	}).error(function(err) {
			console.log('Error: '+err);
	});

	$http.get('/api/paciente/ciudad',{headers:{"authorization":$scope.token}}).success(
	function(data){
		$scope.pacientesPorCiudad = data;
	}).error(function(err) {
			console.log('Error: '+err);
	});

	$http.get('/api/pedidoByMedico',{headers:{"authorization":$scope.token}})
		.success(function(data) {
			$scope.pedidosPorMedico = data;
		}).error(function(err) {
			console.log('Error: '+err);
		});

		$scope.getTotalPedido = function(){
			var total=0;
			for(var i=0;i<$scope.pedidosPorMedico.length;i++){
				total= total+ $scope.pedidosPorMedico[i].count
			}
			return total;
		}

	$http.get('/api/pedidoByAnalisis',{headers:{"authorization":$scope.token}})
		.success(function(data) {
			$scope.pedidosPorAnalisis = data;
		}).error(function(err) {
			console.log('Error: '+err);
		});

	$http.get('/api/pedidoByDiagnostico',{headers:{"authorization":$scope.token}})
		.success(function(data) {
			$scope.pedidosPorDiagnostico = data;
		}).error(function(err) {
			console.log('Error: '+err);
		});

	$http.get('/api/pedidoByObraSocial?fechaDesde='+$scope.fechaDesde+"&fechaHasta="+$scope.fechaHasta,{headers:{"authorization":$scope.token}})
		.success(function(data) {
			$scope.pedidosPorObraSocial = data;
			console.log("DESDE "+$scope.fechaDesde +"-HASTA: "+$scope.fechaHasta )
		}).error(function(err) {
			console.log('Error: '+err);
		});

		$scope.selectPedido = function(pedido){
			$scope.pedidoObraSocialSelected=pedido;
		};

		$scope.myStyle={"height": "315px", "overflow-y": "auto","overflow-x": "hidden"};
})
