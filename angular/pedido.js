starter.factory("servicio", function(){
				return {
					data: {
					},
				} ;
}).controller("pedidoController",  function($route,$scope, $http,servicio,$ngBootbox, $rootScope) {
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
			$scope.pedidosPorPacienteList ={},
			$scope.newPedidoId= "";
			$scope.currentPage=1,
			$scope.totalItems=1300,
			$scope.page=25,
			$scope.progreso=0;
			$scope.abiertosCount =0;
			$scope.paraEntregarCount =0;
			$scope.entregadosCount =0;
			$scope.invalidosCount =0;
			$scope.creadosCount =0;

			
	$scope.getPedidoPorPaciente = function(id_paciente){
		$http.get('/api/pedidosByPaciente/'+id_paciente)
		.success(function(data) {
			$scope.pedidosPorPacienteList = data; 
			console.log($scope.pedidosPorPacienteList)
		}).error(function(err) {
			console.log('Error: '+err);
		});
	}		

	$scope.$watch($scope.progreso);
	
	$scope.calcularProgreso = function(pedido){
		
		var cantTotalResultado = 0;
		var cantResultadosCargados =0;

		for(var i=0;i< pedido.analisisList.length; i++){
			if(pedido.analisisList[i].analisis.codigo == "0475" ){
					cantTotalResultado --;
				}
			for(var j=0; j< pedido.analisisList[i].resultado.length; j++){
			
				if(pedido.analisisList[i].resultado[j].valorHallado!=""){
					cantResultadosCargados ++;
				
					}
				cantTotalResultado ++;
				
				
			}
			
		}
		
		var array=[];
		var progreso = (cantResultadosCargados/cantTotalResultado)*100;
		array.push(Math.trunc(progreso));
		if(progreso!=100){
			array.push("progress-bar-striped progress-bar-danger");
		}
		else{
			array.push("progress-bar-striped progress-bar-success");
		} 
	
		
		return  array;

	}
	
	$scope.getCount = function(estado){
		$http.get('/api/pedidos/count?estado='+estado)
			.success(function(data) {
				if(estado == "Abierto"){
					$scope.abiertosCount= data;
					
				}
				if(estado == "Para Entregar"){
					$scope.paraEntregarCount= data;
					
				}
				if(estado == "Entregado"){
					$scope.entregadosCount= data;
					
				}
				if(estado == "Invalido"){
					$scope.invalidosCount= data;
					
				}
				if(estado == "Creado"){
					$scope.creadosCount= data;
					
				}
				
			})
			.error(function(err) {
				console.log('Error: '+err);
			});

	}
		
	$scope.calcularEdad = function(birthday, datePedido){
			if(birthday !=null){
				var hoy = new Date(datePedido);
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
		var logo = new Image; logo.src = 'reporte.jpg'; 
			doc.addImage(logo, 'JPEG', 0, 0,210,297); 
	}
	 
	 $scope.generatePDFExtraccion = function(pedido){
		 var doc = new jsPDF("p", "mm", "a4");
		 	var item = pedido.analisisList;
			doc.setFontSize(10);
			doc.setTextColor(45,46,47);
			doc.text(10,8,"Protocolo:"+pedido.protocolo)
			doc.text(10,13,"Paciente: "+ pedido.paciente.apellido+','+pedido.paciente.nombre)
			//doc.text(10,58,"Solicitado por: "+ "DR/A. "+ pedido.medico.nombre)
			doc.text(120,13,"Fecha de Recepción: "+ pedido.fechaModified)
			doc.text(10,18,"------------LISTADO DE ESTUDIOS---------------")
			var item=pedido.analisisList; var position=25;
			for(var i=0; i<item.length;i++){
				var texto= (i+1) + ". " + item[i].analisis.determinaciones;
				doc.text(10,position, texto);
				position=position+5;
				
			}
			doc.autoPrint(true);
			window.open(doc.output('bloburl'), '_blank');
		
	 }
	 $scope.generatePDF = function (pedido, descargar) {
		 
			//a4
			var doc = new jsPDF("p", "mm", "a4");
			//letter
			//var doc = new jsPDF("p", "mm", [216,279]);
			//oficio
			//var doc = new jsPDF("p", "mm", [220,340]);
			
			doc.setFont('helvetica'); 
			//$scope.insertImage(doc);
			doc.setTextColor(45,46,47);
			doc.setFontSize(10);
			

			var item = pedido.analisisList;
			doc.text(10,48,"Protocolo:"+pedido.protocolo)
			if(pedido.derivadorDescripcion != undefined && pedido.derivadorDescripcion != "" )
			{doc.text(120,48,"Derivador: "+ pedido.derivadorDescripcion)}
			doc.text(10,53,"Paciente: "+ pedido.paciente.apellido+','+pedido.paciente.nombre)
			doc.text(10,58,"Solicitado por: "+ "DR/A. "+ pedido.medico.nombre)
			doc.text(120,58,"Fecha de Recepción: "+ pedido.fechaModified)
			if(pedido.paciente.fechaNacimiento != undefined && pedido.paciente.fechaNacimiento != "" && pedido.paciente.fechaNacimiento != null){
				doc.text(120,53,"Edad: "+$scope.calcularEdad(pedido.paciente.fechaNacimiento,pedido.fecha)+" años")
			}
			
			//doc.setLineWidth(0.65);
			//doc.setDrawColor(107, 255, 212);
			//doc.line(10, 63, 202, 63);
			var position=70; var height = doc.internal.pageSize.height-28; var page = 1; var hallado=0; var ref=0;
			//console.log(doc.internal.pageSize.height)
			
			for(var i=0; i< item.length;i++){
			
				if (position >= height)
				{
				  doc.addPage();
				 // $scope.insertImage(doc);
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
					doc.text(100,position+22,"VALOR HALLADO: ");
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
					doc.text(135,position,item[i].resultado[0].valorHallado+"  "+item[i].analisis.unidad);
					
					if(item[i].repetido){
						doc.setFontType("bold");
						doc.text(135,position+5, '**REPETIDO**')
						doc.setFontType("normal");
						//position=position+5;
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
							if(item[i].analisis.codigo!="0711"){
								//console.log(item[i].analisis.codigo)
								//if(item[i].analisis.codigo!="0481" || (item[i].analisis.codigo=="0481"&&item[i].analisis.formula[y].nombre!="BILIRRUBINA:")){
									//if(item[i].analisis.resultado[y]==undefined){
							
									if(item[i].analisis.formula[y].subformula == null){
									if(item[i].analisis.codigo.includes("0136")||item[i].analisis.codigo=="0546"||item[i].analisis.codigo=="0015-MA"||item[i].analisis.codigo.includes("0767")){
										doc.text(100,position,item[i].resultado[y].formula);
										doc.text(137,position,item[i].resultado[y].valorHallado[x]);
										doc.text(145,position,item[i].analisis.formula[y].unidad);
										}
										else{
											if(item[i].analisis.codigo=="1050"){
												doc.text(100,position,item[i].resultado[y].formula);
												doc.text(155,position,item[i].resultado[y].valorHallado[x]);
											
											}else{
												doc.text(100,position,item[i].resultado[y].formula);
											doc.text(145,position,item[i].resultado[y].valorHallado[x]);
											doc.text(165,position,item[i].analisis.formula[y].unidad);
											}
											
										}
												
									position = position+5;
									hallado=position;										
									}
									else{
										
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
									
									
								}else{
									if((item[i].resultado[y].valorHallado[x]!=""&& item[i].analisis.codigo==="0711")){
										doc.text(100,position,item[i].resultado[y].formula);
										doc.text(145,position,item[i].resultado[y].valorHallado[x]);
										//doc.text(165,position,item[i].analisis.formula[y].unidad);
										position = position+5;
										hallado=position;
									}
									
								}
							
							
						}
					
						}
						
						
						if(item[i].repetido){
						doc.setFontType("bold");
						doc.text(150,position+5, '**REPETIDO**')
						doc.setFontType("normal");
						position=position+5;
						
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
						doc.text(80,position+5, '**REPETIDO**')
						doc.setFontType("normal");
						position=position+5;
						
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
						doc.text(45,position-5,item[i].resultado[z].formula+"   "+item[i].resultado[z].valorHallado[0] + "  "+item[i].analisis.unidad)
						//position = position+5;
						hallado=position;
					}
					
					
				}
				if(item[i].repetido){
						doc.setFontType("bold");
						doc.text(150,position-10, '**REPETIDO**')
						doc.setFontType("normal");
						position=position+5;
						
					}
				if(item[i].analisis.observacion != null){
					//console.log(item[i].analisis.observacion);
					doc.text(100,position+5, item[i].analisis.observacion);
					position = position+5;
				}else{
						//console.log("prueba que pasa por aca");
				}
						
				
					position=hallado;
				
			}
				
			} //fin else

					
				if(item[i].observacion != null && item[i].observacion != ""){
							
							doc.setFontSize(10);
							doc.setFontType("bold");
							doc.text(15,position+5, "OBSERVACIONES: ");
							doc.setFontType("normal");
							doc.text(50,position+5,item[i].observacion);
							//doc.text(15,position+8.5, item[i].observacion);
							position = position+9;
						}
							
							
				
				
				doc.setFontSize(7);
				doc.setTextColor(132,134,136);
				doc.text(185,283, 'Página ' + page);
				position = position+8.5;
				doc.setTextColor(45,46,47);
				doc.setFontSize(10);
			} //fin For
				
				
           doc.setFontSize(8);
			// CENTRADO
			//doc.text(85,270, 'AIMARÁ AYELEN ASPITIA');
			//doc.text(92,273, 'BIOQUÍMICA');
			//doc.text(94,276, 'M.P. 5819');
		
			
			/*doc.text(45,280, 'Dra. MONICA DE SOUTADET');
			doc.text(48,283, 'BIOQUÍMICA: M.P. 4946');
			doc.text(49,286, 'CITOLOGA: M.E. 556');*/
			
			
			doc.text(83,280, 'Dra. MARÍA JULIA QUINTEROS');
			doc.text(93,283, 'BIOQUÍMICA');
			doc.text(95,286, 'M.P. 5102');
			if(descargar){
				doc.save('protocolo-'+pedido.protocolo);
			}
			else {
				//doc.autoPrint(true);
				window.open(doc.output('bloburl'), '_blank');
			}
			
			
		}
	
		
		$scope.getVarsUrl =function (){
		var str = window.location.toString();
		var res = str.split("=");
		//console.log("url"+res[1])
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
	
	$scope.getPedidosAbiertos = function(){
		$http.get('/api/pedidos?estado=Abierto')
		.success(function(data) {
			$scope.pedidosAbiertosList = data; 
			//console.log(data)
		}).error(function(err) {
			console.log('Error: '+err);
		});
	}
		
		$scope.selectEstudioPaciente = function(estudio,apellidoPaciente,nombrePaciente){
			$scope.selectedEstudio=estudio;
			$scope.selectedPaciente=apellidoPaciente +", "+ nombrePaciente;
		}
		$scope.selectedEstudio="",
		$scope.selectedPaciente="",
		$scope.lastResults = {},
		
		$scope.getLastResults = function(paciente, analisis,protocolo){
			$http.get('/api/last-result/'+ paciente +'/analisis/'+ analisis+'/protocolo/'+protocolo)
			.success(function(data) {
				$scope.lastResults = data; 
				console.log("Last results "+$scope.lastResults)
			}).error(function(err) {
				console.log('Error: '+err);
			});
		}
		
		$scope.getPedidosCreados = function(){
		$http.get('/api/pedidos?estado=Creado')
		.success(function(data) {
			$scope.pedidosCreadosList = data; 
			//console.log(data)
		}).error(function(err) {
			console.log('Error: '+err);
		});
		}
		
		
		$scope.getPedidosEntregados = function(page){
			$http.get('/api/pedidos?estado=Entregado&page='+page)
		.success(function(data) {
			$scope.pedidosEntregadosList = data; 
		}).error(function(err) {
			console.log('Error: '+err);
		});
		}
		
		
		$scope.pedidosInvalidosList = {};
		$scope.getPedidosInvalidos = function(){
		$http.get('/api/pedidos?estado=Invalido')
		.success(function(data) {
			$scope.pedidosInvalidosList = data; 
		}).error(function(err) {
			console.log('Error: '+err);
		});
		}
		
		$scope.getPedidosParaEntregar = function(){
			$http.get('/api/pedidos?estado=Para Entregar')
			.success(function(data) {
				$scope.pedidosCompletosList = data; 
			}).error(function(err) {
				console.log('Error: '+err);
			});
		}
		
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
				$scope.pedido = data
			}).error(function(err) {
				console.log('Error: '+err);
			});
			}
			
			$scope.getPedidoAndDownload= function(id){
			$http.get('/api/pedidos/'+id)
			.success(function(data) {
				//$scope.pedido = data
				$scope.generatePDFExtraccion(data[0])
			}).error(function(err) {
				console.log('Error: '+err);
			});
			}
		

		   $scope.getPrestadores = function(){
			$http.get('/api/prestadores')
			.success(function(data) {
				$scope.prestadores =data
				//return data;
			}).error(function(err) {
				console.log('Error: '+err);
			});
		   }
			
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
		
		//para detener el submit cuando se hace enter
		$scope.keyPressOnForm = function(event) {
 
			if (event.keyCode === 13) {
				event.preventDefault();
			}
		}  
		
		$scope.confirmCambiarEstado = function(pedido,estado) {
			var mensaje = "";
			if(estado=="Invalido"){
				verb="invalide"
				mensaje='Una vez que '+ verb.toUpperCase() +' el pedido, no podrá actualizar sus resultados.'
			}
			if(estado=="Para Entregar"){
				var verb="completó"
				mensaje='Una vez que '+ verb.toUpperCase() +' el pedido, no podrá actualizar sus resultados.'
			}
			if(estado=="Abierto"){
				mensaje='Desea Reabrir el pedido?'

			}
		  $ngBootbox.confirm(mensaje)
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
		
		$scope.addItem= function(pedido, analisis){
			item = {formula:"<<ingrese nombre>>", valorHallado:[""]}
			analisis.resultado.push(item);
			
			/*$http.put('/api/addItem/pedido/'+pedido._id+'/analisis/'+analisis._id,{nombre:""}).success(function(data){
				
			}).error(function(err){
				console.log('ERROR')
			})*/
		}
		
		$scope.saveResult = function (pedido,id_analisis,orden,metodo,muestra,repetido,valorHallado) {
			
		pedido.analisisList[orden].resultados = valorHallado

		$http.put('/api/loadResults/pedido/'+pedido._id+'/analisis/'+id_analisis,{'metodo':metodo,'muestra':muestra,'repetido': repetido,'resultado':pedido.analisisList[orden].resultado})
		.success(function(data) {
			//$scope.calcularProgreso(pedido);
			//$route.reload();
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
	};
		
		
		$scope.agregarItemOrina = function (pedido,id_analisis,item) {
			
			item = {"nombre": item, "unidad":""};

		$http.put('/api/loadResults/pedido/'+pedido._id+'/analisis/'+id_analisis,{'metodo':metodo,'muestra':muestra,'repetido': repetido,'resultado':pedido.analisisList[orden].resultado})
		.success(function(data) {
			//$scope.calcularProgreso(pedido);
			//$route.reload();
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
	};
		
		
		$scope.saveObservaciones = function (pedido,id_analisis,observaciones) {
			
			$http.put('/api/saveObservaciones/pedido/'+pedido._id+'/analisis/'+id_analisis,{'observacion':observaciones})
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
			
			//$scope.createPedidoApi();
			
		$http.post('/api/pedidos', $scope.newPedido)
			.success(function(data) {
				
				servicio.data.newPedidoId= data._id;
				$scope.created=true;
				
				$scope.getPedidoAndDownload(servicio.data.newPedidoId);
				
				//Limpiamos
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

	
		
			
		$scope.agregarObservaciones =function(value){
			servicio.data.labo.observacion=value;
		}
		
		$scope.observaciones="";
		$scope.abrirObservaciones =function(lab){
			$scope.observaciones=lab.observacion;
			servicio.data.labo=lab;
		}
		
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
			$scope.objeto = {"analisis":analisis._id,"metodo":analisis.metodoDefault,"muestra":analisis.muestraDefault,"repetido":false,"observacion":"","resultado":$scope.resultado};
		$http.put('/api/pedidos/'+servicio.data.pedidoId+'/add-analisis',$scope.objeto)
		.success(function(data) {
		})
		.error(function(err) {
			console.log('Error: '+err);
		});
		$route.reload()
	}
		
	})
