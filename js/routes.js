angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController', {
    url: '/Page',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('tabsController.QuQuieresHacer', {
    url: '/inicio',
    views: {
      'tab2': {
        templateUrl: 'templates/QuQuieresHacer.html',
        controller: 'QuQuieresHacerCtrl'
      }
    }
  })

  .state('tabsController.buscar', {
    url: '/buscar',
    views: {
      'tab2': {
        templateUrl: 'templates/buscar.html',
        controller: 'buscarCtrl'
      }
    }
  })

  .state('tabsController.productos', {
    url: '/productos',
    views: {
      'tab2': {
        templateUrl: 'templates/productos.html',
        controller: 'productosCtrl'
      }
    }
  })

  .state('tabsController.producto_detalle', {
    url: '/product_detail',
    views: {
      'tab2': {
        templateUrl: 'templates/producto_detalle.html',
        controller: 'producto_detalleCtrl'
      }
    }
  })

  .state('tabsController.publish', {
    url: '/page10',
    views: {
      'tab2': {
        templateUrl: 'templates/publish.html',
        controller: 'publishCtrl'
      }
    }
  })

  .state('tabsController.main', {
    url: '/page11',
    views: {
      'tab3': {
        templateUrl: 'templates/main.html',
        controller: 'mainCtrl'
      }
    }
  })

  .state('tabsController.profile', {
    url: '/page12',
    views: {
      'tab1': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('tabsController.login_access', {
    url: '/access',
    views: {
      'tab2': {
        templateUrl: 'templates/login_access.html',
        controller: 'accessController'
      }
    }
  })
  

$urlRouterProvider.otherwise('/Page/access')

  

});