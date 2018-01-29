starter.controller("perfilController", function ($scope,$http,servicio){
			$scope.perfils={};
			$scope.analisisPerfil = []

			$scope.newPerfil = {
				nombre: '',
				analisisList: []
			};
			
			
			$scope.getPerfils = function(){
				$http.get('/api/perfils')
					.success(function(data) {
						$scope.perfils = data; 
							console.log($scope.perfils[0].nombre);
					}).error(function(err) {
						console.log('Error: '+err);
					});
			}
			
			$scope.createPerfil = function(){
				for(var i=0;i<$scope.analisisPerfil.length;i++){
						$scope.newPerfil.analisisList.push({"analisis":$scope.analisisPerfil[i]._id})
				}
				
				$http.post('/api/perfil', $scope.newPerfil)
					.success(function(data) {
						$scope.perfils = data; 
					}).error(function(err) {
						console.log('Error: '+err);
					});
			}
			
			$scope.analisisPorPerfil = {}
			
	
			$scope.searchAnalisis = function(perfil){
				$scope.clearAnalisis();
				$http.get('/api/perfil?nombre='+perfil).success(function(data){
					$scope.analisisPorPerfil=data[0].analisisList
						for(var i=0; i< $scope.analisisPorPerfil.length; i++){
						$scope.addAnalisis($scope.analisisPorPerfil[i].analisis)
						//console.log($scope.analisisPorPerfil[i].analisis)

					}
				}).error(function(err){
					$ngBootbox.alert(err)
				})
				
			}
			
			$scope.loadAnalisis = function(){
				for(var i=0; i< $scope.analisisPorPerfil.length; i++){
					$scope.addAnalisis($scope.analisisPorPerfil[i].analisis)
					console.log($scope.analisisPorPerfil[i].analisis)

				}
			}
			
			$scope.agregarAnalisis = function(analisis){
				servicio.data.analisisPerfil=$scope.analisisPerfil.push(analisis); 
			}
			
				
		  })