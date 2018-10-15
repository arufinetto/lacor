starter.factory("servicio", function(){
				return {
					data: {},
				} ;
}).controller("analisisController", function($scope, $http,servicio, $ngBootbox) {

	$scope.analisisList = {};
	$scope.analisisListFiltered = [];
	$scope.analisisListFilteredObject = [];
    $scope.estudio = {};
	$scope.totalItems=1350;
	$scope.currentPage=1;
	$scope.page=50;
	
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
		$http.get('/api/analisisByCode/'+code)
		.success(function(data) {
			$scope.estudio = data; //filtra en pedidos en proceso
			$scope.analisisList = data; //para filtrar en la lista de estudios
		}).error(function(err) {
			console.log('Error: '+err);
		});
	}
    
	$scope.getAnalisis = function(page){
		$http.get('/api/analisis/'+ page)
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
	$http.post('/api/analisis', $scope.newAnalisis)
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
		$http.get('/api/analisisBy?codigo='+ $scope.codigo)
		
		.success(function(data) {
			$scope.analisis = data;
			console.log(data)
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
	};
	
	$scope.updateAnalisis = function(analisis){
		$http.put('/api/analisis/' + analisis._id, {determinaciones:analisis.determinaciones,valorReferencia:analisis.valorReferencia,unidad:analisis.unidad,formula:analisis.formula,valor:analisis.valor,metodoDefault:analisis.metodoDefault,muestraDefault:analisis.muestraDefault,multiple:analisis.multiple})
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
		$scope.objeto = {"analisis":analisis._id,"metodo":analisis.metodoDefault,"muestra":analisis.muestraDefault,"repetido":false,"observacion":"","resultado":$scope.resultado};
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
			$http.get('/api/analisisByCode/'+code)
			.success(function(data) {
				$scope.estudio = data; //filtra en pedidos en proceso
				$scope.addAnalisis($scope.estudio[0])
			})
			.error(function(err) {
				console.log('Error: '+err);
			});
		 }
		
		
	})