starter.controller("estadisticasController", function($route,$scope, $http) {

$scope.pedidosPorMedico = {}
$scope.pedidosPorAnalisis = {}
$scope.pedidosPorDiagnostico = {}
$scope.total=0
$scope.fechaDesde= new Date("2017-08-01").toISOString();
$scope.fechaHasta= new Date("2017-08-15").toISOString();
$scope.pedidoObraSocialSelected = {}
$scope.myStyle={}

	$http.get('/api/pedidoByMedico')
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

	$http.get('/api/pedidoByAnalisis')
		.success(function(data) {
			$scope.pedidosPorAnalisis = data; 
		}).error(function(err) {
			console.log('Error: '+err);
		});
		
	$http.get('/api/pedidoByDiagnostico')
		.success(function(data) {
			$scope.pedidosPorDiagnostico = data; 
		}).error(function(err) {
			console.log('Error: '+err);
		});
		
	$http.get('/api/pedidoByObraSocial?fechaDesde='+$scope.fechaDesde+"&fechaHasta="+$scope.fechaHasta)
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
