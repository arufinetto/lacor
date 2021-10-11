starter.factory("servicio", function(){
				return {
					data: {},
				} ;
}).controller("gastoController", function ($scope,$http,servicio){
			$scope.gastos={};
			$scope.motivosgastos = {};

			$scope.init= function(){
				var fecha = new Date();
				$scope.anio = fecha.getFullYear();
				$scope.mesNumero = fecha.getMonth() +1;

			}
			$scope.calcularGasto = function(){
				var costoTotal = 0;
				for(var i=0;i<$scope.gastos.length;i++){
				   costoTotal = costoTotal + $scope.gastos[i].costo;
				}
				return costoTotal;
			}
			$scope.getGastos = function(mes,anio){
				$http.get('/api/gastos?mes='+mes+'&anio='+anio)
					.success(function(data) {
						$scope.gastos = data;
					}).error(function(err) {
						console.log('Error: '+err);
					});
			}
			$scope.getMotivos = function(){
				$http.get('/api/motivos')
					.success(function(data) {
						$scope.motivosgastos = data;
					}).error(function(err) {
						console.log('Error: '+err);
					});
			}

			$scope.newGasto = {
				fecha: new Date(),
				motivo:'',
				referencia:'',
				costo:0,

			}

			$scope.getTotalPorMes = function(currentLibro){
				var subtotal = 0;
				for(var i=0;i<$scope.gastos.length;i++){
					if($scope.gastos[i].month==currentLibro.month){
						for(var j=0;j<$scope.gastos[i].gastos.length;j++){
							subtotal=subtotal+parseFloat($scope.gastos[i].gastos[j].costo);
						}
					}
				}
				return subtotal;
			}

			$scope.clean = function(){
				$scope.newGasto = {
								fecha: new Date(),
								motivo:'',
								referencia:'',
								costo:0

							}
			}
			$scope.createGasto = function(librogasto){

				$http.post('/api/gasto', $scope.newGasto)
					.success(function(data) {
						alert("Se creo el gasto")
							$scope.clean();
					}).error(function(err) {
						alert('No se creo el gasto debido a un error: '+err);
					});

			}

})
