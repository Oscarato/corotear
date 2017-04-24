angular.module('app.controllers', [])
     
.controller('menuCtrl', function ($scope, $stateParams) {


})
   
.controller('loginCtrl', function ($scope, $location,$http, $timeout,UserService, $ionicActionSheet, $state, $ionicLoading) {
  
  localStorage.login = true;

  if(localStorage.email){
    return $location.path('Page/inicio');
  }
  /**
   * 
   * Login with facebook
   */

  //llamado desde el boton de facebook
  $scope.login = function(){

    FB.login(function(response) {
      if (response.authResponse) {

        FB.api('/me?fields=email,name, picture', function(response) {
          
          console.log(JSON.stringify(response));
          
          localStorage.gmailLogin = "false";
          localStorage.facebookLogin = "true";
          localStorage.id = response.id;
          localStorage.email = response.email;
          localStorage.name = response.name;
          localStorage.picture = response.picture.data.url;
          
          FB.getLoginStatus(function(response2) {
            if (response2.status === 'connected') {
              
              localStorage.accessToken = response2.authResponse.accessToken;

            }
          });
          //$location.path('Page/inicio');
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {scope: 'email, public_profile'});
  } 

  //datos para el acceso
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1269683693086737',
      cookie     : true,  // enable cookies to allow the server to access 
                          // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.8' // use graph api version 2.8
    });
    
  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  /*
  $scope.login = function(){
    facebookConnectPlugin.login([
      "email",
      "picture",
      "name"
    ],
    onLoginSuccess,
    onLoginFail);
  } 

  function onLoginSuccess() {
  
    // console.log('LOGIN SUCCESS');
    var apiRoute = "me/?fields=email,name,picture.width(720).height(720)";
    facebookConnectPlugin.api(apiRoute, ["name"], onDataReceiveSuccess, onDataReceiveFail);
  }
  
  function onLoginFail(error) {
    // console.log('Login failed:', error);
  }

  function onDataReceiveSuccess(data){
    alert(data);
  }

  function onDataReceiveFail(data){
    alert(data);
  }
  */

  /**
   * Login con Google
   */  

  var googleapi = {
      authorize: function(options) {
          var deferred = $.Deferred();
          //Build the OAuth consent page URL
          var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
              client_id: options.client_id,
              redirect_uri: options.redirect_uri,
              response_type: 'code',
              scope: options.scope
          });

          //Open the OAuth consent page in the InAppBrowser
          var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

          //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
          //which sets the authorization code in the browser's title. However, we can't
          //access the title of the InAppBrowser.
          //
          //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
          //authorization code will get set in the url. We can access the url in the
          //loadstart and loadstop events. So if we bind the loadstart event, we can
          //find the authorization code and close the InAppBrowser after the user
          //has granted us access to their data.
          $(authWindow).on('loadstart', function(e) {
              var url = e.originalEvent.url;
              var code = /\?code=(.+)$/.exec(url);
              var error = /\?error=(.+)$/.exec(url);

              if (code || error) {
                  //Always close the browser when match is found
                  authWindow.close();
              }

              if (code) {
                  //Exchange the authorization code for an access token
                  $.post('https://accounts.google.com/o/oauth2/token', {
                      code: code[1],
                      client_id: options.client_id,
                      client_secret: options.client_secret,
                      redirect_uri: options.redirect_uri,
                      grant_type: 'authorization_code'
                  }).done(function(data) {
                      deferred.resolve(data);

                      $("#loginStatus").html('Name: ' + data.given_name);
                  }).fail(function(response) {
                      deferred.reject(response.responseJSON);
                  });
              } else if (error) {
                  //The user denied access to the app
                  deferred.reject({
                      error: error[1]
                  });
              }
          });

          return deferred.promise();
      }
  };
  var accessToken;
  var UserData = null;

  $scope.login_goo =  function() {
    
      //  alert('starting');
      googleapi.authorize({
          client_id: '1093647862720-23pht8koukq0bqvp1m4d4vs61hsalf3j.apps.googleusercontent.com',
          client_secret: 'cE84Z-hZIC0kdPOxrDZHmG_-',
          redirect_uri: 'http://localhost/corotear_phone/www',
          scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'
      })      

  }
  
  var updateCounter = function() {
      $scope.counter++;
      $timeout(updateCounter, 1000);
      if(localStorage.email){
        return location.reload(); 
      }
  };
  updateCounter();

    $scope.googleSignIn = function() {
        $ionicLoading.show({
            template: 'Ingresando...'
        });

        window.plugins.googleplus.login(
            {
                'webClientId': '1093647862720-up1mugptg2bq49h2pab5pj5s4dkmtj7c.apps.googleusercontent.com', // optional - clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                'offline': true
            },
            function (user_data) {

                localStorage.gmailLogin = "true";
                localStorage.facebookLogin = "false";
                localStorage.userId = user_data.userId;
                localStorage.email = user_data.email;
                localStorage.name = user_data.displayName;
                localStorage.picture = user_data.imageUrl;
                localStorage.accessToken = user_data.accessToken;

                
                alert(JSON.stringify(user_data)); 
                return $location.path('Page/inicio');
                $ionicLoading.hide();
            },
            function (msg) {
                alert(JSON.stringify(msg)); 
                $ionicLoading.hide();
            }
        );
    };

    $scope.facebookSignIn = function(){
        $ionicLoading.show({
            template: 'Ingresando...'
        });

        openFB.init({appId: '1269683693086737'});

        openFB.login(function(data){

            localStorage.accessToken = data.authResponse.accessToken;
            //obetenemos los datos del usuario
            openFB.api({
                path: '/me',
                params: {fields: 'id,name,email'},
                success: function(data) {
                    
                    localStorage.gmailLogin = "false";
                    localStorage.facebookLogin = "true";
                    localStorage.id = data.id;
                    localStorage.email = data.email;
                    localStorage.name = data.name;
                    localStorage.picture = 'http://graph.facebook.com/' + data.id + '/picture?type=large';

                    $location.path('Page/inicio');
                    return $ionicLoading.hide();

                },
                error: function(err){
                    alert(JSON.stringify(err))
                }
            });

        }, {scope: 'email'});
    }

})
   
