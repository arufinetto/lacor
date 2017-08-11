	$scope.generatePDF = function (pedido) {
		 var doc = new jsPDF("p", "mm", "a4");
			doc.setFont('helvetica'); 
			$scope.insertImage(doc);
			doc.setTextColor(45,46,47);
			var item = pedido.analisisList;
			doc.setFontSize(10);
			doc.text(10,48,"Protocolo:"+pedido.protocolo)
			doc.text(10,53,"Paciente: "+pedido.paciente.apellido+','+pedido.paciente.nombre)
			doc.text(10,58,"Solicitado por: "+ "DR/A. "+pedido.medico.nombre)
			doc.text(138,53,"Fecha de Recepción: "+pedido.fecha)
			doc.text(138,58,"Edad: ")
			doc.setLineWidth(0.65);
			doc.setDrawColor(48, 213, 200);
			doc.line(10, 63, 205, 63);
			//doc.text(140,40,"Edad: "+$scope.calcularEdad(pedido.paciente.fechaNacimiento)+" años")

	
			var position = 73; var page = 1; var index=0;var until=0; var currentPosition =0; var ref=0;var hallado=0;
			height = doc.internal.pageSize.height-23
			for(var i=0; i< item.length;i++){
				
				if (position >= height)
				{
				  doc.addPage();
				  $scope.insertImage(doc);
				  position = 50 // Restart height position
				  page = page +1;
					index = 0;
					
				}
				doc.setFontSize(11);
				doc.text(15,position, "DETERMINACIÓN O DOSAJE: " + item[i].analisis.determinaciones);
				doc.setFontSize(10);
				//doc.setLineWidth(0.30);
				//doc.setDrawColor(66,67,68);
				//console.log(item[i].analisis.determinaciones.length)
				//doc.line(15, position+1, 200, position+1);
				if (position+8 >= height)
				{
				  doc.addPage();
				  $scope.insertImage(doc);
				  position = 50 // Restart height position
				  page = page +1;
					index = 0;
				}
				doc.text(15,position+8,	"Método: "+ item[i].metodo);
				if (position+13 >= height)
				{
				  doc.addPage();
				  $scope.insertImage(doc);
				  position = 50 // Restart height position
				  page = page +1;
					index = 0;
				}
				doc.text(15,position+13,"Muestra: "+item[i].muestra);
				//doc.setLineWidth(1.5);
				//doc.line(20, 60, 60, 20); // horizontal line
				if (position+22 >= height)
				{
				  doc.addPage();
				  $scope.insertImage(doc);
				  position = 50 // Restart height position
				  page = page +1;
					index = 0;
	
				}
				if(item[i].analisis.valorReferencia.length>0){
				doc.setFontType("bold");
				doc.text(115,position+22,"VALOR HALLADO:");
			//	doc.line(10,16,16,16);
				doc.setFontType("normal");
				//lo que ocupa hasta el encabezado
				currentPosition = position +22;
				if(item[i].analisis.formula.length == 0){
					doc.text(151,position+22,item[i].resultado[0].valorHallado+" "+item[i].analisis.unidad);
					
					index=currentPosition+2.5;
					
					doc.setFontSize(9);
					doc.setTextColor(132,134,136);
					doc.text(15,position+22,"RANGOS DE REFERENCIA: ");
					for(var k=0;k<item[i].analisis.valorReferencia.length;k++){

						index = index+3.5;
						if (index >= height)
						{
							doc.addPage();
							$scope.insertImage(doc);
							position = 50 // Restart height position
							//doc.setLineWidth(0.1);
							//doc.line(15, position, 200, position);
							page = page +1;
							currentPosition=45
							index = currentPosition;
							
						}
						doc.text(15,index,item[i].analisis.valorReferencia[k]);
						ref=index;
					}
					currentPosition=currentPosition+ref;
					doc.setTextColor(45,46,47);
				doc.setFontSize(10.5);

				}

				else{
					index=currentPosition+2.5;
					var reset=index;
					doc.setTextColor(132,134,136);
					doc.setFontSize(9);
					doc.text(15,position+22,"RANGOS DE REFERENCIA: ");
						for(var k=0;k<item[i].analisis.valorReferencia.length;k++){
							
							index = index+4;
							if (index >= height)
							{
								doc.addPage();
								$scope.insertImage(doc);
								position = 50 // Restart height position
								//doc.setLineWidth(0.1);
								//doc.line(15, position, 200, position);
								page = page +1;
								currentPosition=45
								index = currentPosition;
							}
							doc.text(15,index,item[i].analisis.valorReferencia[k]);
							ref=index;
						}
						doc.setTextColor(45,46,47);
					doc.setFontSize(10);
					index=reset;
					for(var j=0;j<item[i].resultado.length;j++){
						index = index+2.5;
						if (index >= height)
						{
							doc.addPage();
							$scope.insertImage(doc);
							position = 50 // Restart height position
							page = page +1;
							currentPosition=45
							index = currentPosition;
							
						}
	
						doc.setFontSize(10);
						var x=0;
						do{
							
							if (index >= height)
							{
								doc.addPage();
								$scope.insertImage(doc);
								position = 50 // Restart height position
								page = page +1;
								currentPosition=45
								index = currentPosition;
							
							}
							
							if(x==0){
								doc.text(115,index,item[i].resultado[j].formula+" "+item[i].resultado[j].valorHallado[x]+" "+item[i].analisis.formula[j].unidad);
							}else{
								doc.text(138.5,index,item[i].resultado[j].valorHallado[x]+" "+item[i].analisis.formula[j].unidad);
							}
							
							index = index+3.5;
							x++;
						}while(x<item[i].resultado[j].valorHallado.length)
						
						hallado=index;
						
						}
						if(hallado > ref) {currentPosition=hallado;}
						else{currentPosition=ref;}
						hallado=0,ref=0;

					
					}
					
					
					
				}else{
					doc.setTextColor(132,134,136);
					doc.setFontSize(9);
					doc.text(15,position+22,"RANGOS DE REFERENCIA:-");
					doc.setFontSize(10);
					doc.setFontType("bold");
					doc.text(65,position+22,"VALOR HALLADO:");
					//	doc.line(10,16,16,16);
					doc.setFontType("normal");
					//lo que ocupa hasta el encabezado
					currentPosition = position +22;
					index=currentPosition+2.5;
					
					for(var j=0;j<item[i].resultado.length;j++){
						index = index+2.5;
						if (index >= height)
						{
							doc.addPage();
							$scope.insertImage(doc);
							position = 50 // Restart height position
							page = page +1;
							if(hallado>ref){currentPosition=hallado}
							else{currentPosition=hallado}
							index = currentPosition;
							
						}
						
						doc.setFontSize(10);
						var x=0;
						do{
							
							if (index >= height)
							{
								doc.addPage();
								$scope.insertImage(doc);
								position = 50 // Restart height position
								page = page +1;
								currentPosition=45
								index = currentPosition;
							
							}
							
							if(x==0){
								doc.text(65,index,item[i].resultado[j].formula+" "+item[i].resultado[j].valorHallado[x]+" "+item[i].analisis.formula[j].unidad);
							}else{
								doc.text(90,index,item[i].resultado[j].valorHallado[x]+" "+item[i].analisis.formula[j].unidad);
							}
							
							index = index+3.5;
							x++;
						}while(x<item[i].resultado[j].valorHallado.length)
						
						hallado=index;
						
						
						}
						currentPosition=hallado;
						hallado=0;
					
				}
				
				doc.setFontSize(8);
				doc.setTextColor(132,134,136);
				doc.text(185,273, 'Página ' + page);
				position = currentPosition+13;
				doc.setTextColor(45,46,47);
				doc.setFontSize(10);
			} //fin For
				
				
            doc.setFontSize(9);
			doc.text(65,273, 'Bioquímica: Ethel Pedernera M.P: 4659');
			window.open(doc.output('datauristring'));
			
		}