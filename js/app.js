// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'cardsmodule', 'app.controllers', 'app.routes', 'ui.materialize', 'app.directives','services', 'ngCordovaOauth', 'ez.alert'])

.config(function($ionicConfigProvider, $sceDelegateProvider){
  

  $sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

})

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

        //esto inicializa el slider
        $(document).ready(function(){
            $('.slider').slider();
            $('.slider').height('200');
            

            //prueba de web socket
            var wsUri = "ws://echo.websocket.org/";
            var output;

            testWebSocket();

            function testWebSocket()
            {
              websocket = new WebSocket(wsUri);
              websocket.onopen = function(evt) { onOpen(evt) };
              websocket.onclose = function(evt) { onClose(evt) };
              websocket.onmessage = function(evt) { onMessage(evt) };
              websocket.onerror = function(evt) { onError(evt) };
            }

            function onError(evt)
            {
                console.log('ERROR: ' + evt.data);
            }

            function onOpen(evt)
            {
              console.log("CONNECTED");
              doSend("Bienvenido");
            }

            function doSend(message)
            {
                console.log("SENT: " + message);
                websocket.send(message);
            }

            function onClose(evt)
            {
                console.log("DISCONNECTED");
            }

            function onMessage(evt)
            {

                console.log('RESPONSE: ' + evt.data);
                var push = PushNotification.init({
                  android: {
                    senderID: "176611031"
                  },
                    browser: {
                        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
                    },
                  windows: {
                    alert: "true",
                    badge: "true",
                    sound: "true"
                  },
                  ios: {}
                });

              push.on('notification', function(data) {
                alert(JSON.stringify(data))
                // data.message,
                // data.title,
                // data.count,
                // data.sound,
                // data.image,
                // data.additionalData
              });
              
              //websocket.close();
            }
            
        });

        //online or offline validator
        function updateOnlineStatus(){
            var line = navigator.onLine ? 'online' : 'offline';
            if(line != 'online'){
                alert('No tienes conexion a internet');
                navigator.app.exitApp();
            }
        }
        window.addEventListener('offline',  updateOnlineStatus)
        updateOnlineStatus()

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

    });
})

/*
  This directive is used to disable the "drag to open" functionality of the Side-Menu
  when you are dragging a Slider component.
*/
.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
    return {
        restrict: "A",  
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            function stopDrag(){
              $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag(){
              $ionicSideMenuDelegate.canDragContent(true);
            }

            $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
            $element.on('touchstart', stopDrag);
            $element.on('touchend', allowDrag);
            $element.on('mousedown', stopDrag);
            $element.on('mouseup', allowDrag);

        }]
    };
}])

/*
  This directive is used to open regular and dynamic href links inside of inappbrowser.
*/
.directive('hrefInappbrowser', function() {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    link: function(scope, element, attrs) {
      var href = attrs['hrefInappbrowser'];

      attrs.$observe('hrefInappbrowser', function(val){
        href = val;
      });
      
      element.bind('click', function (event) {

        window.open(href, '_system', 'location=yes');

        event.preventDefault();
        event.stopPropagation();

      });
    }
  };
});