.controller('QuQuieresHacerCtrl', function ($scope, $stateParams, $location) {

    $scope.goInterChang = function(){
        $location.path('Page/page10');
        $scope.$apply()
    }

    $scope.goSearch = function(){
        $location.path('Page/buscar');
    }

})
   
.controller('buscarCtrl', function ($scope, $stateParams, $http, url_base, $rootScope, $location, $ionicLoading) {

    var categories_selected = []

    $scope.addCategory = function(value){

        var del = false;

        for(cat in categories_selected){
            if(value == categories_selected[cat]){
                 categories_selected.splice(cat,1);
                 del = true;
            }
        }

        if(del == false){
            categories_selected.push(value)
        }
        
    }

    $scope.search = function(){

        var req = {
            method: 'POST',
            url: 'http://example.com',
            headers: {
                'Content-Type': 'json'
            },
                data: { token: localStorage.accessToken, categories: categories_selected }
            }

        $http(req).then(function(data){
            console.log(data)
        }, function(err){
            console.log(err)
        });

        $rootScope.products = {
            Response: true,
            Data: [{"id":1, "name":"silla usada", "image":  'img/categorias/prueba/Silla-de-ruedas-usada.jpg'}, {"id":2, "name":"gafas usadas","image": 'img/categorias/prueba/gafasusadas.jpg'}]
        }

        $location.path('Page/productos');
    }

    //traemos las categorias
    var settings = {
        "crossDomain": true,
        "url": url_base.api+"?op=GetCategories",
        "method": "POST",
        "headers": {
            "content-type": "text/xml",
            "cache-control": "no-cache"
        },
        "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n  <soap:Body>\r\n    <GetCategories xmlns=\"http://tempuri.org/\">\r\n      <Token>"+localStorage.accessToken+"</Token>\r\n    </GetCategories>\r\n  </soap:Body>\r\n</soap:Envelope>"
    }

    $ionicLoading.show({
        template: 'Cargando...'
    });

    $http(settings).then(function(data){
        $scope.categories = JSON.parse(data.data.split('<')[0]);
        $ionicLoading.hide();
    }, function(err){
        console.log(err)
        $ionicLoading.hide();
    });   

})
   
