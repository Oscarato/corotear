angular.module('app.routes', [])

//** Aqui van las rutas de la aplicacion */
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  //aqui se declara la ruta principal (Page) para la manipulacion con el menu bajo
  .state('tabsController', {
    url: '/Page',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  //ruta de login
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  //ruta de ¿que quieres hacer?
  .state('tabsController.QuQuieresHacer', {
    url: '/inicio',
    views: {
      'tab2': {
        templateUrl: 'templates/QuQuieresHacer.html',
        controller: 'QuQuieresHacerCtrl'
      }
    }
  })

  //ruta de buscar
  .state('tabsController.buscar', {
    url: '/buscar',
    views: {
      'tab2': {
        templateUrl: 'templates/buscar.html',
        controller: 'buscarCtrl'
      }
    }
  })

  //ruta de los productos con vista tinder
  .state('tabsController.productos', {
    url: '/productos',
    views: {
      'tab2': {
        templateUrl: 'templates/productos.html',
        controller: 'productosCtrl'
      }
    }
  })

  //ruta de los detalles del producto
  .state('tabsController.producto_detalle', {
    url: '/product_detail',
    views: {
      'tab2': {
        templateUrl: 'templates/producto_detalle.html',
        controller: 'producto_detalleCtrl'
      }
    }
  })

  //ruta para la seccion de publicar el articulo
  .state('tabsController.publish', {
    url: '/page10',
    views: {
      'tab2': {
        templateUrl: 'templates/publish.html',
        controller: 'publishCtrl'
      }
    }
  })

  //ruta para coroteando y corotie
  .state('tabsController.main', {
    url: '/page11',
    views: {
      'tab3': {
        templateUrl: 'templates/main.html',
        controller: 'mainCtrl'
      }
    }
  })

  //ruta para acceder a "mi perfil"
  .state('tabsController.profile', {
    url: '/page12',
    views: {
      'tab1': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  //ruta de prueba para acceso
  .state('tabsController.login_access', {
    url: '/access',
    views: {
      'tab2': {
        templateUrl: 'templates/login_access.html',
        controller: 'accessController'
      }
    }
  })

  //ruta para los detalles del producto desde corotie
  .state('tabsController.producto_detalleCtrl', {
    url:'/product_detail_corotie',
    views:{
      'tab3':{
        templateUrl: 'templates/product_detail_corotie.html',
        controller: 'producto_detalleCtrl'
      }
    }
  })
  
  //redireccion en caso de no hayar la ruta
  $urlRouterProvider.otherwise('/login');
  
});