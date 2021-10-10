starter.factory("servicio", function(){
				return {
					data: {},
				} ;

}).controller("pacienteController", function($route,$scope, $http,servicio,$ngBootbox) {
	$scope.totalItems=400;
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
	$scope.token= "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTQ5MjcyYWZlN2ZkMjYxNzk0MDcxNGIiLCJleHAiOjE2NjM3MjAxMDYsImlhdCI6MTYzMjE4NDEwNn0.oN9a97hM4MfwBTF6UpgCrVqlB_tWxECEqdJDq2zgcRw";


	$scope.removePaciente = function(id){
		$http.delete('/api/paciente/'+id, { headers:{"authorization": $scope.token }}).success(function(data){
			$scope.pacienteList=data
		}).error(function(err){
			$ngBootbox.alert(err)
		})
	}



		$scope.calcularEdad = function(birthday){
			if(birthday !=null){
				var hoy = new Date();
				var cumpleanos = new Date(birthday);
				var anosdiff = hoy.getFullYear() - cumpleanos.getFullYear();
				var mesdiff = hoy.getMonth() - cumpleanos.getMonth();


				if (mesdiff < 0 || (mesdiff === 0 && hoy.getDate() < cumpleanos.getDate())) {
					anosdiff--;
				}

				if( anosdiff === 0){
						var days= hoy.getTime()-cumpleanos.getTime();
						var contdias = Math.trunc(days/(1000*60*60*24));
						var month = Math.trunc(contdias/30);
						if(month === 0){ if(contdias === 0) {return "RECIEN NACIDO";} if(contdias === 1){ return "1 d\u00EDa";} return contdias + " d\u00EDas";}
						if(month === 1){ return "1 mes";}return month + " meses";
					}

				 if(anosdiff === 1){ return "1 a\u00F1o";} return anosdiff + " a\u00F1os";
			}

		}

	$scope.pedidosByPacienteList = {}

	$scope.getPedidoByPaciente = function(paciente){
	$http.get('api/pedidosByPaciente/' + paciente._id, { headers:{"authorization":$scope.token }})
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
		  $ngBootbox.confirm('Realmente desea ELIMINAR el paciente: '+ paciente.apellido+', '+paciente.nombre +' ?'+  '\n\n'+'  UNA VEZ ELIMINADO NO PODR� SER RECUPERADO')
			.then(function() {
			  $scope.removePaciente(paciente._id);
			},
			function() {
			  //Confirm was cancelled, don't delete customer
			  console.log('Confirm was cancelled');
			});
		};
	$scope.getPacientes = function (page){
	//	for(var x = 0; x <2000; x++){
	//	console.log('pacientes '+ x);
		$http.get('/api/pacientes/'+page, { headers:{"authorization":$scope.token }})
		.success(function(data) {
			$scope.pacienteList = data;
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
	//}
}

	$scope.search = function() {
		$http.get('/api/pacienteBy?apellido='+ $scope.nombrePaciente.toUpperCase(),{ headers:{"authorization":$scope.token }})
		.success(function(data) {
			$scope.pacienteListFilter = data;
			$scope.pacienteList= data; //para el filtro en la lista de pacientes
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
	};


	$scope.createPaciente = function () {
		//obraSocial = {"prestador":$scope.newPaciente.prestador,"afiliado":$newPaciente.afiliado}
		$http.post('/api/paciente', $scope.newPaciente, { headers:{"authorization": $scope.token}})
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


	$scope.pacienteModificado = function(paciente){
		servicio.data.modifiedPaciente=paciente;
		console.log($scope.modifiedPaciente)
	}

	$scope.actualizarObraSocial = function(paciente_id, ob){
		$http.put('/api/paciente/' + paciente_id + '/obrasocial/' + ob._id, {obraSocial: ob.obraSocial , afiliado: ob.afiliado},{ headers:{"authorization": $scope.token }})
		.success(function(data) {
			$ngBootbox.alert("La obra social ha sido actualizada exitosamente!")
		})
		.error(function(err) {
			console.log('Error: '+err);
			$ngBootbox.alert("Hubo un error y no se pudo actualizar la obra social!")
		});
	}


	$scope.agregarObraSocial = function(obraSocial,afiliado){
		$scope.newObraSocial = {"obraSocial":obraSocial,"afiliado":afiliado};
		servicio.data.modifiedPaciente.obraSocial.push($scope.newObraSocial)
		$scope.updatePaciente(servicio.data.modifiedPaciente);


	}

	$scope.agregarPaciente = function (paciente){
		servicio.data.paciente = paciente
		$scope.pacienteSelected = paciente.nombre+" "+paciente.apellido
		$scope.obraSocialPacienteSelected = paciente.obraSocial;
		$scope.nombrePaciente = paciente.apellido + ", " + paciente.nombre;//para que se muestre en el input de pedido cuando se selecciona
		console.log("obra social para paciente:"+paciente.obraSocial)
	/*if(paciente.prestador !="" && paciente.afiliado != ""){
			$scope.pacienteSelectedAfiliado = paciente.prestador+" - Numero de Afiliado: "+paciente.afiliado
		}else{
			if((paciente.prestador != null || paciente.prestador !=""))
			{$scope.pacienteSelectedAfiliado = paciente.prestador}
		}*/

	}

	$scope.updatePaciente = function (paciente) {
		$http.put('/api/paciente/' + paciente._id, { headers:{"authorization": $scope.token }}, {nombre:paciente.nombre,apellido:paciente.apellido,fechaNacimiento:paciente.fechaNacimiento,ciudad:paciente.ciudad, email:paciente.email,obraSocial:paciente.obraSocial,
		documento:paciente.documento,tipoDocumento:paciente.tipoDocumento,telefono:paciente.telefono,medicacion:paciente.medicacion,celular:paciente.celular,domicilio:paciente.domicilio})
		.success(function(data) {
			//$scope.pacienteList = data;
			$ngBootbox.alert("El paciente ha sido actualizado exitosamente!")
		})
		.error(function(err) {
			console.log('Error: '+err);
			$ngBootbox.alert("Hubo un error y no se pudo actualizar los datos del paciente!")
		});
	};

	$scope.editarItem = function (index) {
				$scope.pacienteSelected = $scope.pacienteList[index];
				console.log($scope.pacienteSelected.nombre);
			};



	})