.controller('productosCtrl', function ($scope, $stateParams,$rootScope, $http, url_base) {
    var images;
    var Rating;

    $scope.selecImg = function(elem){

        var req = {
            method: 'POST',
            url: 'http://example.com',
            headers: {
                'Content-Type': 'json'
            },
                data: { token: localStorage.accessToken, id_product: elem.id }
            }

        $http(req).then(function(data){
            console.log(data)
        }, function(err){
            console.log(err)
        });

        //esto es de pruebas
        if(elem.id == 1){
            images = ['img/categorias/prueba/Silla-de-ruedas-usada.jpg', 'img/categorias/prueba/Silla-de-ruedas-usada2.jpg', 'img/categorias/prueba/Silla-de-ruedas-usada3.jpg'];
            Rating = 2;
        }else{
            images = ['img/categorias/prueba/gafasusadas.jpg', 'img/categorias/prueba/gafasusadas2.jpg', 'img/categorias/prueba/gafasusadas3.jpg'];
            Rating = 4;
        }

        $rootScope.details = {
            Response: true,
            Data: {
                    "name_owner": "usuario de prueba",
                    "id_user": "234",
                    "Images": images,
                    "Name_product": elem.name,
                    "Id_product":elem.id,
                    "Detail": "esta es una descripcion",
                    "Category_name": "muebles",
                    "Rating": Rating
                }
        };

        window.location = "#/Page/product_detail";
        return;
    }

})
   
.controller('producto_detalleCtrl', function ($scope, $stateParams,$rootScope, url_base) {
    
    console.log(url_base)
    console.log($rootScope.details)

})
   
.controller('publishCtrl', function ($scope, $ionicModal, EzAlert, $location, $rootScope, url_base, $http, $ionicLoading) {

    //variables
    var images;
    var rating = 1;

    //** esto es para las estrellas del ranking */
    $scope.rating = 0;
    $scope.ratings = [{
        current: 1,
        max: 5
    }];

    if(!localStorage.images){
        images = {'images':[]};
        localStorage.images = JSON.stringify(images);
    }
    
    //aqui guardamos temporalmente nuestros datos
    if(!$rootScope.myProductos){
        $rootScope.myProductos = []
    }

    $scope.catchRating = function(r){
        rating = r.current;
    }

    $scope.getSelectedRating = function (rat) {
        return false;
    }
    
    $scope.setMinrate= function(){
        $scope.ratings = [{
            current: 1,
            max: 5
        }];
    }
    
    $scope.setMaxrate= function(){
      $scope.ratings = [{
        current: 5,
        max: 5
      }];
    }
    //**** end ranking */

    //* probando imagenes */
    $scope.images_up = []

    document.addEventListener("deviceready", init, false);

    function init() {
        $("#addPicture").on("touchend", selPic);
        $imagesDiv = $("#images");
    }

    function selPic() {
        navigator.camera.getPicture(function(f) {
            $scope.images_up.push("data:image/jpeg;base64," + f);
            $scope.$apply();
        }, function(e) {
            alert("Error, check console.");
            console.dir(e);
        }, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });
        
    }
    
    //capturamos las imagenes
    $scope.getImages = function(){
        
        window.imagePicker.getPictures(
            function(results) {
                for (var i = 0; i < results.length; i++) {
                    $scope.images_up.push(results[i]);
                }
            }, function (error) {
                console.log('Error: ' + error);
            }
        );
    }

    //funcion de prueba para convertir json a xml
    function to_xml(json_data){
        var str_xml = "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n  <soap:Body>\r\n    <add_ult xmlns=\"http://tempuri.org/\">\r\n    \t";
        var x2js = new X2JS();
        var jsonObj = json_data;
        var xmlAsStr = x2js.json2xml_str( jsonObj );
        str_xml = str_xml + xmlAsStr + "\r\n    </add_ult>\r\n  </soap:Body>\r\n</soap:Envelope>";
        return {create:str_xml, origin:xmlAsStr};
    }

    //funcrion que convierte xml en json
    function to_json(xml){
        console.log(xml)
        var x2js = new X2JS();
        var xmlText = xml;
        var jsonObj = x2js.xml_str2json( xmlText );
        return {create:jsonObj, origin:jsonObj};
    }

    //** aqui empezamos a armar los datos */
    $scope.saveData = function(){
        
        if($scope.images_up.length < 1){
            //return EzAlert.error('Por favor adjunta alguna imagen del articulo.');
        }
        
        var data = {
            Id_user: 1,
            Images: $scope.images_up[0],
            Name: document.getElementById('what').value,
            Detail: $('#detail').val(),
            category: $('#category').val(),
            Rating: rating,
            give: $scope.give,
            change: !$scope.give,
            category_change: $('#category').val()
        }

        $ionicLoading.show({
            template: 'Enviando...'
        });
        
        var data_rec = to_xml(data);
        data_rec = data_rec.create;

        //traemos las categorias
        var settings = {
            "crossDomain": true,
            "url": url_base.api+"?op=add_ult",
            "method": "POST",
            "headers": {
                "content-type": "text/xml",
                "cache-control": "no-cache"
            },
            "data": data_rec
        }

        $http(settings).then(function(response){
            $rootScope.myProductos.push(data);
            EzAlert.success('Articulo cargado correctamente.');
            $ionicLoading.hide();
            $scope.cancel('Page/page11');
        }, function(err){
            console.log(data)
            $rootScope.myProductos.push(data);
            EzAlert.error('Algo sucedio y no se pudo cargar el articulo.');
            $ionicLoading.hide();
            $scope.cancel('Page/page11');
        });
    }

    //traemos las categorias
    var settings = {
        "crossDomain": true,
        "url": url_base.api+"?op=GetCategories",
        "method": "POST",
        "headers": {
            "content-type": "text/xml",
            "cache-control": "no-cache"
        },
        "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n  <soap:Body>\r\n    <GetCategories xmlns=\"http://tempuri.org/\">\r\n      <Token>"+localStorage.accessToken+"</Token>\r\n    </GetCategories>\r\n  </soap:Body>\r\n</soap:Envelope>"
    }

    $ionicLoading.show({
        template: 'Cargando...'
    });

    $http(settings).then(function(data){
        console.log(data)
        $ionicLoading.hide();
        $scope.categories = JSON.parse(data.data.split('<')[0]);
    }, function(err){
        console.log(err)
        $ionicLoading.hide();
    });    

    $scope.give = true;
    
    //permite borrar el almacenamiento del storage y regresar al '¿que quieres hacer?'
    $scope.cancel = function(ruta){
        $scope.images_up = [];
        document.getElementById('what').value = '';
        document.getElementById('detail').value = '';
        document.getElementById('category').value = '';
        localStorage.removeItem('images');
        $scope.ratings = [{
            current: 1,
            max: 5
        }];
        if(ruta){
            $location.path(ruta);
        }else{
            $location.path('Page/inicio');
        }
        
        return;
    }
})
   
