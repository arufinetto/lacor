starter.factory("servicio", function(){
				return {
					data: {},
				} ;
}).controller("perfilController", function ($scope,$http,servicio){
			$scope.perfils={};
			$scope.analisisPerfil = [];
			$scope.token= "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTQ5MjcyYWZlN2ZkMjYxNzk0MDcxNGIiLCJleHAiOjE2NjM3MjAxMDYsImlhdCI6MTYzMjE4NDEwNn0.oN9a97hM4MfwBTF6UpgCrVqlB_tWxECEqdJDq2zgcRw";
			$scope.newPerfil = {
				nombre: '',
				analisisList: []
			};


		$scope.getPerfils = function(){
			$http.get('/api/perfils',{ headers:{"authorization": $scope.token }})
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

				$http.post('/api/perfil', $scope.newPerfil,	{ headers:{"authorization": $scope.token}})
					.success(function(data) {
						$scope.perfils = data;

					}).error(function(err) {
						console.log('Error: '+err);
					});
			}

			$scope.analisisPorPerfil = {}


			$scope.searchAnalisis = function(perfil){
				$scope.clearAnalisis();
				$http.get('/api/perfil?nombre='+perfil, { headers:{"authorization": $scope.token }}).success(function(data){
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
				$scope.analisisPerfil.push(analisis);

			}

			$scope.removeAnalisis = function(index){
				$scope.analisisPerfil.splice(index,1);
			}


		  })
