starter.factory("servicio", function(){
				return {
					data: {}

				} ;
}).controller("medicoController", function($scope, $http,$ngBootbox,servicio) {

		$scope.medicosList = {}
		$scope.medicoSelected = null
		$scope.medico = {}
		$scope.token= "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjY3OGQ4ZjNmOGZmZDVhN2FjNDM1ZTgiLCJleHAiOjE2MzIxNjI5ODIsImlhdCI6MTYwMDYyNjk4Mn0.1Z1utQmTt1FunQtqINJ3A9cFg2GHNaJgZM1Sk4CueE8";

		$http.get('/api/medicos', {headers:{"authorization":$scope.token}})
		.success(function(data) {
			$scope.medicosList = data;
		}).error(function(err) {
			console.log('Error: '+err);
		});

		$scope.isEmpty = function(value){
		return (value == "" || value == null);
		};

		$scope.agregarMedico = function (medico){
		servicio.data.medico = medico
		$scope.medicoSelected = medico.nombre
		}

		$scope.confirmDeleteMedico = function(medico) {
		  $ngBootbox.confirm('Eliminar ' + medico.nombre + '?')
			.then(function() {
			  $scope.deleteMedico(medico._id);
			},
			function() {
			  //Confirm was cancelled, don't delete customer
			  console.log('Confirm was cancelled');
			});
		};


		$scope.deleteMedico = function(id){
			$http.delete('/api/medico/'+ id,{headers:{"authorization":$scope.token}})
			.success(function(data) {
				$scope.medicosList = data;
			}).error(function(err) {
				console.log('Error: '+err);
			});
		}

		$scope.createMedico = function (){
			$http.post('/api/medico', $scope.medico,{headers:{"authorization":$scope.token}})
			.success(function(data) {
				$scope.medicosList = data;
				$scope.medico = {};
			}).error(function(err) {
				console.log('Error: '+err);
			});
		}

		$scope.updateMedico = function (medico){
			$http.put('/api/medico/' + medico._id,{"matricula": medico.matricula, "nombre": medico.nombre, "telefono": medico.telefono},{headers:{"authorization":$scope.token}})
			.success(function(data) {
				$scope.medicosList = data;
			}).error(function(err) {
				console.log('Error: '+err);
			});
		}

	})
