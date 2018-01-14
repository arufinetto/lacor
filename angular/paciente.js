starter.factory("servicio", function(){
				return {
					data: {}
					
				} ;
}).controller("pacienteController", function($route,$scope, $http,servicio,$ngBootbox) {
	$scope.totalItems=500;
	$scope.currentPage=1;
	$scope.page=25;
	$scope.pacienteSelected = null;
	$scope.isEmpty = function(value){
		return (value == "" || value == null);
		};
		
	$scope.paciente ={}
	$scope.newPaciente = {
		nombre: '',
		apellido: '',
		fechaNacimiento: '',
		domicilio: '',
		tipoDocumento: '',
		documento: '',
		medicacion:'',
		telefono:'',
		celular:'',
		email:'',
		ciudad:'',
		obraSocial:[]
		
	};
	$scope.pacienteSelected = null;
	$scope.pacienteList = {};
	$scope.pacienteListFilter = {};
	$scope.nombrePaciente= null;
	$scope.obraSocialPacienteSelected = null;
	$scope.pacienteEdited = null;
	
	$scope.removePaciente = function(id){
		$http.delete('/api/paciente/'+id).success(function(data){
			$scope.pacienteList=data
		}).error(function(err){
			$ngBootbox.alert(err)
		})
	}
	
	
	$scope.calcularEdad = function(birthday){
			if(birthday !=null){
				var hoy = new Date();
				var cumpleanos = new Date(birthday);
				var edad = hoy.getFullYear() - cumpleanos.getFullYear();
				var m = hoy.getMonth() - cumpleanos.getMonth();

				if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
					edad--;
				}

				return edad;	
			}
			
		}
	
	$scope.pedidosByPacienteList = {}
		
	$scope.getPedidoByPaciente = function(paciente){
	$http.get('api/pedidosByPaciente/' + paciente._id)
		.success(function(data) {
			$scope.pedidosByPacienteList = data; 
			//data.listaPedidoPorPaciente = $scope.pedidosByPacienteList;
		}).error(function(err) {
			console.log('Error: '+err);
		});
	}
	
	$scope.validatePaciente = function(paciente){
		$scope.getPedidoByPaciente(paciente);
		if($scope.pedidosByPacienteList.length > 0){
			$scope.confirmRemovePaciente(paciente)
		}else{
			$ngBootbox.confirm('El paciente no puede ser eliminado porque tiene pedidos.'+ '\n' +
			'Si realmente desea eliminar el paciente, realice los siguientes pasos: ' + '\n' +
			' 1. INVALIDE los pedidos (cualquier pedido que no se haya entregado puede ser invalidado)' + '\n' +
			' 2. ELIMINE  los pedidos'+ '\n' +
			' 3.VUELVA a la lista de pacientes e intente eliminar el paciente.')
			}
	}
	
	$scope.confirmRemovePaciente = function(paciente) {
		  $ngBootbox.confirm('Realmente desea ELIMINAR el paciente: '+ paciente.apellido+', '+paciente.nombre +' ?'+  '\n\n'+'  UNA VEZ ELIMINADO NO PODRÁ SER RECUPERADO')
			.then(function() {
			  $scope.removePaciente(paciente._id);
			},
			function() {
			  //Confirm was cancelled, don't delete customer
			  console.log('Confirm was cancelled');
			});
		};
	$scope.getPacientes = function (page){
		$http.get('/api/pacientes/' + page)
		.success(function(data) {
			$scope.pacienteList = data;
			console.log("CANTIDA DE PACIENTES " + $scope.pacienteList[0].apellido)
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
	}
	
	
	$scope.search = function() {
		$http.get('/api/pacientesBy?nombre='+ $scope.nombrePaciente)
		.success(function(data) {
			$scope.pacienteListFilter = data;
			console.log(data)
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
	};
	
	
	$scope.createPaciente = function () {
		$http.post('/api/paciente', $scope.newPaciente)
		.success(function(data) {
			$scope.pacienteList = data;
			$scope.newPaciente = {};
			$ngBootbox.alert("El paciente ha sido creado exitosamente!")
		})
		.error(function(err) {
			console.log('Error: '+err);
			ngBootbox.alert("Se produjo un problema, y el paciente no pude ser creado: " + err)
		});
	};
	
	$scope.agregarObraSocial = function(paciente,obraSocial,afiliado){
		$scope.obraSocial = {"obraSocial":obraSocial,"afiliado":afiliado};
		paciente.obraSocial.push($scope.obraSocial)
	}
	
	$scope.agregarPaciente = function (paciente){
		servicio.data.paciente = paciente
		$scope.pacienteSelected = paciente.nombre+" "+paciente.apellido
		$scope.obraSocialPacienteSelected = paciente.obraSocial;
		console.log("obra social para paciente:"+paciente.obraSocial)
	/*if(paciente.prestador !="" && paciente.afiliado != ""){
			$scope.pacienteSelectedAfiliado = paciente.prestador+" - Numero de Afiliado: "+paciente.afiliado
		}else{
			if((paciente.prestador != null || paciente.prestador !=""))
			{$scope.pacienteSelectedAfiliado = paciente.prestador}
		}*/
		
	}
	
	$scope.updatePaciente = function (paciente) {
		$http.put('/api/paciente/' + paciente._id, {nombre:paciente.nombre,apellido:paciente.apellido,fechaNacimiento:paciente.fechaNacimiento,ciudad:paciente.ciudad, email:paciente.email,obraSocial:paciente.obraSocial,
		documento:paciente.documento,tipoDocumento:paciente.tipoDocumento,telefono:paciente.telefono,medicacion:paciente.medicacion,celular:paciente.celular,domicilio:paciente.domicilio})
		.success(function(data) {
			$scope.pacienteList = data;
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
	};
	
	$scope.editarItem = function (index) {
				$scope.pacienteSelected = $scope.pacienteList[index];
				console.log($scope.pacienteSelected.nombre);
			};
			
			
	
			
	
	})