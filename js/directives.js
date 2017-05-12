//declaracion del modulo de directivas
angular.module('app.directives', [])

//** esta directiva controla las estrellas para publicar articulos */
.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
})

//directiva para las notificaciones
.directive('notification', function($timeout){
  return {
     restrict: 'E',
     replace: true,
     scope: {
         ngModel: '=',
         classAl: '='
     },
     template: '<div class="{{classAl}}" bs-alert="ngModel"></div>',
     link: function(scope, element, attrs){
         console.log(element)
         $timeout(function(){
             element.remove();
         }, 5000);
     }
  }
});