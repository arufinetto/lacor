
starter.factory("servicio", function(){
	return {
		data: {
		},
	} ;
}).controller("pedidoController",  function($route,$scope, $http,servicio,$ngBootbox, $rootScope) {
//	var TeleSignSDK = require('telesignsdk');
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
$scope.page=25,
$scope.progreso=0;
$scope.abiertosCount =0;
$scope.paraEntregarCount =0;
$scope.entregadosCount =0;
$scope.invalidosCount =0;
$scope.creadosCount =0;
$scope.nombreAnimal = "";
$scope.newResultCounter19 = "";
//$scope.pedidoFinanza = {};
$scope.token= "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTQ5MjcyYWZlN2ZkMjYxNzk0MDcxNGIiLCJleHAiOjE2NjM3MjAxMDYsImlhdCI6MTYzMjE4NDEwNn0.oN9a97hM4MfwBTF6UpgCrVqlB_tWxECEqdJDq2zgcRw";


$scope.sendSMS = function(phoneNumber, protocol) {
$http.get('/api/send-sms/' + phoneNumber + '/protocol/'+ protocol)
.success(function(data) {
	$ngBootbox.alert(data)

}).error(function(err) {
	console.log('Error: '+JSON.stringify(err));
	$ngBootbox.alert(err)
});

};
$scope.smsSent = false
$scope.getSMSbyProtocol = function(protocol) {
$http.get('/api/sms/'+ protocol)
.success(function(data) {
console.log("respuesta " +data)
return data.length > 0
}).error(function(err) {
console.log("respuesta " +err)
});

};




//var x= "AAAI10P190000000maru10032220231009009000350007004839008053042413903380971032713441103850821503150505000000000000001000000100801022550261910182360000000000000000000000000000000000000000000000000000001002004007009010013015017020021023026029034042051056064073082095109122131143157171186193199204218230234240241249252255250246244237235233229223218213203196189176168160152141136129120115110106100100094092090086081079078074074075075076079079081082085088091094094097101105112111117122129131132135138142143146147152157161159161165167174175175171175177178177172173173174172168164158157155155153153150149146144140137135128129130126120120118116116113108110111107106108107102100101097097096090089088087082083080075073070068065062057054053051052048046044042041040040038038037036034035033027026026024024023022021020019018018016016014013014012010010010009010009009009009008007007006005005006005004003003004004004003003004004004003003003003003000000000000000000000000000000000000000000000000000000000000000000000000000001002003003004005006006005005004004003002002002002002001001001001001002002002002003004005006007009011015019023029036043052063075087100113128142156169182197209221230239246252255255255249246241236228219209198190179168155144134124116107100092087083078075072069067065065063062061060058056055052051049047045043042040039036036034033031030029027026024023022021019018017017016015013012011011010009009008008008007007006005005005005005004004004004004003003003003003003003002002002003003003003003003003003003003002002002002002002002002002002002002002002002002002002001001002002002001002001001001001001001001000001001001001001001001001001001001000000000000000000001001001001001001001001001000000000000000000000000000000000000000000000000000000000000000000000001002004006009013017022027033040046053061069077086095104114125135145155165173182189196202208213219223228232237239242244247248250251253254255255255254253252251250249247246243241237234229225220216211206203200197194190187183180176173170167164161159157153149146143139135131127124122119116113111108105102100097095093091088086082079076074071068065062060058056054052051050050049048047047047047047047046046046046045044043042040039037035034033032031030030029028027026025024023023023023022022022022021021020020019019018018017017017017016016015015014014014014013013013013012011010010010010009009009010010010010010010010010010010010010010010010009009009009008008007006006006005005005005004004004004004004004004004004004004004AAAI10P1900valentino10032320231111006400230005003636707655742613803400953032313540502560831542120494000000000000001000000100801102550261810182360000000000000000000000000000000000000000000000000000001004006009011015020024025028031035039038041046057064075084096108120138152175193209221233244252255251239245248251251250251246248233223214205192181173164153147139131125114105105105100093091087087085079074073071068066062059058057054057055053055058058060061060061062062064066065065067066067068067067068067067068070072072071070075079081082080080082086086084085088092096097097099097098094093093098103100106107109114118115116119121127129126127134135134134138143145148145149149149152149156156156156161164163165168168173174179178176176175171168165159157154151146141132126120112107101094093094089087085082077076074067067064064059060058051050046042039038033028029029028027025025023023020016016014012010011009011010010011013013012012012012012000000000000000000000000000000000000000000000000000000000000000000000000000001002003004004005005005005004004003003003003002002002002002002002002002003003003004005006007010011014018022028035043052061072083097112126141155171185200214224233238245251254255251246239232224213202192181172162154143132124116110103099092088084080075071068066064062060060058057055052051051050046044043040039038035033032030029027026024023022021020019018018016015014013013012011011011010009009009008007006006006005005004004004004004004003004004004004003003003003003003003003002002002002002002002002002002002002002002002002002002002002002002002002002002002002001001001001001001001001001001001001001001001001001001001001001001001001001001000000000000000000000000000000000000000001001001001001001001000000000000000000000000000000000000000000000000001001001002004007011016022029037045054062071079088096105114123132142151161169178186194201208213219223228233238241244247251253255255255254253250248245242238235232229226223220217214211208205203201198196194193191189187185182180177174170167164162159157154151147144139134128123117112108104100096094092090088086084083082080079078077076076076076075075075075073072070068066064061058056054052051049048046045043042041040038037036035035035034034034034033033032031030029028028027027027027027028028028028028027027027027027028027027027027026026025025024024023022021020019018017017016016016016015015015015014014013012012012011011011011010010009009009009008008008008008008008008008008007007007007006006006006006006006006006006006006006"
//$scope.newResultCounter19 = x.substring(0,2464)


$scope.getPedidoPorPaciente = function(id_paciente){
$http.get('/api/pedidosByPaciente/'+id_paciente,{headers:{"authorization":$scope.token}})
.success(function(data) {
$scope.pedidosPorPacienteList = data;
console.log($scope.pedidosPorPacienteList)
}).error(function(err) {
console.log('Error: '+err);
});
}

$scope.loadCounter19 = function(lab,identifier, date){
if (identifier.length < 10){
while(identifier.length < 10){
	identifier = "0" + identifier
}
}

$http.get('/api/result/counter19/patient/'+identifier + '?date=' + date.replace('/','').replace('/',''), {headers:{"authorization":$scope.token}})
.success(function(data) {
$scope.counter19Result = data

if (lab.analisis._id =="58f5638c68837d08020020c9"){
	console.log("ver...." + lab.analisis._id )
	lab.resultado[0].valorHallado[0] = parseInt($scope.counter19Result.result["PLT"])*1000

}else{
		for(var j=0; j< lab.resultado.length;j++){
			if (lab.resultado[j].formula== "G. Rojos:"){
				lab.resultado[j].valorHallado[0] = (parseInt($scope.counter19Result.result["RBC"])*10000).toString()
			}
			if 	(lab.resultado[j].formula== "Hemoglobina:"){
				lab.resultado[j].valorHallado[0] = (parseInt($scope.counter19Result.result["HGB"])/10).toString()
			}
			if 	(lab.resultado[j].formula== "Hematocrito:"){
				lab.resultado[j].valorHallado[0] = (parseInt($scope.counter19Result.result["HCT"])/10).toString()
			}
			if 	(lab.resultado[j].formula== "Vol.Corp.Med.:"){
				lab.resultado[j].valorHallado[0] = (parseInt($scope.counter19Result.result["MCV"])/10).toString()
			}
			if 	(lab.resultado[j].formula== "H.C.M:"){
				lab.resultado[j].valorHallado[0] = (parseInt($scope.counter19Result.result["MCH"])/10).toString()
			}
			if 	(lab.resultado[j].formula== "C.H.C.M:"){
				lab.resultado[j].valorHallado[0] = (parseInt($scope.counter19Result.result["MCHC"])/10).toString()
			}
			if 	(lab.resultado[j].formula== "RDW:"){
				lab.resultado[j].valorHallado[0] = (parseInt($scope.counter19Result.result["RDW-CV"])/10).toString()
			}
			if 	(lab.resultado[j].formula== "G.Blancos:"){
				lab.resultado[j].valorHallado[0] = (parseInt($scope.counter19Result.result["WBC"])*100).toString()
			}

			if 	(lab.resultado[j].formula== "Neut.Segmentados:"){
				lab.resultado[j].valorHallado[0] = (parseInt($scope.counter19Result.result["Gran%"])/10).toString()
			}
			if 	(lab.resultado[j].formula== "Linfocitos:"){
				lab.resultado[j].valorHallado[0] = parseInt($scope.counter19Result.result["Lymph%"]/10).toString()
			}
			if 	(lab.resultado[j].formula== "Eosinofilos:"){
				lab.resultado[j].valorHallado[0] = "0"
			}
			if 	(lab.resultado[j].formula== "Basofilos:"){
				lab.resultado[j].valorHallado[0] = "0"
			}
			if 	(lab.resultado[j].formula== "Neut. en Banda:"){
				lab.resultado[j].valorHallado[0] = "0"
			}
			if 	(lab.resultado[j].formula== "Monocitos:"){
				lab.resultado[j].valorHallado[0] = parseInt($scope.counter19Result.result["Mid%"]/10).toString()
			}
	

		}
	}

}).error(function(err) {
console.log('Error: '+err);
});
}


$scope.selectPedido = function(pedido){
$scope.pedidoFinanza = pedido;
console.log($scope.pedidoFinanza.paciente.apellido)
}

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
$http.get('/api/pedidos/count?estado='+estado,{headers:{"authorization":$scope.token}})
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

$scope.updateIdentifier = function(pedidoId, identifier){
$http.put('/api/pedidos/'+ pedidoId +'/update-identifier',{identificador:identifier},{headers:{"authorization":$scope.token}})
.success(function(data) {
	console.log('Data: '+data);
})
.error(function(err) {
	console.log('Error: '+err);
});

}


$scope.loadCM200 = function(pedidoId, identifier){
$http.post('/api/analisis/' + pedidoId + '/load-cm200',{identificador:identifier},{headers:{"authorization":$scope.token}})
.success(function(data) {
	console.log('Data: '+data);
	$ngBootbox.confirm("Resultado: " + data.message)

})
.error(function(err) {
	console.log('Error: '+err.message);

	$ngBootbox.confirm("Error al leer resultados del CM 200: " + err.message)
	
});

}

$scope.calcularEdad1 = function(birthday,datePedido){
var hoy = new Date(datePedido);
var cumpleanos = new Date(birthday);
var days= hoy.getTime()-cumpleanos.getTime();
var contdias = Math.round(days/(1000*60*60*24));
return contdias + " días";
}
$scope.calcularEdad = function(birthday,datePedido){
if(birthday !=null){
	var hoy = new Date(datePedido);
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

$scope.insertImage = function(doc){
//var logo = new Image; logo.src = 'reporte.jpg';
//doc.addImage(logo, 'JPEG', 0, 0,210,297);
var logo1 = new Image; logo1.src = 'animales.jpg';
doc.addImage(logo1, 'JPEG', 5,40,25,25);
}


$scope.generatePDFExtraccion = function(pedido){
var doc = new jsPDF("p", "mm", "a4");
doc.setFont("helvetica");
		  
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

if(pedido.paciente != null ){
	doc.text(120,58,"Fecha de Recepción: "+ pedido.fechaModified)
	doc.text(10,48,"Protocolo:"+pedido.protocolo)
if(pedido.derivadorDescripcion != undefined && pedido.derivadorDescripcion != "" )
{doc.text(120,48,"Derivador: "+ pedido.derivadorDescripcion)}
doc.text(10,53,"Paciente: "+ pedido.paciente.apellido+','+pedido.paciente.nombre)
doc.text(10,58,"Solicitado por: "+ "DR/A. "+ pedido.medico.nombre)

if(pedido.paciente.fechaNacimiento != undefined && pedido.paciente.fechaNacimiento != "" && pedido.paciente.fechaNacimiento != null){
	doc.text(120,53,"Edad: "+$scope.calcularEdad(pedido.paciente.fechaNacimiento,pedido.fecha))
}}else{
	//$scope.insertImage(doc);
	doc.text(100,53,"Protocolo:"+pedido.protocolo)
	doc.text(30,48,"Animal: "+ pedido.animal.tipo)
	doc.text(30,53,"Nombre: "+ pedido.animal.nombre)
	doc.text(30,58,"Raza: "+ pedido.animal.raza)
	doc.text(100,48,"Solicitado por Veterinario/a: " + pedido.medico.nombre)
	doc.text(100,58,"Fecha de Recepción: "+ pedido.fechaModified)

}


//doc.setLineWidth(0.65);
//doc.setDrawColor(107, 255, 212);
//doc.line(10, 63, 202, 63);
var position=70; var height = doc.internal.pageSize.height-28; var page = 1; var hallado=0; var ref=0;
//console.log(doc.internal.pageSize.height)

for(var i=0; i< item.length;i++){
if(item[i].imprimir){
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
		var rangoReferencia = null;
	if(pedido.paciente != null){
		 rangoReferencia =item[i].analisis.valorReferencia;
	}else{
		if(item[i].analisis.valorReferenciaAnimal[pedido.animal.tipo] == undefined){
			rangoReferencia = []
		}else{
			rangoReferencia =item[i].analisis.valorReferenciaAnimal[pedido.animal.tipo]
		}
	}
	if(rangoReferencia.length>0){
		doc.text(100,position+22,"VALOR HALLADO: ");
	}else{

		doc.text(15,position+22,"VALOR HALLADO: ");
		//doc.setFontSize(7.5);
		//doc.setTextColor(132,134,136);
		//doc.text(15,position+22,"RANGOS DE REFERENCIA: - ");
		position= position +22 //lo que ocupa lo comun de todos los estudios
	}
	doc.setFontType("normal");



if(rangoReferencia.length>0){

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
						if(item[i].analisis.codigo=="0481"||item[i].analisis.codigo=="0110"||item[i].analisis.codigo.includes("0136")||item[i].analisis.codigo=="0546"||item[i].analisis.codigo=="0015-MA"||item[i].analisis.codigo.includes("0767")){
							doc.text(100,position,item[i].resultado[y].formula);
							doc.text(141,position,item[i].resultado[y].valorHallado[x]);
							doc.text(150,position,item[i].analisis.formula[y].unidad);
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
							{	doc.text(100,position,item[i].resultado[y].formula);
								position = position+5;
								hallado=position;
								isWritten=true
							}
							//for(var a=x; a<item[i].analisis.formula[y].subformula.length;a++){
								doc.text(105,position,item[i].analisis.formula[y].subformula[x].nombre);
								doc.text(125,position,item[i].resultado[y].valorHallado[x]+"   "+item[i].analisis.formula[y].subformula[x].unidad);
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

		for(var k=0;k<rangoReferencia.length;k++){
			inicial=position;
			if (position >= height)
			{
				doc.addPage();
			//$scope.insertImage(doc);
				page = page +1;
				position=45;
				initial=40;
			}
			doc.text(15,position,rangoReferencia[k]);
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

					if(item[i].analisis.codigo == "2401"){
						doc.text(20,position+5,item[i].resultado[r].formula)
						doc.text(95,position+5,item[i].resultado[r].valorHallado[0])
						doc.text(105,position+5,item[i].analisis.formula[r].unidad)

						position = position+5;
					}else{
					doc.text(20,position+5,item[i].resultado[r].formula)
					doc.text(35,position+5,item[i].resultado[r].valorHallado[0]+"  "+item[i].analisis.formula[r].unidad)
					position = position+5;
				}
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
			if(c==0){doc.setFontType("bold"); doc.text(20,position,item[i].resultado[z].formula);
			doc.setFontType("normal");doc.text(20,position+5,item[i].resultado[z].valorHallado[f])
			c++; position = position+5;}
			else{doc.text(20,position,item[i].resultado[z].valorHallado[f]);}
			position = position+5;

				}
			}
			hallado=position;
			 c=0;
		}else{
			doc.text(45,position-5,item[i].resultado[z].formula+"   "+item[i].resultado[z].valorHallado[0] + "  "+item[i].analisis.unidad)
			position = position+5;
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
	}
} //fin For


doc.setFontSize(8);
// CENTRADO
//doc.text(85,270, 'AIMARÁ AYELEN ASPITIA');
//doc.text(92,273, 'BIOQUÍMICA');
//doc.text(94,276, 'M.P. 5819');


/*doc.text(45,280, 'Dra. MONICA DE SOUTADET');
doc.text(48,283, 'BIOQUÍMICA: M.P. 4946');
doc.text(49,286, 'CITOLOGA: M.E. 556');*/


doc.text(86,280, 'CARLOS B. AGUILAR');
doc.text(93,283, 'BIOQUÍMICO');
doc.text(95,286, 'M.P. 1773');
doc.text(13,295, 'Laboratorio autorizado por el Colegio de Bioquímicos de la provincia de Córdoba según la resolución N° 12818/2019. Válido hasta 20/02/2022.');

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
$http.put('/api/pedidos/'+id_pedido+'/remove-analisis', {analisis:id_analisis},{headers:{"authorization":$scope.token}})
.success(function(data) {
})
.error(function(err) {
	console.log('Error: '+err);
});
}

$scope.getPedidosAbiertos = function(page){
$http.get('/api/pedidos?estado=Abierto&page='+page,{headers:{"authorization":$scope.token}})
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
$http.get('/api/last-result/'+ paciente +'/analisis/'+ analisis+'/protocolo/'+protocolo,{headers:{"authorization":$scope.token}})
.success(function(data) {
	$scope.lastResults = data;
	console.log("Last results "+$scope.lastResults)
}).error(function(err) {
	console.log('Error: '+err);
});
}

$scope.getPedidosCreados = function(){
$http.get('/api/pedidos?estado=Creado',{headers:{"authorization":$scope.token}})
.success(function(data) {
$scope.pedidosCreadosList = data;
//console.log(data)
}).error(function(err) {
console.log('Error: '+err);
});
}


$scope.getPedidosEntregados = function(page){
$http.get('/api/pedidos?estado=Entregado&page='+page,{headers:{"authorization":$scope.token}})
.success(function(data) {
$scope.pedidosEntregadosList = data;
}).error(function(err) {
console.log('Error: '+err);
});
}


$scope.pedidosInvalidosList = {};
$scope.getPedidosInvalidos = function(){
$http.get('/api/pedidos?estado=Invalido',{headers:{"authorization":$scope.token}})
.success(function(data) {
$scope.pedidosInvalidosList = data;
}).error(function(err) {
console.log('Error: '+err);
});
}

$scope.getPedidosParaEntregar = function(){
$http.get('/api/pedidos?estado=Para Entregar',{headers:{"authorization":$scope.token}})
.success(function(data) {
	$scope.pedidosCompletosList = data;
}).error(function(err) {
	console.log('Error: '+err);
});
}

$scope.getPedidos = function(){
$scope.estado=["Entregado","Invalido"]
for(var i=0;i<2;i++){
$http.get('/api/pedidos?estado='+$scope.estado[i],{headers:{"authorization":$scope.token}})
.success(function(data) {
	$scope.pedidosList = data;
	console.log(data)
}).error(function(err) {
	console.log('Error: '+err);
});
}
}
$scope.pedidoId= {}
$scope.savePedidoId = function(id,analisis){
	$scope.pedidoId=id
	servicio.data.pedidoId=$scope.pedidoId
	$scope.analisisId=analisis
	servicio.data.analisisId=$scope.analisisId

}

$scope.getPedido = function(id){
$http.get('/api/pedidos/'+id,{headers:{"authorization":$scope.token}})
.success(function(data) {
	$scope.pedido = data
}).error(function(err) {
	console.log('Error: '+err);
});
}

$scope.getPedidoAndDownload= function(id){
$http.get('/api/pedidos/'+id,{headers:{"authorization":$scope.token}})
.success(function(data) {
	//$scope.pedido = data
	$scope.generatePDFExtraccion(data[0])
}).error(function(err) {
	console.log('Error: '+err);
});
}


$scope.getPrestadores = function(){
$http.get('/api/prestadores',{headers:{"authorization":$scope.token}})
.success(function(data) {
	$scope.prestadores =data
	//return data;
}).error(function(err) {
	console.log('Error: '+err);
});
}

$scope.createPrestador = function(){
	$http.post('/api/prestadores', $scope.prestador,{headers:{"authorization":$scope.token}})
	.success(function(data) {
		$scope.prestadores =data
		//return data;
	}).error(function(err) {
		console.log('Error: '+err);
	});
}

$scope.updateEstadoPedido = function(id, estado){
$http.put('/api/updateState/pedido/'+id,{estado:estado},{headers:{"authorization":$scope.token}})
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


$scope.addItem =function(pedido_id,analisis,item, valorHallado, indice){
$scope.valor=[]; $scope.valor.push(valorHallado)
$scope.newItem ={"formula":item, "valorHallado":$scope.valor};
$scope.indice = 0;
analisis.resultado.push($scope.newItem);

/*$http.put('/api/addItem/pedido/'+pedido_id+'/analisis/'+analisis_id,{nombre:item, valorHallado:$scope.valor}).success(function(data){

	$scope.indice=indice;
	$scope.pedido = data[0];


}).error(function(err){
	console.log('ERROR')
})*/
}

$scope.currentLab = {}
$scope.currentPosition = 0
//El analisis actual de la lista
$scope.saveCurrentResult = function(result){
$scope.currentLab = result
$scope.moreitems = false;

}
//El pedido actual
$scope.savePedido = function(pedido,position){
$scope.currentPedido = pedido
$scope.currentPosition = position
}

$scope.moreitems = false;
$scope.viewMoreItems = function(){
	$scope.moreitems=!$scope.moreitems;
}

$scope.add= function(lab,indexRes){
lab.resultado[indexRes].valorHallado.push("");
//$scope.saveResult(pedido,id_analisis,orden,metodo,muestra,valorHallado)
}

$scope.itemsOrina =["CEL.EPIT.PLANAS AGRUP:","LEUCOCITOS AGRUP.:","HEMATÍES:","ESTRIAS DE MUCUS:", "URATOS AMORFOS:", "FOSFATOS AMORFOS:","OXALATOS DE CALCIO:", "CRIST.DE ACIDO URICO:", "CILINDROS:"];

$scope.saveResult = function (pedido,id_analisis,orden,metodo,muestra,repetido,valorHallado,imprimir) {

//console.log("que recibe el save result " + lab + " muestra " + muestra)
pedido.analisisList[orden].resultados = valorHallado

$http.put('/api/loadResults/pedido/'+pedido._id+'/analisis/'+id_analisis,{'metodo':metodo,'muestra':muestra,'imprimir':imprimir,'repetido': repetido,'resultado':pedido.analisisList[orden].resultado},{headers:{"authorization":$scope.token}})
.success(function(data) {
	//$scope.calcularProgreso(pedido);
	//$route.reload();

})
.error(function(err) {
	console.log('Error: '+err);
});
};




$scope.saveObservaciones = function (pedido,id_analisis,observaciones) {

$http.put('/api/saveObservaciones/pedido/'+pedido._id+'/analisis/'+id_analisis,{'observacion':observaciones},{headers:{"authorization":$scope.token}})
.success(function(data) {
})
.error(function(err) {
	console.log('Error: '+err);
});
};

$scope.newPedido = {
medico: '',
fecha: new Date(),
paciente: null,
animal: null,
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
$http.put('/api/pedidos/'+pedido_id+'/remove-analisis', {analisis:analisis_id},{headers:{"authorization":$scope.token}})
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

$scope.newPedido.paciente = servicio.data.paciente == null ? null : servicio.data.paciente._id
$scope.newPedido.medico =servicio.data.medico == null ? null : servicio.data.medico._id
$scope.newPedido.animal = servicio.data.animal == null ? null : servicio.data.animal._id
if($scope.obra != null){
	$scope.newPedido.obrasocial = $scope.obra.obraSocial;
	$scope.newPedido.afiliado = $scope.obra.afiliado;

}

//$scope.createPedidoApi();

$http.post('/api/pedidos', $scope.newPedido,{headers:{"authorization":$scope.token}})
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
$scope.objeto = {"analisis":analisis._id,"metodo":analisis.metodoDefault,"muestra":analisis.muestraDefault,"repetido":false,"observacion":"","resultado":$scope.resultado, "imprimir":false};
$http.put('/api/pedidos/'+servicio.data.pedidoId+'/add-analisis',$scope.objeto,{headers:{"authorization":$scope.token}})
.success(function(data) {
})
.error(function(err) {
console.log('Error: '+err);
});
$route.reload()
}

$scope.includeAnalysis = function (pedido, analisis, include){
 $http.put('/api/pedido/'+ pedido +'/analisis/'+ analisis +'/include',{imprimir: include },{headers:{"authorization":$scope.token}})
	.success(function(data) {
	})
	.error(function(err) {
		console.log('Error: '+err);
	});
}
$scope.calcularSumaGlobulosBlancos = function (analisisList){
var sum = 0;
for(var i=9;i<15;i++){
	if(analisisList[i].valorHallado[0] == ""){
		analisisList[i].valorHallado[0] =0
	}

	sum = sum + parseInt(analisisList[i].valorHallado[0],10)

}

return sum;
}




})
