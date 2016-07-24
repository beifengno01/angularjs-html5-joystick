(function() {
    "use strict";

    var module = angular.module('angularjs-html5-joystick', []);

}());
(function() {
    "use strict";

    var module = angular.module('angularjs-html5-joystick');

    var joystickService = function() {

        // var canvasId = $attrs.id;
        
        var createElementDetails = function(canvasId, drawCallback){
            var canvas = document.getElementById(canvasId);

            var bounds = {
                radius: canvas.width < canvas.height ? canvas.width / 2 : canvas.height / 2,
                outerRadius: 0, // to be set after this
                innerRadius: 0, // to be set after this
                center: {
                    x: canvas.width / 2,
                    y: canvas.height / 2
                } 
            };
            bounds.outerRadius = 2 * bounds.radius / 3;
            bounds.innerRadius = bounds.outerRadius / 2; 

            var elementDetails = {
                canvasId: canvasId,
                canvas: canvas,
                bounds: bounds,
                vector: {
                    angle: 0.0,
                    magnitude: 0.0                    
                },
                drawCallback: drawCallback
            };

            return elementDetails;
        };
        
        var draw = function(elementDetails) {
            var ctx = elementDetails.canvas.getContext('2d');						
            ctx.clearRect(0, 0, elementDetails.canvas.width, elementDetails.canvas.height);
            
            if(elementDetails.drawCallback) {
                // Let the callback do the drawing
                elementDetails.drawCallback({
                    ctx: ctx, 
                    bounds: elementDetails.bounds, 
                    vector: elementDetails.vector
                });
            } else {
                // Big circle
                ctx.beginPath();
                ctx.arc(elementDetails.bounds.center.x, elementDetails.bounds.center.y, elementDetails.bounds.outerRadius, 0, 2 * Math.PI);
                ctx.stroke();		
                
                // Little circle
                var cartesianCoordinates = vectorToCartesianCoordinates(elementDetails.bounds.outerRadius, elementDetails.vector);
                var canvasCoordinates = cartesianCoordinatesToCanvasCoordinates(elementDetails.bounds.center, cartesianCoordinates);
                ctx.fillStyle = 'green';
                ctx.beginPath();
                ctx.arc(canvasCoordinates.x, canvasCoordinates.y, elementDetails.bounds.innerRadius, 0, 2 * Math.PI);
                ctx.fill();
            }				
        };
        
        var canvasCoordinatesToCartesianCoordinates = function(center, canvasCoordinates){
            var cartesianCoordinates = {
                x: canvasCoordinates.x - center.x, 
                y: -1.0 * (canvasCoordinates.y - center.y) 
            };
            
            return cartesianCoordinates;
        };
        
        var cartesianCoordinatesToVector = function(outerRadius, cartesianCoordinates){
            var vector = {
                angle: Math.atan2(cartesianCoordinates.y , cartesianCoordinates.x), 
                magnitude: Math.sqrt(cartesianCoordinates.x * cartesianCoordinates.x + cartesianCoordinates.y * cartesianCoordinates.y) / outerRadius 
            };
            
            if(vector.magnitude > 1.0){
                vector.magnitude = 1.0;
            }		
            
            return vector;
        };
        
        var vectorToCartesianCoordinates = function(outerRadius, vector){
            var canvasMagnitude = vector.magnitude * outerRadius;
            
            var cartesianCoordinates = {
                x: canvasMagnitude * Math.cos(vector.angle), 
                y: canvasMagnitude * Math.sin(vector.angle)  
            };
            
            return cartesianCoordinates;
        };
        
        var cartesianCoordinatesToCanvasCoordinates = function(center, cartesianCoordinates){
            var canvasCoordinates = {
                x: cartesianCoordinates.x + center.x,
                y: center.y - cartesianCoordinates.y  
            };
            
            return canvasCoordinates;
        };
        
        var onVectorChange = function(elementDetails) {
            draw(elementDetails);
        };
                
        var touchMove = function(elementDetails, canvasCoordinates) {
            var cartesianCoordinates = canvasCoordinatesToCartesianCoordinates(elementDetails.bounds.center, canvasCoordinates);
            elementDetails.vector = cartesianCoordinatesToVector(elementDetails.bounds.outerRadius, cartesianCoordinates);            
            onVectorChange(elementDetails);
        };
        
        var touchEnd = function(elementDetails) {
            resetVector(elementDetails);
        };
        
        var resetVector = function(elementDetails) {
            elementDetails.vector.angle = 0.0;
            elementDetails.vector.magnitude = 0.0;
            onVectorChange(elementDetails);		
        };
            
        return {
            createElementDetails: createElementDetails,
            reset: resetVector,
            touchMove: touchMove,
            touchEnd: touchEnd
        };
    };

    module.factory('angularjsHtml5JoystickService', [joystickService]);
}());
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