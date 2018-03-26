var starter = angular.module("MainApp", ["ngRoute","ngBootbox","ui.bootstrap"])
.config(function($routeProvider){
     $routeProvider
			.when('/', {
				templateUrl	: 'pages/landing.html',
			}).when('/estadisticas', {
				templateUrl: 'pages/estadisticas.html',
				controller: 'estadisticasController',
			  }) 
			.when('/login', {
				templateUrl: 'pages/login.html',
				controller: 'loginController'
			  })
			  .when('/signup', {
				templateUrl: 'pages/signup.html',
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
            }).when("/obra-social-paciente", {
                controller: "pacienteController",
                templateUrl: "pages/paciente-obra-social.html"
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
			}).when("/pedidos-paciente",{
				controller: "pedidoController",
				templateUrl: "pages/pedidos-paciente.html"
			})
})
