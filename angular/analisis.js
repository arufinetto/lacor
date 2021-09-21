starter.factory("servicio", function(){
				return {
					data: {},
				} ;
}).controller("analisisController", function($scope, $http,servicio, $ngBootbox) {

	$scope.analisisList = {};
	$scope.analisisListFiltered = [];
	$scope.analisisListFilteredObject = [];
    $scope.estudio = {};
	$scope.totalItems=1500;
	$scope.currentPage=1;
	$scope.page=50;
	$scope.precio=0;
	$scope.analisisValorReferenciaAnimal = {};
	$scope.newValorReferenciaAnimal = "";
	$scope.selectedAnimal = "";
	$scope.miFilterReferenciaAnimal = "";
	$scope.token= "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTQ5MjcyYWZlN2ZkMjYxNzk0MDcxNGIiLCJleHAiOjE2NjM3MjAxMDYsImlhdCI6MTYzMjE4NDEwNn0.oN9a97hM4MfwBTF6UpgCrVqlB_tWxECEqdJDq2zgcRw";


	$scope.updateUB= function(){
		$http.put('/api/unidad-bioquimica/precio', {valor:$scope.precio},{headers:{"authorization":$scope.token}})
		.success(function(data) {
		}).error(function(err) {
			console.log('Error: '+err);
		});
	}

	$scope.calcularCostoPedido = function(){
		var costoTotal = 0;
		 for(var i =0; i<$scope.analisisListFiltered.length;i++){
			costoTotal = parseFloat($scope.analisisListFiltered[i].valor)*parseFloat($scope.analisisListFiltered[i].UB) + costoTotal;
		 }
		 return costoTotal;
	}

	$scope.agregarFormula = function(nombre, unidad, analisis){
		if(unidad == null || unidad == undefined){unidad = ""};
		$scope.newFormula = {"nombre": nombre, "unidad":unidad};
		analisis.formula.push($scope.newFormula);

	}

	//para detener el submit cuando se hace enter
	$scope.keyPressOnForm = function(event) {

			if (event.keyCode === 13) {
				event.preventDefault();
			}
		}

	$scope.findAnalisisByName =function(code){
		$http.get('/api/analisisByCode/'+code,{headers:{"authorization":$scope.token}})
		.success(function(data) {
			$scope.estudio = data; //filtra en pedidos en proceso
			$scope.analisisList = data; //para filtrar en la lista de estudios
			console.log("ARRANCA POR ACA " +$scope.analisisList[0])
		}).error(function(err) {
			console.log('Error: '+err);
		});
	}

	$scope.getAnalisis = function(page){
		$http.get('/api/analisis/'+ page,{headers:{"authorization":$scope.token}})
		.success(function(data) {
			$scope.analisisList = data;
		}).error(function(err) {
			console.log('Error: '+err);
		});
	}

	$scope.newAnalisis = {
		codigo: '',
        determinaciones: '',
		urgencia: 'U',
		NI: 'NI',
		UB: 'UB',
		multiple: false,
        valor: '100',
		otro:'PMO',
		pedidoList:[],
		formula: [],
		valorReferencia:[],
		unidad:'',
		metodoDefault:'',
		muestraDefault:''

	};
	$scope.createAnalisis = function(){
	$http.post('/api/analisis', $scope.newAnalisis,{headers:{"authorization":$scope.token}})
		.success(function(data) {
			$scope.newAnalisis = {
				codigo: '',
				determinaciones: '',
				urgencia: 'U',
				NI: 'NI',
				UB: 'UB',
				multiple: false,
				valor: '100',
				otro:'PMO',
				pedidoList:[],
				formula: [],
				valorReferencia:[],
				unidad:'',
				metodoDefault:'',
				muestraDefault:''

			};
			$ngBootbox.alert("El analisis se ha creado exitosamente!")
		}).error(function(err) {
			$ngBootbox.alert("Se produjo un error al crear el analisis: " + err)
	 });
	}


	$scope.isEmpty = function(value){
		return (value == "" || value == null);
	};
	$scope.searchAnalisis = function() {
		$http.get('/api/analisisBy?codigo='+ $scope.codigo,{headers:{"authorization":$scope.token}})

		.success(function(data) {
			$scope.analisis = data;
			console.log(data)
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
	};

	$scope.updateAnalisis = function(analisis){
		$http.put('/api/analisis/' + analisis._id, {UB:analisis.UB,determinaciones:analisis.determinaciones,valorReferencia:analisis.valorReferencia,unidad:analisis.unidad,formula:analisis.formula,valor:analisis.valor,metodoDefault:analisis.metodoDefault,muestraDefault:analisis.muestraDefault,multiple:analisis.multiple,valorReferenciaAnimal:analisis.valorReferenciaAnimal},{headers:{"authorization":$scope.token}})
		.success(function(data) {
			//$scope.analisisList = data;
		})
		.error(function(err) {
			console.log('Error: '+err);
		});

	}

	$scope.addValorReferencia= function(analisis,nuevoValorReferencia){
		if(nuevoValorReferencia !=undefined || nuevoValorReferencia!=null)
		{analisis.valorReferencia.push(nuevoValorReferencia);}
		}

		$scope.deleteValorReferencia= function(analisis,index){
		analisis.valorReferencia.splice(index,1);
		}

	$scope.updateRangoReferencia = function(index,value){
	  $scope.selectedAnalisis.valorReferencia[index] = value;
	}

	$scope.selectAnalisis = function (analisis){
		$scope.selectedAnalisis = analisis;
		console.log("el seleccionado:" + $scope.selectedAnalisis.UB)
	}
	$scope.addAnalisis = function(analisis){
		$scope.resultado = [];
		var valorHallado = [""];
		if(analisis.formula.length==0){

			$scope.obj={"formula":"","valorHallado":valorHallado};
			$scope.resultado.push($scope.obj);
		}else{
			for (var i=0;i<analisis.formula.length;i++){

				$scope.obj={"formula":analisis.formula[i].nombre,"valorHallado":valorHallado};
				$scope.resultado.push($scope.obj);
			}
		}
		$scope.objeto = {"imprimir":true,"analisis":analisis._id,"metodo":analisis.metodoDefault,"muestra":analisis.muestraDefault,"repetido":false,"observacion":"","resultado":$scope.resultado};
		$scope.analisisListFiltered.push(analisis); //lo necesito para la UI que muestre todo
		console.log($scope.analisisListFiltered)
		$scope.analisisListFilteredObject.push($scope.objeto);
		servicio.data.analisisListPedido = $scope.analisisListFilteredObject;
	}




	$scope.removeAnalisis = function(index){
		$scope.analisisListFilteredObject.splice(index,1);
		$scope.analisisListFiltered.splice(index,1);
		//$scope.analisisListFilteredObject.slice(analisis._id);
		//servicio.data.analisisListPedido=$scope.analisisListFilteredObject
	}

	$scope.clearAnalisis = function(){
		$scope.analisisListFiltered = [];
		$scope.analisisListFilteredObject = [] ;

	}

		 $scope.addAnalisisByPressingEnter =function (code){
			$http.get('/api/analisisByCode/'+code,{headers:{"authorization":$scope.token}})
			.success(function(data) {
				$scope.estudio = data; //filtra en pedidos en proceso
				$scope.addAnalisis($scope.estudio[0])
			})
			.error(function(err) {
				console.log('Error: '+err);
			});
		 }

	$scope.agregarValorReferenciaAnimal	= function(analisis, animal, valorReferencia){
		if(analisis.valorReferenciaAnimal[animal]== null){
			//ASIGNO LA NUEVA KEY (el nombre del animal)
			//analisis.valorReferenciaAnimal = Object.assign({ animal:[valorReferencia] }, analisis.valorReferenciaAnimal);
		 analisis.valorReferenciaAnimal[animal]= [valorReferencia]
		}else{
			//YA EXISTE LA KEY Y AGREGO UN NUEVO VALOR DE REFERENCIA
			analisis.valorReferenciaAnimal[animal].push(valorReferencia)

		}
	}



		$scope.agregarAnalisis = function(analisis){
			$scope.analisisValorReferenciaAnimal = analisis;
			$scope.miFilterReferenciaAnimal = analisis.codigo + "," +analisis.determinaciones;


		}


	$scope.updateValorReferenciaAnimal =function (analisis){
			$http.put('/api/valor-referencia-animal/'+ analisis._id,{valorReferenciaAnimal: analisis.valorReferenciaAnimal},{headers:{"authorization":$scope.token}})
			.success(function(data) {
				$ngBootbox.alert("Los valores de referencia se guardaron exitosamente!")
				$scope.analisisList = {}
				$scope.newValorReferenciaAnimal = ""
				$scope.analisisValorReferenciaAnimal = {}
				$scope.estudio = {}
				$scope.selectedAnimal = ""
				$scope.miFilterReferenciaAnimal = ""
			})
			.error(function(err) {
				console.log('Error: '+err);
			});
		 }


	})
