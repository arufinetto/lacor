starter.controller("muestraMetodoController", function($scope, $http, $ngBootbox) {
	
		$scope.muestras = {}
		$scope.metodos = {}
		$scope.metodo={}
		$scope.muestra={}

		
		$scope.confirmDeleteMetodo = function(metodo) {
		  $ngBootbox.confirm('Eliminar ' + metodo.nombre + '?')
			.then(function() {
			  $scope.deleteMetodo(metodo._id);
			},
			function() {
			  //Confirm was cancelled, don't delete customer
			  console.log('Confirm was cancelled');
			});
		};
		
		
		$scope.confirmDeleteMuestra = function(muestra) {
		  $ngBootbox.confirm('Eliminar ' + muestra.nombre + '?')
			.then(function() {
			  $scope.deleteMuestra(muestra._id);
			},
			function() {
			  //Confirm was cancelled, don't delete customer
			  console.log('Confirm was cancelled');
			});
		};
		
		
		
		$scope.createMuestra = function () {
			$http.post('/api/muestra',$scope.muestra).success(function(data){
				$scope.muestras=data
			}).error(function(err){
				console.log('Error'+err)
			})
		};
		
		
		$scope.deleteMuestra = function (id) {
			$http.delete('/api/muestra/'+id).success(function(data){
				$scope.muestras=data
			}).error(function(err){
				console.log('Error'+err)
			})
		};
		
		
		$scope.deleteMetodo = function (id) {
			$http.delete('/api/metodo/'+id).success(function(data){
				$scope.metodos=data
			}).error(function(err){
				console.log('Error'+err)
			})
		};
		
		$http.get('/api/muestras').success(function(data){
			$scope.muestras=data
		}).error(function(err){
			console.log('Error'+err)
		})
		
		$scope.createMetodo = function () {
			$http.post('/api/metodo',$scope.metodo).success(function(data){
				$scope.metodos=data
			}).error(function(err){
				console.log('Error'+err)
			})
		};
		
		$http.get('/api/metodos').success(function(data){
			$scope.metodos=data
			
		}).error(function(err){
			console.log('Error'+err)
		})
		
		
		$scope.ciudades ={},
		$scope.ciudad={},
		
		$http.get('/api/ciudades')
		.success(function(data) {
			$scope.ciudades = data; 
		}).error(function(err) {
			console.log('Error: '+err);
		});
		
		$scope.createCiudad = function(){
			$http.post('/api/ciudad',$scope.ciudad)
		.success(function(data) {
			$scope.ciudades = data; 
		}).error(function(err) {
			console.log('Error: '+err);
		});
		}
	})
