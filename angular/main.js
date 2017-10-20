angular.module("MainApp", ["ngRoute","ngBootbox"])
    .config(function($routeProvider){
        $routeProvider
			.when('/', {
				templateUrl	: 'pages/landing.html',
			}).when('/login', {
				templateUrl: 'views/login.html',
				controller: 'loginController'
			  })
			  .when('/signup', {
				templateUrl: 'views/signup.html',
				controller: 'loginController'
			  }).when('/backup', {
				templateUrl: 'pages/backup.html',
				controller: 'loginController'
			  }). when("/resultados", {
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
            }).when("/pedidos-invalidos",{
				templateUrl :"pages/pedidos-invalidos.html"
			})
			.when("/muestras", {
                controller: "muestraMetodoController",
                templateUrl: "pages/muestra.html"
			}).when("/localidades", {
                controller: "muestraMetodoController",
                templateUrl: "pages/localidad.html"
            }).when("/perfil",{
				controller: "perfilController",
                templateUrl: "pages/perfil.html"
			}).when("/nuevo-perfil",{
				controller: "perfilController",
                templateUrl: "pages/nuevo-perfil.html"
			}).when("/pedidos-entregar", {
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
			}).controller('loginController', function($scope, Auth) {
			
			$scope.login = function() {
			  Auth.login({
				email: $scope.email,
				password: $scope.password
			  });
			};
		  }).controller("perfilController", function ($scope,$http){
			$scope.perfils={};
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
			$scope.analisisPerfil = []
	
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
				$scope.analisisPerfil.push(analisis); 
			}
			
				
		  }).controller("pedidoController",  function($route,$scope, $http,servicio,$ngBootbox) {
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
			$scope.prestador={},
			$scope.pedidosEntregadosList={},
			$scope.pedidosCreadosList ={},
	
		
		
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
	
	$scope.insertImage = function(doc){
		var logo = new Image(); logo.src = 'reporte.jpg'; 
			doc.addImage(logo, 'JPG', 0, 0,210,297); 
	}
	 
	 
	 $scope.generatePDF1 = function(){
		 var doc = new jsPDF("p", "mm", "a4");
			//$scope.insertImage(doc);
			doc.setLineWidth(1);
			doc.setDrawColor(127, 255, 222);
			doc.line(15, 60, 60, 60);
			window.open(doc.output('datauristring'));
	 }

	 
	 
	 
	 
	 $scope.generatePDF = function (pedido) {
		 var doc = new jsPDF("p", "mm", "a4");

			
			doc.setFont('helvetica'); 
			////$scope.insertImage(doc);
			doc.setTextColor(45,46,47);
			doc.setFontSize(10);
			

			var item = pedido.analisisList;
			doc.text(10,48,"Protocolo:"+pedido.protocolo)
			if(pedido.derivadorDescripcion != undefined && pedido.derivadorDescripcion != "" )
			{doc.text(120,48,"Derivador: "+ pedido.derivadorDescripcion)}
			doc.text(10,53,"Paciente: "+ pedido.paciente.apellido+','+pedido.paciente.nombre)
			doc.text(10,58,"Solicitado por: "+ "DR/A. "+ pedido.medico.nombre)
			doc.text(120,58,"Fecha de Recepción: "+ pedido.fecha)
			if(pedido.paciente.fechaNacimiento != undefined && pedido.paciente.fechaNacimiento != "" && pedido.paciente.fechaNacimiento != null){
				doc.text(120,53,"Edad: "+$scope.calcularEdad(pedido.paciente.fechaNacimiento)+" años")
			}
			
			//doc.setLineWidth(0.65);
			//doc.setDrawColor(107, 255, 212);
			//doc.line(10, 63, 202, 63);
			var position=70;var height = doc.internal.pageSize.height-28; var page = 1; var hallado=0; var ref=0;
			
			for(var i=0; i< item.length;i++){
			
				if (position >= height)
				{
				  doc.addPage();
				  //$scope.insertImage(doc);
				  position = 44 // Restart height position
				  page = page +1;
					
				}

				doc.text(45,position, "DETERMINACIÓN O DOSAJE:");
				//doc.setLineWidth(0.3);
				//doc.setDrawColor(66, 67, 68);
				//doc.line(55,position+1 ,104, position+1);
				//doc.line(15, position+2, 60, position+2);
				doc.setFontType("bold")
				doc.text(95,position,item[i].analisis.determinaciones)
				doc.setFontType("normal")
				if (position+8 >= height)
				{
				  doc.addPage();
				 //$scope.insertImage(doc);
				  position = 44 // Restart height position
				  page = page +1;
				}
				doc.text(15,position+8,	"MÉTODO: "+ item[i].metodo);
				if (position+13 >= height)
				{
				  doc.addPage();
				  //$scope.insertImage(doc);
				  position = 44 // Restart height position
				  page = page +1;
				
				}
				doc.text(15,position+13,"MUESTRA: "+item[i].muestra);
				if (position+22 >= height)
				{
				  doc.addPage();
				  ////$scope.insertImage(doc);
				  position = 44 // Restart height position
				  page = page +1;
				}
				doc.setFontType("bold");
				if(item[i].analisis.valorReferencia.length>0){
					doc.text(115,position+22,"VALOR HALLADO: ");
				}else{
					
					doc.text(15,position+22,"VALOR HALLADO: ");
					//doc.setFontSize(7.5);
					//doc.setTextColor(132,134,136);
					//doc.text(15,position+22,"RANGOS DE REFERENCIA: - ");
					position= position +22 //lo que ocupa lo comun de todos los estudios
				}
				doc.setFontType("normal");
				
				
		if(item[i].analisis.valorReferencia.length>0){
			
				doc.setFontSize(7.5);
				doc.setTextColor(132,134,136);
				doc.text(15,position+22,"RANGOS DE REFERENCIA: ");
				doc.setFontType("normal");
				doc.setFontSize(10); //esta doc.setFontSize(7.5);
				
				position= position +22;var dif=0;
				var initial=position; var hallado=0;
				doc.setTextColor(45,46,47);
		
				if(item[i].analisis.formula.length == 0){
					doc.text(150,position,item[i].resultado[0].valorHallado+"  "+item[i].analisis.unidad);
					if(item[i].repetido){
						doc.setFontType("bold");
						doc.text(150,position+5, '**REPETIDO**')
						doc.setFontType("normal");
					}
					
				}else{
					position=position+5
					for(var y=0;y<item[i].resultado.length;y++){
						var isWritten=false
						for(x=0;x<item[i].resultado[y].valorHallado.length;x++){
							if (position >= height)
							{
								doc.addPage();
								//$scope.insertImage(doc);
								page = page +1;
								position=45;
								initial=40;
							}
							if((item[i].resultado[y].valorHallado[x]!=""&& item[i].analisis.codigo==="0711")||item[i].analisis.codigo!="0711"){
								console.log(item[i].analisis.codigo)
								//if(item[i].analisis.codigo!="0481" || (item[i].analisis.codigo=="0481"&&item[i].analisis.formula[y].nombre!="BILIRRUBINA:")){
									if(item[i].analisis.formula[y].subformula == null){
										doc.text(115,position,item[i].resultado[y].formula);
										doc.text(160,position,item[i].resultado[y].valorHallado[x]+"   "+item[i].analisis.formula[y].unidad);
										position = position+5;
										hallado=position;
									}else{
										
										if(!isWritten)
										{	doc.text(115,position,item[i].resultado[y].formula);
											position = position+5;
											hallado=position;
											isWritten=true
										}
										//for(var a=x; a<item[i].analisis.formula[y].subformula.length;a++){
											doc.text(115,position,item[i].analisis.formula[y].subformula[x].nombre);
											doc.text(160,position,item[i].resultado[y].valorHallado[x]+"   "+item[i].analisis.formula[y].subformula[x].unidad);
											position = position+5;
											hallado=position;
										//}
										
									}
									
								}
							
							
						}
					
						}
						

							
						if(item[i].repetido){
						doc.setFontType("bold");
						doc.text(150,position+5, '**REPETIDO**')
						doc.setFontType("normal");
						
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
						doc.text(15,position,item[i].analisis.valorReferencia[k]);
						position=position+5;
						ref=position;
					}
						
						
						if(ref>hallado){position=ref;}
						else{position=hallado;}
		
					
					doc.setTextColor(45,46,47);
				//doc.setFontSize(9.5);

			}

			
			else{
				
				
				

				if(item[i].analisis.formula.length>0 && !item[i].analisis.multiple){
					
					for(var r=0;r<item[i].resultado.length;r++){
						if (position >= height)
						{
							doc.addPage();
							////$scope.insertImage(doc);
							page = page +1;
							position=45;
							initial=40;
						}
						
						if(item[i].resultado[r].formula == "")
						{doc.text(20,position+5,item[i].resultado[r].valorHallado[0])
							position = position+5;}
						else{
						
							doc.text(20,position+5,item[i].resultado[r].formula)
							doc.text(35,position+5,item[i].resultado[r].valorHallado[0]+"  "+item[i].analisis.formula[r].unidad)
							position = position+5;
						}
						
						
					}
					if(item[i].repetido){
						doc.setFontType("bold");
						doc.text(150,position+5, '**REPETIDO**')
						doc.setFontType("normal");
						
					}
					
				}else{
				doc.setFontSize(9.5);
				position=position+5; var c=0;

				for(var z=0;z<item[i].resultado.length;z++){
					if(item[i].analisis.multiple){
						for(var f=0;f<item[i].resultado[z].valorHallado.length;f++){
						if (position >= height)
						{
							doc.addPage();
							////$scope.insertImage(doc);
							page = page +1;
							position=45;
							initial=40;
						}
						
						if((item[i].resultado[z].valorHallado[f]!=""&& item[i].analisis.codigo==="0035")||item[i].analisis.codigo!="0035"){
						if(c==0){doc.text(20,position,item[i].resultado[z].formula);
						doc.text(20,position+5,item[i].resultado[z].valorHallado[f])
						c++; position = position+5;}
						else{doc.text(20,position,item[i].resultado[z].valorHallado[f]);}
						position = position+5;
						
							}
						}
						hallado=position;
					 	c=0;
					}else{
						doc.text(45,position-5,item[i].resultado[z].formula+"   "+item[i].resultado[z].valorHallado[0])
						//position = position+5;
						hallado=position;
					}
					
					
				}
				
				if(item[i].repetido){
						doc.setFontType("bold");
						doc.text(45,position+4, '**REPETIDO**')
						doc.setFontType("normal");
						hallado=hallado+7;
						
					}
					position=hallado;
				
			}
				
			} //fin else

				doc.setFontSize(7);
				doc.setTextColor(132,134,136);
				doc.text(185,275, 'Página ' + page);
				position = position+8.5;
				doc.setTextColor(45,46,47);
				doc.setFontSize(10);
			} //fin For
				
				
           doc.setFontSize(8);
			doc.text(85,270, 'ETHEL A. PEDERNERA');
			doc.text(92,273, 'Bioquímica');
			doc.text(92,276, 'M.P. 4659');
			//window.open(doc.output('datauristring'));
			doc.save('descarga');
			
		}
	

		$scope.getVarsUrl =function (){
		var str = window.location.toString();
		var res = str.split("=");
		console.log("url"+res[1])
		return res[1];
		}
		
		$scope.physicalRemoveAnalisis = function(id_pedido,id_analisis){
			$http.put('/api/pedidos/'+id_pedido+'/remove-analisis', {analisis:id_analisis})
			.success(function(data) {
			})
			.error(function(err) {
				console.log('Error: '+err);
			});
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
		
		$scope.pedidosInvalidosList = {};
		$http.get('/api/pedidos?estado=Invalido')
		.success(function(data) {
			$scope.pedidosInvalidosList = data; 
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
			$scope.pedidoId= {}
			$scope.savePedidoId = function(id){
				$scope.pedidoId=id
				servicio.data.pedidoId=$scope.pedidoId
				console.log($scope.pedidoId)
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
		
		$scope.confirmDeletePedido = function(id) {
			
		  $ngBootbox.confirm('Desea ELIMINAR el pedido? UNA VEZ ELIMINADO, NO PODRÁ SER RECUPERADO')
			.then(function() {
			  $scope.deletePedido(id)
			},
			function() {
			  //Confirm was cancelled, don't delete customer
			  console.log('Confirm was cancelled');
			});
		};
		
		$scope.deletePedido = function(id){
			$http.delete('/api/pedido/'+id)
			.success(function(data) {
				$scope.pedidosInvalidosList = data;
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
		
		$scope.saveResult = function (pedido,id_analisis,orden,metodo,muestra,repetido,valorHallado) {
			
		pedido.analisisList[orden].resultados = valorHallado

		$http.put('/api/loadResults/pedido/'+pedido._id+'/analisis/'+id_analisis,{'metodo':metodo,'muestra':muestra,'repetido': repetido,'resultado':pedido.analisisList[orden].resultado})
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
			analisisList : []
		
		};

		$scope.confirmDeleteAnalisis = function(pedido_id,analisis_id){
			
		  $ngBootbox.confirm('Desea eliminar el analisis para el pedido?')
			.then(function() {
			  $scope.deleteAnalisisForPedido(pedido_id,analisis_id);
			   $route.reload();
			},
			function() {
			  //Confirm was cancelled, don't delete customer
			  console.log('Confirm was cancelled');
			});
		};
		
		
		$scope.deleteAnalisisForPedido = function(pedido_id,analisis_id){
			$http.put('/api/pedidos/'+pedido_id+'/remove-analisis', {analisis:analisis_id})
			.success(function(data) {
				$scope.analisisList = data;
			
			})
			.error(function(err) {
				console.log('Error: '+err);
			});
		};
		
		$scope.obra =null;
			$scope.selectObraSocial = function(ob){
				$scope.obra=ob;
			}
			
		$scope.createPedido = function () {
			for(var i=0; i< servicio.data.analisisListPedido.length;i++){
				$scope.newPedido.analisisList.push(servicio.data.analisisListPedido[i]);
			}
			
			$scope.newPedido.paciente = servicio.data.paciente._id
			$scope.newPedido.medico = servicio.data.medico._id
			if($scope.obra != null){
				$scope.newPedido.obrasocial = $scope.obra.obraSocial;
				$scope.newPedido.afiliado = $scope.obra.afiliado;
				
			}
			
			
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

		$scope.repetido = false;
		
		$scope.selectRepetido = function(value){
			$scope.repetido =value
		}
		
		$scope.agregarNuevoAnalisis = function(analisis){
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
			$scope.objeto = {"analisis":analisis._id,"metodo":analisis.metodoDefault,"muestra":analisis.muestraDefault,"repetido":false,"resultado":$scope.resultado};
		$http.put('/api/pedidos/'+servicio.data.pedidoId+'/add-analisis',$scope.objeto)
		.success(function(data) {
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
		$route.reload()
	}
		
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
    $scope.estudio = {}
	
	
	
	$scope.findAnalisisByName =function(code){
		$http.get('/api/analisisByCode/'+code)
		.success(function(data) {
			$scope.estudio = data[0];
			console.log($scope.estudio.determinaciones)
		}).error(function(err) {
			console.log('Error: '+err);
		});
	}
    
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
		$http.put('/api/analisis/' + analisis._id, {determinaciones:analisis.determinaciones,valorReferencia:analisis.valorReferencia,unidad:analisis.unidad,formula:analisis.formula,valor:analisis.valor,metodoDefault:analisis.metodoDefault,muestraDefault:analisis.muestraDefault})
		.success(function(data) {
			$scope.analisisList = data;
			console.log($scope.selectedAnalisis)
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
		$scope.objeto = {"analisis":analisis._id,"metodo":analisis.metodoDefault,"muestra":analisis.muestraDefault,"repetido":false,"resultado":$scope.resultado};
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
	
	$scope.clearAnalisis = function(){
		$scope.analisisListFiltered = [];
		$scope.analisisListFilteredObject = [] ;
		
	}

	}).controller("pacienteController", function($scope, $http,servicio,$ngBootbox) {
	
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
