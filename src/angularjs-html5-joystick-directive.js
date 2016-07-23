(function() {
    "use strict";

    var module = angular.module('angularjsHtml5Joystick', []);

    var joystickDirective = function () {
        return {
            restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                id: '@',
                onMove: '&'
            },
            controller: 'AngularjsHtml5JoystickController',
            link: function (scope, element, attrs) { //DOM manipulation
                element.on('touchstart', function(e) {
                    e.preventDefault();
                    //var statusElement = $('#' + attrs.id + '-status');
                    //statusElement.html('start');
                    scope.onTouchStart();
                });
                
                element.on('touchend', function(e) {
                    e.preventDefault();
                    //var statusElement = $('#' + attrs.id + '-status');
                    //statusElement.html('end');
                    scope.onTouchEnd();
                });
                
                element.on('touchmove', function(e) {
                    e.preventDefault();
                    //var statusElement = $('#' + attrs.id + '-status');
                    //statusElement.html('move');
                    var event = window.event; // for some reason, 'e' is useless so we get all data from event
                    //var statusElement = $('#' + attrs.id + '-status');
                    //statusElement.html('event.targetTouches: ' + event.targetTouches);
                    if(event.targetTouches.length > 0){        			        		
                        var touch = event.targetTouches[0];
                        var offset = element.offset();
                        var x = touch.pageX - offset.left;
                        var y = touch.pageY - offset.top;
                        //statusElement.html('x='+x + '  y= ' + y);
                        //var canvasCoordinates = {x: e.offsetX, y:e.offsetY}; // for using mousemove instead of touchmove
                        var canvasCoordinates = {x: x, y: y};
                        scope.onTouchMove(canvasCoordinates);
                    }
                });
            } 
        };
    };

    module.directive('angularjsHtml5Joystick', joystickDirective);
}());