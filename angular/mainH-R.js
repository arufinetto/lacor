﻿angular.module("MainApp", ["ngRoute","ngBootbox"])
    .config(function($routeProvider){
        $routeProvider
			.when('/', {
				templateUrl	: 'pages/landing.html',
			}).
            when("/resultados", {
                controller: "pedidoController",
                templateUrl: "resultados.html"
            }).when("/metodos", {
                controller: "muestraMetodoController",
                templateUrl: "pages/metodo.html"
            }).when("/prestadores", {
                controller: "pedidoController",
                templateUrl: "pages/prestador.html"
            }).when("/medicos", {
                controller: "medicoController",
                templateUrl: "pages/medicos.html"
            }).when("/pedido", {
                controller: "pedidoController",
                templateUrl: "pages/pedido.html"
            })
			.when("/muestras", {
                controller: "muestraMetodoController",
                templateUrl: "pages/muestra.html"
			}).when("/localidades", {
                controller: "muestraMetodoController",
                templateUrl: "pages/localidad.html"
            })
			.when("/pedidos-entregar", {
                controller: "pedidoController",
                templateUrl: "pages/pedidos-entregar.html"
            }).when("/pedidos-entregados", {
                controller: "pedidoController",
                templateUrl: "pages/pedidos-entregados.html"
            })
            .when("/analysis-list", {
                controller: "analisisController",
                templateUrl: "pages/analysis-list.html"
            }).when("/paciente", {
                controller: "pacienteController",
                templateUrl: "pages/paciente.html"
            }).when("/paciente-list", {
                controller: "pacienteController",
                templateUrl: "pages/paciente-list.html"
            }).when("/pedidos-creados", {
				controller: "pedidoController",
                templateUrl: "pages/pedidos-creados.html"
            }).when("/pedido-list",{
				controller: "pedidoController",
				templateUrl: "pages/pedido-list.html"
			}).when("/save-results",{
				controller: "pedidoController",
				templateUrl: "pages/save-results.html"
			})
		}).factory("servicio", function(){
				return {
					data: {}
					
				} ;
			}).controller("pedidoController",  function($scope, $http,servicio,$ngBootbox) {
		$scope.pedidosAbiertosList = {}
		$scope.pedidosCompletosList = {}
		$scope.created=false
		$scope.valorHalladoList = []
		$scope.pedidoActual = {}
		$scope.pedidosList = {}
		$scope.logged =false;
		$scope.pedido = {},
		$scope.ciudades ={},
		$scope.ciudad={},
		$scope.prestadores={},
		$scope.prestador={}
		$scope.pedidosEntregadosList={}
		$scope.pedidosCreadosList ={}
		
		
		
		
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
		
		
		$scope.logIn =function(){
			logged =true;
		}
		
		$scope.calcularEdad = function(birthday){
			var hoy = new Date();
			var cumpleanos = new Date(birthday);
			var edad = hoy.getFullYear() - cumpleanos.getFullYear();
			var m = hoy.getMonth() - cumpleanos.getMonth();

			if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
				edad--;
			}

			return edad;
		}
	
	$scope.insertImage = function(doc){
		var logo = new Image(); logo.src = 'reporte.jpg'; 
			doc.addImage(logo, 'JPG', 0, 0,210,297); 
	}
	 
	 
	 $scope.generatePDF1 = function(){
		 var doc = new jsPDF("p", "mm", "a4");
			$scope.insertImage(doc);
			doc.setLineWidth(1);
			doc.setDrawColor(127, 255, 222);
			doc.line(15, 60, 60, 60);
			window.open(doc.output('datauristring'));
	 }

	 
	 
	 
	 
	 $scope.generatePDF = function (pedido) {
		 var doc = new jsPDF("p", "mm", "a4");

			
			doc.setFont('helvetica'); 
			//$scope.insertImage(doc);
			doc.setTextColor(45,46,47);
			doc.setFontSize(8.5);
			

			var item = pedido.analisisList;
			doc.text(10,48,"Protocolo:"+pedido.protocolo)
			if(pedido.derivadorDescripcion != undefined && pedido.derivadorDescripcion != "" )
			{doc.text(120,48,"Derivador: "+ pedido.derivadorDescripcion)}
			doc.text(10,53,"Paciente: "+ pedido.paciente.apellido+','+pedido.paciente.nombre)
			doc.text(10,58,"Solicitado por: "+ "DR/A. "+ pedido.medico.nombre)
			doc.text(120,58,"Fecha de Recepción: "+ pedido.fecha)
			if(pedido.paciente.fechaNacimiento != undefined && pedido.paciente.fechaNacimiento != "" )
			doc.text(120,53,"Edad: "+$scope.calcularEdad(pedido.paciente.fechaNacimiento)+" años")
			//doc.setLineWidth(0.65);
			//doc.setDrawColor(107, 255, 212);
			//doc.line(10, 63, 202, 63);
			var position=70;var height = doc.internal.pageSize.height-28; var page = 1; var hallado=0; var ref=0;
			
			for(var i=0; i< item.length;i++){
			
				if (position >= height)
				{
				  doc.addPage();
				 // $scope.insertImage(doc);
				  position = 44 // Restart height position
				  page = page +1;
					
				}

				doc.text(15,position, "DETERMINACIÓN O DOSAJE:");
				//doc.setLineWidth(0.1);
				//doc.setDrawColor(66, 67, 68);
				//doc.line(15, position+1, 60, position+1);
				//doc.line(15, position+2, 60, position+2);
				doc.setFontType("bold")
				doc.text(60,position,item[i].analisis.determinaciones)
				doc.setFontType("normal")
				if (position+8 >= height)
				{
				  doc.addPage();
				 // $scope.insertImage(doc);
				  position = 44 // Restart height position
				  page = page +1;
				}
				doc.text(15,position+8,	"MÉTODO: "+ item[i].metodo);
				if (position+13 >= height)
				{
				  doc.addPage();
				 // $scope.insertImage(doc);
				  position = 44 // Restart height position
				  page = page +1;
				
				}
				doc.text(15,position+13,"MUESTRA: "+item[i].muestra);
				if (position+22 >= height)
				{
				  doc.addPage();
				  //$scope.insertImage(doc);
				  position = 44 // Restart height position
				  page = page +1;
				}
				doc.setFontType("bold");
				if(item[i].analisis.valorReferencia.length>0){
					doc.text(15,position+22,"VALOR HALLADO: ");
				}else{
					
					doc.text(15,position+22,"VALOR HALLADO: ");
					//doc.setFontSize(7.5);
					//doc.setTextColor(132,134,136);
				//	doc.text(15,position+22,"RANGOS DE REFERENCIA: - ");
					position= position +22 //lo que ocupa lo comun de todos los estudios
				}
				doc.setFontType("normal");
				
				
		if(item[i].analisis.valorReferencia.length>0){
			
				doc.setFontSize(7.5);
				doc.setTextColor(132,134,136);
				doc.text(115,position+22,"RANGOS DE REFERENCIA: ");
				doc.setFontType("normal");
				doc.setFontSize(8.5); //esta doc.setFontSize(7.5);
				
				position= position +22;var dif=0;
				var initial=position; var hallado=0;
				doc.setTextColor(45,46,47);
		
				if(item[i].analisis.formula.length == 0){
					doc.text(50,position,item[i].resultado[0].valorHallado+" "+item[i].analisis.unidad);
				}else{
					position=position+5
					for(var y=0;y<item[i].resultado.length;y++){
						//for(x=0;x<item[i].resultado[y].valorHallado.length;x++){
							if (position >= height)
							{
								doc.addPage();
								//$scope.insertImage(doc);
								page = page +1;
								position=45;
								initial=40;
							}
							
							
							
							if((item[i].resultado[y].valorHallado[0]!=""&& item[i].analisis.codigo==="0711")||item[i].analisis.codigo!="0711"){
								console.log(item[i].analisis.codigo)
								
								if(item[i].resultado[y].valorHallado.length == 1){
									doc.text(15,position,item[i].resultado[y].formula);
									doc.text(50,position,item[i].resultado[y].valorHallado[0]+" "+item[i].analisis.formula[y].unidad);
									position = position+5;
									hallado=position;
									
								}else{
									var a=0
									for(var r=0;r<item[i].resultado[y].valorHallado.length;r++){
										if (position >= height)
										{
											doc.addPage();
											//$scope.insertImage(doc);
											page = page +1;
											position=45;
											initial=40;
										}
										if(a==0){doc.text(15,position,item[i].resultado[y].formula);
										doc.text(15,position+5,item[i].resultado[y].valorHallado[r]+" "+item[i].analisis.formula[y].unidad)
										a++; position = position+5;}
										else{doc.text(15,position,item[i].resultado[y].valorHallado[r]+" "+item[i].analisis.formula[y].unidad);} //falta unidad
										position = position+5;
										//hallado=position;
									 }
										//a=0;
									
									
								}
							}
						//}
						}
						

						position=initial;
					
				}
				
			
					position=position+5;
					doc.setFontSize(7.5);
					doc.setTextColor(132,134,136);
					for(var k=0;k<item[i].analisis.valorReferencia.length;k++){
						inicial=position;
						if (position >= height)
						{
							doc.addPage();
						//$scope.insertImage(doc);
							page = page +1;
							position=45;
							initial=40;							
						}
						doc.text(115,position,item[i].analisis.valorReferencia[k]);
						position=position+5;
						ref=position;
					}
						
						
						if(ref>hallado){position=ref;}
						else{position=hallado;}
		
					
					doc.setTextColor(45,46,47);
				//doc.setFontSize(9.5);

			}

			
			else{
				doc.setFontSize(8.5);
				position=position+5; var c=0;
				for(var z=0;z<item[i].resultado.length;z++){
					if(item[i].analisis.multiple){
						for(var f=0;f<item[i].resultado[z].valorHallado.length;f++){
						if (position >= height)
						{
							doc.addPage();
							//$scope.insertImage(doc);
							page = page +1;
							position=45;
							initial=40;
						}
						if(c==0){doc.text(20,position,item[i].resultado[z].formula);
						doc.text(20,position+5,item[i].resultado[z].valorHallado[f])
						c++; position = position+5;}
						else{doc.text(20,position,item[i].resultado[z].valorHallado[f]);}
						position = position+5;
						hallado=position;
					 }
					 	c=0;
					}else{
						doc.text(45,position-5,item[i].resultado[z].formula+" "+item[i].resultado[z].valorHallado[0])
						//position = position+5;
						hallado=position;
					}
					
					
				}
				position=hallado;
				
			}

				doc.setFontSize(7);
				doc.setTextColor(132,134,136);
				doc.text(185,275, 'Página ' + page);
				position = position+8.5;
				doc.setTextColor(45,46,47);
				doc.setFontSize(8.5);
			} //fin For
				
				
           doc.setFontSize(8);
			doc.text(85,270, 'ETHEL A. PEDERNERA');
			doc.text(92,273, 'Bioquímica');
			doc.text(92,276, 'M.P. 4659');
			window.open(doc.output('datauristring'));
			
		}
	

		$scope.getVarsUrl =function (){
		var str = window.location.toString();
		var res = str.split("=");
		console.log("url"+res[1])
		return res[1];
		}
		
	
		$http.get('/api/pedidos?estado=Abierto')
		.success(function(data) {
			$scope.pedidosAbiertosList = data; 
			//console.log(data)
		}).error(function(err) {
			console.log('Error: '+err);
		});
		
		$http.get('/api/pedidos?estado=Creado')
		.success(function(data) {
			$scope.pedidosCreadosList = data; 
			//console.log(data)
		}).error(function(err) {
			console.log('Error: '+err);
		});

		
		
		$http.get('/api/pedidos?estado=Entregado')
		.success(function(data) {
			$scope.pedidosEntregadosList = data; 
		}).error(function(err) {
			console.log('Error: '+err);
		});
		
		
		
		$http.get('/api/pedidos?estado=Para Entregar')
		.success(function(data) {
			$scope.pedidosCompletosList = data; 
		}).error(function(err) {
			console.log('Error: '+err);
		});
		
		$scope.getPedidos = function(){
			$scope.estado=["Entregado","Invalido"]
			for(var i=0;i<2;i++){
			$http.get('/api/pedidos?estado='+$scope.estado[i])
			.success(function(data) {
				$scope.pedidosList = data;
				console.log(data)
			}).error(function(err) {
				console.log('Error: '+err);
			});
			}
		}
			
			

			$scope.getPedido = function(id){
			$http.get('/api/pedidos/'+id)
			.success(function(data) {
				$scope.pedido =data
				//return data;
			}).error(function(err) {
				console.log('Error: '+err);
			});
			}
		
	
			$http.get('/api/prestadores')
			.success(function(data) {
				$scope.prestadores =data
				//return data;
			}).error(function(err) {
				console.log('Error: '+err);
			});
			
			$scope.createPrestador = function(){
				$http.post('/api/prestadores', $scope.prestador)
				.success(function(data) {
					$scope.prestadores =data
					//return data;
				}).error(function(err) {
					console.log('Error: '+err);
				});
			}
		
		$scope.updateEstadoPedido = function(id, estado){
		$http.put('/api/updateState/pedido/'+id,{estado:estado})
		.success(function(data) {
			if(estado == 'Para Entregar')
			{$scope.pedidosAbiertosList = data;}
			if(estado == 'Entregado')
			$scope.pedidosCompletosList = data;
			if(estado == 'Abierto')
			{$scope.pedidosCreadosList = data;}
		}).error(function(err) {
			console.log('Error: '+err);
		});
		}
		
		
		
		
			$scope.confirmEntregar = function(pedido,estado) {
			
		  $ngBootbox.confirm('Desea entregar el pedido?')
			.then(function() {
			  $scope.updateEstadoPedido(pedido._id,estado)
			},
			function() {
			  //Confirm was cancelled, don't delete customer
			  console.log('Confirm was cancelled');
			});
		};
		
		$scope.confirmCambiarEstado = function(pedido,estado) {
			var verb="completó"
			if(estado=="Invalido"){
				verb="invalide"
			}
		  $ngBootbox.confirm('Una vez que '+ verb.toUpperCase() +' el pedido, no podrá actualizar sus resultados.')
			.then(function() {
			  $scope.updateEstadoPedido(pedido._id,estado)
			},
			function() {
			  //Confirm was cancelled, don't delete customer
			  console.log('Confirm was cancelled');
			});
		};
		
		
		$scope.add= function(lab,indexRes){
			lab.resultado[indexRes].valorHallado.push("");
			//$scope.saveResult(pedido,id_analisis,orden,metodo,muestra,valorHallado)
		}
		
		$scope.saveResult = function (pedido,id_analisis,orden,metodo,muestra,valorHallado) {
			
		pedido.analisisList[orden].resultados = valorHallado

		$http.put('/api/loadResults/pedido/'+pedido._id+'/analisis/'+id_analisis,{'metodo':metodo,'muestra':muestra,'resultado':pedido.analisisList[orden].resultado})
		.success(function(data) {
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
	};
		
		$scope.newPedido = {
			medico: '',
			paciente: null,
			estado: 'Creado',
			derivador: '',
			derivadorDescripcion:'',
			diagnostico: '',
			obrasocial:'',
			afiliado:'',
			analisisList : []
		
		};


		
		$scope.createPedido = function () {
			for(var i=0; i< servicio.data.analisisListPedido.length;i++){
				$scope.newPedido.analisisList.push(servicio.data.analisisListPedido[i]);
			}
			
			$scope.newPedido.paciente = servicio.data.paciente._id
			$scope.newPedido.medico = servicio.data.medico._id
			$scope.newPedido.obrasocial = servicio.data.paciente.prestador
			$scope.newPedido.afiliado= servicio.data.paciente.afiliado
			
			$http.post('/api/pedidos', $scope.newPedido)
			.success(function(data) {
				$scope.created=true;
				//$scope.pedidosAbiertosList=data
				$scope.newPedido = {};
				servicio.data = {};
				
				$scope.analisisListFiltered={} //lo necesito para la UI que muestre todo
				$scope.analisisListFilteredObject={}
				servicio.data.analisisListPedido = {}
				
			})
			.error(function(err) {
				console.log('Error: '+err);
			});
		};
		
	}).controller("medicoController", function($scope, $http,servicio,$ngBootbox) {

		$scope.medicosList = {}
		$scope.medicoSelected = null
		$scope.medico = {}
		
		$http.get('/api/medicos')
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
			$http.delete('/api/medico/'+ id)
			.success(function(data) {
				$scope.medicosList = data;
			}).error(function(err) {
				console.log('Error: '+err);
			});	
		}
		
		$scope.createMedico = function (){
			$http.post('/api/medico', $scope.medico)
			.success(function(data) {
				$scope.medicosList = data;
				$scope.medico = {};
			}).error(function(err) {
				console.log('Error: '+err);
			});
		}
	
	
	}).controller("analisisController", function($scope, $http,servicio) {

	$scope.analisisList = {};
	$scope.analisisListFiltered = [];
	$scope.analisisListFilteredObject = [];


	$http.get('/api/analisis')
		.success(function(data) {
			$scope.analisisList = data;
		}).error(function(err) {
			console.log('Error: '+err);
		});
	
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
		$http.put('/api/analisis/' + analisis._id, {determinaciones:analisis.determinaciones,valorReferencia:analisis.valorReferencia,unidad:analisis.unidad,formula:analisis.formula,valor:analisis.valor})
		.success(function(data) {
			$scope.analisisList = data;
			console.log($scope.selectedAnalisis)
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
		
	}

	$scope.addValorReferencia= function(analisis,nuevoValorReferencia){
		  analisis.valorReferencia.push(nuevoValorReferencia);
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
		$scope.objeto = {"analisis":analisis._id,"metodo":null,"muestra":null,"resultado":$scope.resultado};
		$scope.analisisListFiltered.push(analisis); //lo necesito para la UI que muestre todo
		$scope.analisisListFilteredObject.push($scope.objeto);
		servicio.data.analisisListPedido = $scope.analisisListFilteredObject;
		console.log(servicio.data.analisisListPedido)
	}
	
	$scope.removeAnalisis = function(index){
		$scope.analisisListFilteredObject.splice(index,1);
		$scope.analisisListFiltered.splice(index,1);
		console.log($scope.analisisListFiltered)
		//$scope.analisisListFilteredObject.slice(analisis._id);
		//servicio.data.analisisListPedido=$scope.analisisListFilteredObject
	}

	}).controller("pacienteController", function($scope, $http,servicio) {
	
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
		ciudad:''
		
	};
	$scope.pacienteSelected = null;
	$scope.pacienteList = {};
	$scope.pacienteListFilter = {};
	$scope.nombrePaciente= null;
	
	$http.get('/api/pacientes')
	.success(function(data) {
		$scope.pacienteList = data;
	})
	.error(function(err) {
		console.log('Error: '+err);
	});
	
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
			console.log($scope.newPaciente);
			$scope.pacienteList = data;
			$scope.newPaciente = {};
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
	};
	
	$scope.agregarPaciente = function (paciente){
		servicio.data.paciente = paciente
		$scope.pacienteSelected = paciente.nombre+" "+paciente.apellido
		$scope.pacienteSelectedAfiliado = paciente.prestador+" - Numero de Afiliado: "+paciente.afiliado
	}
	
	$scope.updatePaciente = function (index) {
		$http.put('/api/paciente/' + $scope.pacienteList[index]._id, $scope.pacienteList[index])
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
			
	
/*	$scope.borrarPersona = function () {
		$http.delete('/api/persona/' + $scope.nuevaPersona._id)
		.success(function(data) {
			$scope.personas = data;
			$scope.nuevaPersona = {};
			$scope.selected = false;
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
	};
	
	$scope.cancelarPersona = function () {
		$scope.nuevaPersona = {};
		$scope.selected = false;
	};
	
	$scope.seleccionarPersona = function(persona) {
		$scope.nuevaPersona = angular.copy(persona);
		$scope.selected = true;
	}; */
	}).controller("muestraMetodoController", function($scope, $http, $ngBootbox) {
	
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
	})
