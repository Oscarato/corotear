angular.module('app.controllers', [])
     
.controller('menuCtrl', function ($scope, $stateParams) {


})
   
.controller('loginCtrl', function ($scope, $location, $http, $timeout,UserService, $ionicActionSheet, $state, $ionicLoading, url_base, EzAlert, $cordovaOauth, $rootScope) {
  
  localStorage.login = true;

  //recargamos la pagina cuando cierran sesion
  if($rootScope.close_ses == true){
    console.log('mostrar')
    return location.reload();
  }

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

  /**
   * Login con Google
   */  
    hello.init({
        google: '1093647862720-23pht8koukq0bqvp1m4d4vs61hsalf3j.apps.googleusercontent.com'
    }, {redirect_uri: 'http://localhost/corotear_phone/www'});
    
    hello.on('auth.login', function(auth) {

        // Call user information, for the given network
        hello(auth.network).api('me').then(function(r) {
            // Inject it into the container
            alert(JSON.stringify(r))
        });
    });
        

    var accessToken;
    var UserData = null;

    $scope.login_goo =  function() {
        
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');

        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            localStorage.email = user;
        // ...
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });

    }
    
    var updateCounter = function() {
        $scope.counter++;
        $timeout(updateCounter, 1000);
        if(localStorage.email){
            return location.reload(); 
        }
    };
    updateCounter();

    //**
     /* Login con Google
     /* Funcionando para moviles
    */

    $scope.googleSignIn = function() {

        $ionicLoading.show({
            template: 'Ingresando...'
        });

        window.plugins.googleplus.login(
            {},
            function (user_data) {
                data = user_data;
                
                localStorage.accessToken = data.userId

                //traemos las categorias
                var settings = {
                    "crossDomain": true,
                    "url": url_base.api+"?op=Login",
                    "method": "POST",
                    "headers": {
                        "content-type": "text/xml",
                        "cache-control": "no-cache"
                    },
                    "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <Login xmlns=\"http://tempuri.org/\">\r\n      <Email>"+data.email+"</Email>\r\n   <photo>"+data.imageUrl+"</photo>\r\n      <Token>"+localStorage.accessToken+"</Token>\r\n    </Login>\r\n  </soap12:Body>\r\n</soap12:Envelope"
                }

                $ionicLoading.show({
                    template: 'Cargando...'
                });

                $http(settings).then(function(data_login){
                    
                    data_login_change = JSON.parse(data_login.data.split('<')[0]);
                    data_login_change = data_login_change[0];
                    
                    if(!data_login_change.id_city || data_login_change.id_city == 0 || data_login_change.id_city == ''){
                        localStorage.updateProfile = true;
                        localStorage.id = data_login_change.Id;
                        localStorage.email = data.email;
                        localStorage.picture = data.imageUrl;
                        $location.path('Page/page12');
                        return;
                    }

                    localStorage.updateProfile = false;
                    localStorage.gmailLogin = "true";
                    localStorage.facebookLogin = "false";
                    localStorage.email = data.email;
                    localStorage.picture = data.imageUrl;
                    localStorage.id = data_login_change.Id;
                    localStorage.name = data_login_change.Nombre
                    localStorage.lastname = data_login_change.Apellido
                    localStorage.id_city = data_login_change.id_city
                    localStorage.phone = data_login_change.Phone
                    localStorage.description = data_login_change.descripcion

                    $location.path('Page/inicio');

                    return $ionicLoading.hide();
                }, function(err){
                    $ionicLoading.hide();
                    alert(JSON.stringify( err));
                    EzAlert.error('Ocurrio un error en el logueo.');
                }); 

            },
            function (msg) {
                $ionicLoading.hide();
            }
        );

        $ionicLoading.hide();
    };

    //**
     /* Login con facebook
     /* Funcionando para moviles
    */
    $scope.facebookSignIn = function(){
        $ionicLoading.show({
            template: 'Ingresando...'
        });

        openFB.init({appId: '1269683693086737'});

        $ionicLoading.hide();
        openFB.login(function(data){

            localStorage.accessToken = data.authResponse.accessToken;
            //obetenemos los datos del usuario
            openFB.api({
                path: '/me',
                params: {fields: 'id,name,email'},
                success: function(data) {

                    //traemos las categorias
                    var settings = {
                        "crossDomain": true,
                        "url": url_base.api+"?op=Login",
                        "method": "POST",
                        "headers": {
                            "content-type": "text/xml",
                            "cache-control": "no-cache"
                        },
                        "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <Login xmlns=\"http://tempuri.org/\">\r\n      <Email>"+data.email+"</Email>\r\n   <photo>"+'http://graph.facebook.com/' + data.id + '/picture?type=large'+"</photo>\r\n      <Token>"+localStorage.accessToken+"</Token>\r\n    </Login>\r\n  </soap12:Body>\r\n</soap12:Envelope>"
                    }

                    $ionicLoading.show({
                        template: 'Cargando...'
                    });

                    $http(settings).then(function(data_login){
                        
                        data_login_change = JSON.parse(data_login.data.split('<')[0]);
                        data_login_change = data_login_change[0];
                        
                        if(!data_login_change.id_city || data_login_change.id_city == 0 || data_login_change.id_city == ''){
                            localStorage.updateProfile = true;
                            localStorage.id = data_login_change.Id;
                            localStorage.email = data.email;
                            localStorage.picture = 'http://graph.facebook.com/' + data.id + '/picture?type=large';
                            $location.path('Page/page12');
                            return;
                        }

                        localStorage.updateProfile = false;
                        localStorage.gmailLogin = "false";
                        localStorage.facebookLogin = "true";
                        localStorage.email = data.email;
                        localStorage.picture = 'http://graph.facebook.com/' + data.id + '/picture?type=large';
                        localStorage.id = data_login_change.Id;
                        localStorage.name = data_login_change.Nombre
                        localStorage.lastname = data_login_change.Apellido
                        localStorage.id_city = data_login_change.id_city
                        localStorage.phone = data_login_change.Phone
                        localStorage.description = data_login_change.descripcion

                        $location.path('Page/inicio');

                        return $ionicLoading.hide();
                    }, function(err){
                        $ionicLoading.hide();
                        alert(JSON.stringify( err));
                        EzAlert.error('Ocurrio un error en el logueo.');
                    });  
                },
                error: function(err){
                    alert(JSON.stringify(err))
                    return $ionicLoading.hide();
                }
            });

        }, {scope: 'email'});
    }

})
   
