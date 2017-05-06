var module = angular.module('cardsmodule', []);

module.directive("items",
    function() {
        return {
            restrict: "E",
            scope: !0,
            templateUrl: "templates/items.html",
            link: function(elem) {

                var pixel_threshold = 20;

                //prevent default
                $("#slidermain").bind("touchmove", function(event) {
                    event.preventDefault();
                });

                $("#slidermain").on("touchstart mousedown", function(event1) {
                    
                    event1.preventDefault
                    elem.$apply(function() {
                        elem.touchStart = event1.originalEvent.touches ? event1.originalEvent.touches[0].pageX : event1.originalEvent.pageX
                    });
                }).on("touchmove mousemove", function(touchmove_event) {
                    if (elem.touchStart && elem.touchStart != 0) {
                        elem.$apply(function() {
                            //if not ignore movement
                            var cur_coordinates;
                            if (touchmove_event.originalEvent.touches) {
                                cur_coordinates = touchmove_event.originalEvent.touches[0].pageX;
                            } else {
                                cur_coordinates = touchmove_event.originalEvent.pageX;
                            }
                            var like_div = $($(".like")[0]),
                                dislike_div = $($(".dislike")[0]),
                                whole_div = $($(".animate-partial")[0]);


                            if (Math.abs(elem.touchStart - cur_coordinates) > pixel_threshold) {
                                //make partial animation

                                if (elem.touchStart > cur_coordinates) {
                                    like_div.removeClass("active");
                                    dislike_div.addClass("active");
                                    whole_div.addClass("animate-dislike-partial");
                                      whole_div.removeClass("animate-like-partial");
                                } else {
                                    dislike_div.removeClass("active");
                                    whole_div.addClass("animate-like-partial");
                                    whole_div.removeClass("animate-dislike-partial");
                                    like_div.addClass("active");
                                }
                            } else {
                                //remove classes from elements
                                whole_div.removeClass("animate-like-partial");
                                whole_div.removeClass("animate-dislike-partial");
                                like_div.removeClass("active");
                                dislike_div.removeClass("active");
                            }
                            elem.touchLast = cur_coordinates;
                        });
                    }
                }), $("#slidermain").on("touchend mouseup", function() {

                    if (elem.touchLast !== 0) {
                        if (Math.abs(elem.touchStart - elem.touchLast) >= pixel_threshold) {
                            //do nothing
                            console.log("touchended 1 " + elem.touchLast);
                            var like_div = $($(".like")[0]),
                                dislike_div = $($(".dislike")[0]),
                                whole_div = $($(".animate")[0]);

                            whole_div.removeClass("animate-like-partial");
                            whole_div.removeClass("animate-dislike-partial");
                            like_div.removeClass("active");
                            dislike_div.removeClass("active");
                            if (elem.touchLast > elem.touchStart) {
                                //elem.likeProduct()
                                elem.likeElement();
                                console.log("like Produkt");
                                whole_div.addClass("animate-like");
                            } else {
                                elem.dislikeElement();
                                //elem.dislikeProduct()
                                console.log("dislike Product");
                                whole_div.addClass("animate-dislike");
                            }

                            elem.touchStart = 0;
                            elem.touchLast = 0;

                            setTimeout(function() {
                                elem.dragging = false;
                            }, 300);
                        }
                    }
                    //window.location = "#/Page/product_detail?";
                    console.log("touchended" + elem.touchLast);

                });
            },
            controller: ["$scope", "$http", "$rootScope", "$ionicLoading", "EzAlert",
                function($scope, $http, $rootScope, $ionicLoading, EzAlert ) {
                    
                    $scope.likedElements = [];

                    $scope.dislikedElements =[];

                    if(!$rootScope.myCorotos){
                        $rootScope.myCorotos = []; 
                    }

                    //se obtuvo la data del rootScope desde el controlador de buscar
                    $scope.elements = $rootScope.products.Data;
                    
                    console.log($scope.elements)

                    $scope.likeElement= function(from_disc){
                        
                        if(from_disc){
                            var like_div = $($(".like")[0]),
                            dislike_div = $($(".dislike")[0]),
                            whole_div = $($(".animate-partial")[0]);
                            dislike_div.removeClass("active");
                            whole_div.addClass("animate-like-partial");
                            whole_div.removeClass("animate-dislike-partial");
                            like_div.addClass("active");
                        }
                        
                        //add elements to stack of liked elements
                        var got_element = $scope.elements.pop();
                        
                        $ionicLoading.show({
                            template: 'Enviando...'
                        });

                        //aqui vamos a enviar la desicion al servidor
                        var settings = {
                            "async": true,
                            "crossDomain": true,
                            "url": "http://corotear.azurewebsites.net/Corotear.asmx?op=selection",
                            "method": "POST",
                            "headers": {
                                "content-type": "text/xml",
                                "cache-control": "no-cache"
                            },
                            "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <selection xmlns=\"http://tempuri.org/\">\r\n      <Idpro>"+got_element.Id_product+"</Idpro>\r\n      <id_user>"+localStorage.id+"</id_user>\r\n      <Decision>1</Decision>\r\n      <Id_pro_chan>0</Id_pro_chan>\r\n     <Token>"+localStorage.accessToken+"</Token>\r\n    </selection>\r\n  </soap12:Body>\r\n</soap12:Envelope>"
                        }

                        $http(settings).then(function(data){
                            
                            //$rootScope.myCorotos.push(got_element);
                            $scope.likedElements.push(got_element);
                            //ad remove from normal
                            $scope.getData();

                            $ionicLoading.hide();
                        }, function(err){
                            console.log(err)
                            $ionicLoading.hide();
                            EzAlert.error('Ocurrio un error enviando la información');
                        });

                        $.ajax(settings).done(function (response) {

                        });
                    };

                    $scope.dislikeElement = function(from_disc){

                        if(from_disc){
                            var like_div = $($(".like")[0]),
                            dislike_div = $($(".dislike")[0]),
                            whole_div = $($(".animate-partial")[0]);
                            like_div.removeClass("active");
                            dislike_div.addClass("active");
                            whole_div.addClass("animate-dislike-partial");
                            whole_div.removeClass("animate-like-partial");
                        }


                        //add elements to stack of liked elements
                        var got_element = $scope.elements.pop();

                        $ionicLoading.show({
                            template: 'Enviando...'
                        });

                        //aqui vamos a enviar la desicion al servidor
                        var settings = {
                            "async": true,
                            "crossDomain": true,
                            "url": "http://corotear.azurewebsites.net/Corotear.asmx?op=selection",
                            "method": "POST",
                            "headers": {
                                "content-type": "text/xml",
                                "cache-control": "no-cache"
                            },
                            "data": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n  <soap:Body>\r\n    <selection xmlns=\"http://tempuri.org/\">\r\n      <Idpro>"+got_element.Id_product+"</Idpro>\r\n      <id_user>"+localStorage.id+"</id_user>\r\n      <Decision>2</Decision>\r\n      <Id_pro_chan>0</Id_pro_chan>\r\n     <Token>"+localStorage.accessToken+"</Token>\r\n    </selection>\r\n  </soap:Body>\r\n</soap:Envelope>"
                        }

                        $http(settings).then(function(data){
                            
                            $scope.dislikedElements.push(got_element);
                            //ad remove from normal
                            $scope.getData();

                            $ionicLoading.hide();
                        }, function(err){
                            console.log(err)
                            $ionicLoading.hide();
                            EzAlert.error('Ocurrio un error enviando la información');
                        });
                    };

                    $scope.getData = function(){
                        //get elements from rest source
                        //TODO
                        // Reconstruct Stack
                        $scope.apply
                    };

                }
            ]
        }
    });