starter.factory("servicio", function(){
				return {
					data: {},
				} ;
}).controller("gastoController", function ($scope,$http,servicio){
			$scope.gastos={};
		
			
			$scope.getGastos = function(){
				$http.get('/api/librogasto')
					.success(function(data) {
						$scope.gastos = data; 
					}).error(function(err) {
						console.log('Error: '+err);
					});
			}
			
			$scope.newGasto = {
				dia:0,
				motivo:'',
				referencia:'',
				costo:''
				
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
			$scope.getCurrentLibroGasto=function(lg){
				$scope.currentLibro=lg
			}
			$scope.createGasto = function(librogasto){
		
				$http.put('/api/librogasto/'+librogasto._id, {"dia":$scope.newGasto.dia,"costo":parseFloat($scope.newGasto.costo),
				"referencia":$scope.newGasto.referencia,"motivo":$scope.newGasto.motivo})
					.success(function(data) {
						$scope.gastos = data; 
						$scope.newGasto = {
								dia:0,
								motivo:'',
								referencia:'',
								costo:''
								
							}
					}).error(function(err) {
						console.log('Error: '+err);
					});
				
			}
			
			$scope.gastosPorCrear = []
			$scope.doGastosPorCrear = function(nombre, fecha, referencia, costo){
				var gasto= {"motivo": nombre, "referencia":referencia, "fecha":fecha,"costo":costo}
				$scope.gastosPorCrear.push(gasto);
				
			}
			
			$scope.removeGasto = function(indice){
				
				$scope.gastosPorCrear.splice(indice,1);
			}

		  })