.controller('QuQuieresHacerCtrl', function ($scope, $stateParams, $location, $rootScope) {

    if(localStorage.updateProfile == true || localStorage.updateProfile == 'true'){
        $rootScope.tab = false;
        $location.path('Page/page12');
        return;
    }
    
    $scope.goInterChang = function(){
        $location.path('Page/page10');
        $scope.$apply()
    }

    $scope.goSearch = function(){
        $location.path('Page/buscar');
    }

})
   
.controller('buscarCtrl', function ($scope, $stateParams, $http, url_base, $rootScope, $location, $ionicLoading, EzAlert ) {

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

        for(cat in $scope.categories){
            $scope.select[cat] = false;
        }

        $ionicLoading.hide();
    }, function(err){
        console.log(err)
        $ionicLoading.hide();
    });   

    var categories_selected = []

    $scope.addCategory = function(value, index){

        var del = false;

        for(cat in categories_selected){
            if(value == categories_selected[cat]){
                 categories_selected.splice(cat,1);
                 $scope.select.splice(cat,1);
                 del = true;
            }
        }

        if(del == false){
            categories_selected.push(value)
            $scope.select[index] = true;
        }
        
    }

    $scope.select = [];
    $scope.show_all = true;
    
    //agregar todas las categorias
    $scope.all_categories = function(){
        
        for(cat in $scope.categories){
            console.log(cat)
            categories_selected.push(cat)
            $scope.select[cat] = true;
        }

        $scope.show_all = false;
    }

    //quitar todas las categorias
    $scope.less_categories = function(){
        
        for(cat in $scope.categories){
            console.log(cat)
            categories_selected = [];
            $scope.select[cat] = false;
        }

        $scope.show_all = true;
    }

    $scope.search = function(){
        
        if(categories_selected.length < 1){
            return EzAlert.error('Debes seleccionar al menos una categoria');
        }
        //traemos las categorias
        var settings = {
            "crossDomain": true,
            "url": url_base.api+"?op=GetProducts",
            "method": "POST",
            "headers": {
                "content-type": "text/xml",
                "cache-control": "no-cache"
            },
            "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <GetProducts xmlns=\"http://tempuri.org/\">\r\n      <Token>"+localStorage.accessToken+"</Token>\r\n      <Id_user>"+localStorage.id+"</Id_user>\r\n      <id_category>"+categories_selected.join(", ")+"</id_category>\r\n    </GetProducts>\r\n  </soap12:Body>\r\n</soap12:Envelope>"
        }

        $ionicLoading.show({
            template: 'Buscando...'
        });

        $http(settings).then(function(data){
            $scope.products = JSON.parse(data.data.split('<')[0]);
            $rootScope.products = {
                Response: true,
                Data: $scope.products
            }

            $ionicLoading.hide();
            $location.path('Page/productos');
        }, function(err){
            console.log(err)
            $ionicLoading.hide();
        });
        
    }

})
   
