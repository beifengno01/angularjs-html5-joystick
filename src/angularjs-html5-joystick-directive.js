(function() {
    "use strict";

    var module = angular.module('angularjs-html5-joystick');

    var joystickDirective = function (angularjsHtml5JoystickService) {
        return {
            restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                id: '@',
                onMove: '&',
                draw: '&?'
            },
            link: function (scope, element, attrs) { //DOM manipulation                
                scope.elementDetails = angularjsHtml5JoystickService.createElementDetails(attrs.id, scope.draw);
                
                element.on('touchmove', function(e) {
                    e.preventDefault();
                    var event = window.event; // for some reason, 'e' is useless so we get all data from window.event
                    if(event.targetTouches.length > 0){        			        		
                        var touch = event.targetTouches[0];
                        var offset = element.offset();
                        var x = touch.pageX - offset.left;
                        var y = touch.pageY - offset.top;
                        var canvasCoordinates = {x: x, y: y};
                        angularjsHtml5JoystickService.touchMove(scope.elementDetails, canvasCoordinates);
                        scope.onMove({vector: scope.elementDetails.vector});	
                    }
                });

                element.on('touchend', function(e) {
                    e.preventDefault();                                        
                    angularjsHtml5JoystickService.touchEnd(scope.elementDetails);
                    scope.onMove({vector: scope.elementDetails.vector});
                });

                angularjsHtml5JoystickService.reset(scope.elementDetails);
            } 
        };
    };

    module.directive('angularjsHtml5Joystick', ['angularjsHtml5JoystickService', joystickDirective]);
}());