.controller('mainCtrl', function ($scope, $stateParams, $rootScope) {

    console.log($rootScope.myCorotos)

    if($rootScope.myProductos){
        $rootScope.myProductos[0].interesed = [
            {
                name:"Jenny Doe",
                picture:"http://desdeguate.com/wp-content/uploads/2011/02/cristy-mexico-2.jpg",
                description:"Me interesan las antiguedades",
                id:1
            },
            {
                name:"Luisa Doe",
                picture:"http://www.fotos-top.com/items/perfil-de-mujeres-22364.jpg",
                description:"Tengo una fundación para niños de estrato 0 y 1",
                id:2
            }
        ]
    }

    console.log($rootScope.myProductos)

    //para controlar el modal
    $scope.show_modal = function(id_ele, data){

        // Get the modal
        var modal = document.getElementById(id_ele);

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close_other")[0];

        modal.style.display = "block";

        //datos
        $scope.interesed = data;

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    $scope.close_modal= function(id_ele){
        var modal = document.getElementById(id_ele);
        modal.style.display = "none";
    }

    //para ir a los detalles
    var images;
    var Rating;

    $scope.selecImg = function(elem){

        var req = {
            method: 'POST',
            url: 'http://example.com',
            headers: {
                'Content-Type': 'json'
            },
                data: { token: localStorage.accessToken, id_product: elem.id }
            }

        $http(req).then(function(data){
            console.log(data)
        }, function(err){
            console.log(err)
        });

        //esto es de pruebas
        if(elem.id == 1){
            images = ['img/categorias/prueba/Silla-de-ruedas-usada.jpg', 'img/categorias/prueba/Silla-de-ruedas-usada2.jpg', 'img/categorias/prueba/Silla-de-ruedas-usada3.jpg'];
            Rating = 2;
        }else{
            images = ['img/categorias/prueba/gafasusadas.jpg', 'img/categorias/prueba/gafasusadas2.jpg', 'img/categorias/prueba/gafasusadas3.jpg'];
            Rating = 4;
        }

        $rootScope.details = {
            Response: true,
            Data: {
                    "name_owner": "usuario de prueba",
                    "id_user": "234",
                    "Images": images,
                    "Name_product": elem.name,
                    "Detail": "esta es una descripcion",
                    "Category_name": "muebles",
                    "Rating": Rating
                }
        };

        window.location = "#/Page/product_detail";
        return;
    }


})
   
.controller('profileCtrl', function ($scope, $stateParams, $ionicLoading, $location) {

  $scope.data_profile = {
    email : localStorage.email,
    picture : localStorage.picture
  }
  
  console.log(localStorage)

  //example ajax soap

        $scope.soap = function() {
            


                var xml = '' + 
                    '<?xml version="1.0" encoding="utf-8"?>'+
                    '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'+
                    '<soap:Body>'+
                        '<InsertarCliente xmlns="http://tempuri.org/">'+
                        '<Nombre>Oscar</Nombre>'+
                        '<Apellido>Jimenez</Apellido>'+
                        '<Email>oscarato1993@gmail.com</Email>'+
                        '<Token>123456</Token>'+
                        '</InsertarCliente>'+
                    '</soap:Body>'+
                '</soap:Envelope>';

                var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://corotear.azurewebsites.net/Corotear.asmx?op=InsertarCliente",
                "method": "POST",
                "headers": {
                    "Content-Type": "text/xml; charset=utf-8",
                    "SOAPAction": "http://tempuri.org/InsertarCliente"
                },
                "data": xml
                }

                $.ajax(settings).done(function (response) {
                    console.log(response);
                });

        }

    //cierra la session
    $scope.sesiClose = function(){
        $ionicLoading.show({
            template: 'Cerrando...'
        });
        localStorage.clear();
        $location.path('login');
        $ionicLoading.hide();
        return;
    }

})
 

 .controller('accessController', function($scope, $stateParams, $timeout, $location){

    localStorage.removeItem('login');

    if(!localStorage.login){
        return $location.path('login');
    }

    if(localStorage.email){
        $location.path('Page/inicio');
        return 
    }

    //redireccionamos a la pagina principal
    var updateCounter = function() {
        $scope.counter++;
        $timeout(updateCounter, 1000);
        if(localStorage.email){   
            return location.reload(); 
        }
    };
    updateCounter();

    //aqui revisamos si en los parametros hay datos de acceso con google
    //var code = $location.absUrl().split('&')[0].split('code=')[1];
    //si encontramos el codigo de acceso 
    /*
    if(code){
        
        var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://www.googleapis.com/oauth2/v4/token",
        "method": "POST",
        "headers": {
            "grant_type": "authorization_code",
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache",
            "postman-token": "cafc0b6d-546f-f41c-b182-4f3768d5704c"
        },
        "data": {
            "code": code,
            "client_id": "1093647862720-23pht8koukq0bqvp1m4d4vs61hsalf3j.apps.googleusercontent.com",
            "client_secret": "cE84Z-hZIC0kdPOxrDZHmG_-",
            "redirect_uri": "http://localhost/corotear_phone/www",
            "grant_type": "authorization_code"
        }
        }

        $.ajax(settings).done(function (data) {
        accessToken = data.access_token;
        var term = null;
        //  alert("getting user data="+accessToken);
        $.ajax({
            url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + accessToken,
            type: 'GET',
            data: term,
            dataType: 'json',
            error: function(jqXHR, text_status, strError) {console.log(jqXHR, text_status, strError)},
            success: function(data) {
                var item;
                
                // Save the userprofile data in your localStorage.
                localStorage.gmailLogin = "true";
                localStorage.facebookLogin = "false";
                localStorage.id = data.id;
                localStorage.email = data.email;
                localStorage.name = data.given_name+' '+data.family_name;
                localStorage.picture = data.picture;
                window.close();
            }
        });
        });
    }
    */

 })