.controller('productosCtrl', function ($scope, $stateParams,$rootScope, $http, url_base, $ionicLoading) {
    var images;
    var Rating;

    $scope.selecImg = function(elem){
        
        $ionicLoading.show({
            template: 'Cargando...'
        });

        var req = {
            "crossDomain": true,
            "url": url_base.api+"?op=ProductDetail",
            "method": "POST",
            "headers": {
                "content-type": "text/xml",
                "cache-control": "no-cache"
            },
            "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <ProductDetail xmlns=\"http://tempuri.org/\">\r\n     <Token>"+localStorage.accessToken+"</Token>\r\n <id_product>"+elem.Id_product+"</id_product>\r\n    </ProductDetail>\r\n  </soap12:Body>\r\n</soap12:Envelope>"
        }

        $http(req).then(function(data){

            data = JSON.parse(data.data.split('<')[0]);
            console.log(data)
            $rootScope.details = {
                Response: true,
                Data: {
                        "name_owner": "usuario de prueba",
                        "id_user": "234",
                        "Images": elem.Images.split(' '),
                        "Name_product": elem.Name,
                        "Id_product":elem.Id_product,
                        "Detail": data[0].Detail,
                        "Category_name": "muebles",
                        "Rating": parseInt(data[0].Rating)
                    }
            };

            $ionicLoading.hide();
            window.location = "#/Page/product_detail";
            return;
        }, function(err){
            $ionicLoading.hide();
            console.log(err)
        });

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
            console.dir(e);
        }, {
            quality: 0,
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
        var str_xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n  <soap:Body>\r\n    <add_ult xmlns=\"http://tempuri.org/\">\r\n      ";
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

    $scope.onChanged = function(){
        $scope.give = !$scope.give;
        $scope.change = !$scope.give;
    };
    
    //** aqui empezamos a armar los datos */
    $scope.saveData = function(){

        if($scope.images_up.length < 1){
           // return EzAlert.error('Por favor adjunta alguna imagen del articulo.');
        }
        
        var data = {
            Id_user: localStorage.id,
            Images: $scope.images_up.join(" "),
            Name: document.getElementById('what').value,
            Detail: $('#detail').val(),
            id_category: $('#category').val(),
            Rating: parseInt(rating),
            give: ($scope.give == true || $scope.give == 'true' || $scope.give == 1) ? 1:0,
            change: this.give == 1 ? 0:1,
            Token: localStorage.token
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
            EzAlert.error('Algo sucedio y no se pudo cargar el articulo.'+JSON.stringify(err));
            $ionicLoading.hide();
        });
    }

    //traemos las categorias
    var settings = {
        "crossDomain": true,
        "url": url_base.api+"?op=GetCategoriesfull",
        "method": "POST",
        "headers": {
            "content-type": "text/xml",
            "cache-control": "no-cache"
        },
        "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n  <soap:Body>\r\n    <GetCategoriesfull xmlns=\"http://tempuri.org/\">\r\n      <Token>"+localStorage.accessToken+"</Token>\r\n    </GetCategoriesfull>\r\n  </soap:Body>\r\n</soap:Envelope>"
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
   
.controller('mainCtrl', function ($scope, $stateParams, $rootScope, $location, url_base, $ionicLoading, $http) {

    if(localStorage.updateProfile == true || localStorage.updateProfile == 'true'){
        $location.path('Page/page12');
        $rootScope.tab = false;
        return;
    }
    
    $ionicLoading.show({
        template: 'Cargando...'
    });

    //traemos los que se corotio o lo que se publico
    $scope.corotie_call = function(){
        
        $ionicLoading.show({
            template: 'Cargando...'
        });
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url_base.api+"?op=getCorotie",
            "method": "POST",
            "headers": {
                "content-type": "text/xml",
                "cache-control": "no-cache"
            },
            "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <getCorotie xmlns=\"http://tempuri.org/\">\r\n      <Id_user>"+localStorage.id+"</Id_user>\r\n      <Token>"+localStorage.accessToken+"</Token>\r\n    </getCorotie>\r\n  </soap12:Body>\r\n</soap12:Envelope>"
        }

        $http(settings).then(function(response){
            $rootScope.myProductos = JSON.parse(response.data.split('<')[0]);
            /*
            if($rootScope.myProductos.length > 0){
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
            */
            $ionicLoading.hide();
        }, function(err){
            console.log(err)
            $ionicLoading.hide();
        });


    }
    
    //traemos mis corotos, las cosas que se le dieron "me gusta"
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url_base.api+"?op=getCoroteo",
        "method": "POST",
        "headers": {
            "content-type": "text/xml",
            "cache-control": "no-cache"
        },
        "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <getCoroteo xmlns=\"http://tempuri.org/\">\r\n      <Id_user>"+localStorage.id+"</Id_user>\r\n      <Token>"+localStorage.accessToken+"</Token>\r\n    </getCoroteo>\r\n  </soap12:Body>\r\n</soap12:Envelope>"
    }

    $http(settings).then(function(response){
        $rootScope.myCorotos = JSON.parse(response.data.split('<')[0]);
        $ionicLoading.hide();
    }, function(err){
        console.log(err)
        $ionicLoading.hide();
    });

    //traemos de nuevo las cosas que le dimos me gusta
    $scope.coroteo_call = function(){

        $ionicLoading.show({
            template: 'Cargando...'
        });

        //traemos mis corotos, las cosas que se le dieron "me gusta"
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url_base.api+"?op=getCoroteo",
            "method": "POST",
            "headers": {
                "content-type": "text/xml",
                "cache-control": "no-cache"
            },
            "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <getCoroteo xmlns=\"http://tempuri.org/\">\r\n      <Id_user>"+localStorage.id+"</Id_user>\r\n      <Token>"+localStorage.accessToken+"</Token>\r\n    </getCoroteo>\r\n  </soap12:Body>\r\n</soap12:Envelope>"
        }

        $http(settings).then(function(response){
            $rootScope.myCorotos = JSON.parse(response.data.split('<')[0]);
            $ionicLoading.hide();
        }, function(err){
            console.log(err)
            $ionicLoading.hide();
        });
    }
    
    //para controlar el modal
    var show_modal = function(id_ele, button){

        // Get the modal
        var modal = document.getElementById(id_ele);

        // Get the <span> element that closes the modal
        var span = document.getElementById(button);

        modal.style.display = "block";

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

    //id del producto
    var id_producto = 0;

    //para mostrar el modal con los interesados del producto_detalleCtrl
    $scope.show_intere = function(id_ele, Id_product){

        $ionicLoading.show({
            template: 'Cargando...'
        });

        //traemos mis corotos, las cosas que se le dieron "me gusta"
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url_base.api+"?op=interesados",
            "method": "POST",
            "headers": {
                "content-type": "text/xml",
                "cache-control": "no-cache",
                "postman-token": "e03d065d-47dd-db52-c8e9-cfb94ecf180c"
        },
            "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <interesados xmlns=\"http://tempuri.org/\">\r\n      <Id_user>"+localStorage.id+"</Id_user>\r\n      <Idtra>"+Id_product+"</Idtra>\r\n      <Token>"+localStorage.accessToken+"</Token>\r\n    </interesados>\r\n  </soap12:Body>\r\n</soap12:Envelope>"
        }

        $http(settings).then(function(response){
            $scope.Interested = JSON.parse(response.data.split('<')[0]);
            id_producto = Id_product;
            show_modal(id_ele, 'close_other_interes')
            $ionicLoading.hide();
        }, function(err){
            console.log(err)
            $ionicLoading.hide();
        });
    }

    //para ver el detalle del interesado
    $scope.show_det_inter = function(id_ele, data){
        $scope.detail_inter = data;
        show_modal(id_ele, 'close_other');
    }

    //cerramos el modal
    $scope.close_modal= function(id_ele){
        var modal = document.getElementById(id_ele);
        modal.style.display = "none";
    }

    //declinar
    $scope.declinar = function(id_modal, Id_usuario){
        
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url_base.api+"?op=Actualizar",
            "method": "POST",
            "headers": {
                "content-type": "text/xml",
                "cache-control": "no-cache"
        },
        "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <Actualizar xmlns=\"http://tempuri.org/\">\r\n      <Token>"+localStorage.accessToken+"</Token>\r\n      <Id_interesado>"+Id_usuario+"</Id_interesado>\r\n      <Id_producto>"+id_producto+"</Id_producto>\r\n      <Decision>4</Decision>\r\n      <Id_pro_chan>0</Id_pro_chan>\r\n    </Actualizar>\r\n  </soap12:Body>\r\n</soap12:Envelope>"
        }

        $http(settings).then(function(response){
            location.reload();
            $ionicLoading.hide();
        }, function(err){
            console.log(err)
            $ionicLoading.hide();
        });
    }

    //aceptar
    $scope.aceptar = function(id_modal, Id_usuario){
        var settings = {
        "async": true,
        "crossDomain": true,
        "url": url_base.api+"?op=Actualizar",
        "method": "POST",
        "headers": {
            "content-type": "text/xml",
            "cache-control": "no-cache"
        },
        "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <Actualizar xmlns=\"http://tempuri.org/\">\r\n      <Token>"+localStorage.accessToken+"</Token>\r\n      <Id_interesado>"+Id_usuario+"</Id_interesado>\r\n      <Id_producto>"+id_producto+"</Id_producto>\r\n      <Decision>3</Decision>\r\n      <Id_pro_chan>0</Id_pro_chan>\r\n    </Actualizar>\r\n  </soap12:Body>\r\n</soap12:Envelope>"
        }

        $http(settings).then(function(response){
            websocket.send('{"id_user": "'+Id_usuario+'", "message": "Han aceptado tu solicitud!!!"}');
            location.reload();
            $ionicLoading.hide();
        }, function(err){
            console.log(err)
            $ionicLoading.hide();
        });
    }

    //para ir a los detalles del producto, esto es para los articulos que se le dio me gusta
    var images;
    var Rating;

    $scope.selecImg = function(elem){
        console.log(elem)

        $ionicLoading.show({
            template: 'Cargando...'
        });

        var req = {
            "crossDomain": true,
            "url": url_base.api+"?op=ProductDetail",
            "method": "POST",
            "headers": {
                "content-type": "text/xml",
                "cache-control": "no-cache"
            },
            "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <ProductDetail xmlns=\"http://tempuri.org/\">\r\n     <Token>"+localStorage.accessToken+"</Token>\r\n <id_product>"+elem.Id_product+"</id_product>\r\n    </ProductDetail>\r\n  </soap12:Body>\r\n</soap12:Envelope>"
        }

        $http(req).then(function(data){
            $rootScope.details = {
                Response: true,
                Data: {
                        "name_owner": "usuario de prueba",
                        "id_user": "234",
                        "Images": elem.images.split(' '),
                        "Name_product": elem.name,
                        "Id_product":elem.Id_product,
                        "Detail": "esta es una descripcion",
                        "Category_name": "muebles",
                        "Rating": elem.Rating
                    }
            };

            $ionicLoading.hide();
            window.location = "#/Page/product_detail_corotie";
            return;
        }, function(err){
            $ionicLoading.hide();
            console.log(err)
        });

    }


})
   
