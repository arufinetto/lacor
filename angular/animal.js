starter.factory("servicio", function(){
				return {
					data: {
					},
				} ;
}).controller("animalController", function($scope, $http, $ngBootbox,servicio) {

	$scope.newAnimal = {
		nombre: '',
		raza:'',
		tipo: '',
		contacto:'',

	};
	$scope.animalsFilteredList = {};
	$scope.nombreAnimal =""
	$scope.token= "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjY3OGQ4ZjNmOGZmZDVhN2FjNDM1ZTgiLCJleHAiOjE2MzIxNjI5ODIsImlhdCI6MTYwMDYyNjk4Mn0.1Z1utQmTt1FunQtqINJ3A9cFg2GHNaJgZM1Sk4CueE8";



	$scope.getAnimalsByName = function (name){
		$http.get('/api/animal?nombre=' + name,{headers:{"authorization":$scope.token}})
		.success(function(data) {
			$scope.animalsFilteredList = data;

		})
		.error(function(err) {
			console.log('Error: '+err);
		});
	}

	$scope.agregarAnimal = function (animal){
		console.log("ANIMAL " + animal)
		servicio.data.animal = animal
		$scope.nombreAnimal = animal.tipo + ", " +animal.nombre
	}

	$scope.createAnimal = function () {
		$http.post('/api/animal', $scope.newAnimal,{headers:{"authorization":$scope.token}})
		.success(function(data) {
			$scope.newAnimal = {};
			$scope.animalsFilteredList = data;
			$ngBootbox.alert("El animal ha sido creado exitosamente!")
		})
		.error(function(err) {
			console.log('Error: '+err);
			ngBootbox.alert("Se produjo un problema, y el animal no pudo ser creado: " + err)
		});
	};
})