.controller('profileCtrl', function ($scope, $rootScope, $stateParams, $ionicLoading, $location, url_base, $http, EzAlert) {

    if(localStorage.updateProfile == true || localStorage.updateProfile == 'true'){
        EzAlert.error('Por favor actualiza primero tu perfil');
    }else{
        $rootScope.tab = true;
    }

    $scope.profile = {}
    
    $scope.data_profile = {
        email : localStorage.email,
        picture : localStorage.picture,
        name: localStorage.name,
        lastname: localStorage.lastname,
        phone: localStorage.phone,
        description: localStorage.description,
        city: localStorage.id_city
    }

    $ionicLoading.show({
        template: 'Cargando...'
    });

    //traemos las ciudades
    var settings = {
        "crossDomain": true,
        "url": url_base.api+"?op=GetCountries",
        "method": "POST",
        "headers": {
            "content-type": "text/xml",
            "cache-control": "no-cache"
        },
        "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <GetCountries xmlns=\"http://tempuri.org/\">\r\n      <Token>"+localStorage.accessToken+"</Token>\r\n    </GetCountries>\r\n  </soap12:Body>\r\n</soap12:Envelope>"
    }
    $http(settings).then(function(data){
        
        $ionicLoading.hide();
        $scope.cities = JSON.parse(data.data.split('<')[0]);
    }, function(err){
        console.log(err)
        $ionicLoading.hide();
    });

    //actualizamos los datos del usuario
    $scope.profile_update = function(profile) {
        
        $ionicLoading.show({
            template: 'Actualizando...'
        });

        if(!profile.name){
            EzAlert.error('Debes agreagar el nombre');
            $ionicLoading.hide();
            return;
        }
        if(!profile.lastname){
            EzAlert.error('Debes agreagar el apellido');
            $ionicLoading.hide();
            return;
        }
        if(!profile.phone){
            EzAlert.error('Debes agreagar un teléfono');
            $ionicLoading.hide();
            return;
        }
        if(!profile.description){
            EzAlert.error('Debes agreagar una descripción');
            $ionicLoading.hide();
            return;
        }
        if(!profile.city){
            EzAlert.error('Debes agreagar una ciudad');
            $ionicLoading.hide();
            return;
        }

        var data_send = {
            id: localStorage.id,
            name : profile.name,
            lastName : profile.lastname,
            phone : profile.phone,
            description : profile.description,
            city : profile.city,
        }

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url_base.api+"?op=updateProfile",
            "method": "POST",
            "headers": {
                "content-type": "text/xml",
                "cache-control": "no-cache"
            },
            "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <updateProfile xmlns=\"http://tempuri.org/\">\r\n      <id>"+localStorage.id+"</id>\r\n      <Nombre>"+data_send.name+"</Nombre>\r\n      <Apellido>"+data_send.lastName+"</Apellido>\r\n      <Phone>"+data_send.phone+"</Phone>\r\n      <id_city>"+data_send.city+"</id_city>\r\n       <descripcion>"+data_send.description+"</descripcion>\r\n      <Token>"+localStorage.accessToken+"</Token>\r\n    </updateProfile>\r\n  </soap12:Body>\r\n</soap12:Envelope>"
        }

        $http(settings).then(function(data_get){

            data = JSON.parse(data_get.data.split('<')[0]);
            if(data.Sucess){
                EzAlert.success('Se actualizaron los datos correctamente');
            }else{
                EzAlert.error('Sucedio un error al actualizar los datos');
            }

            localStorage.name = data_send.name
            localStorage.lastname = data_send.lastName
            localStorage.id_city = data_send.city
            localStorage.phone = data_send.phone
            localStorage.description = data_send.description
            localStorage.updateProfile = false;
            $rootScope.tab = true;
            $ionicLoading.hide();
        }, function(err){
            alert(JSON.stringify(err));
            $ionicLoading.hide();
        });
    }

    //cierra la session
    $scope.sesiClose = function(){
        $ionicLoading.show({
            template: 'Cerrando...'
        });
        $rootScope.close_ses = true;
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