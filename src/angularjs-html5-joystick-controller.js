(function() {
    "use strict";

    var module = angular.module('angularjsHtml5Joystick', []);

    var joystickController = function($scope, $attrs) {

        var canvasId = $attrs.id;
        var canvas = document.getElementById(canvasId);
        var bounds = {
            radius: canvas.width < canvas.height ? canvas.width / 2 : canvas.height / 2,
            center: {
                x: canvas.width / 2,
                y: canvas.height / 2
            } 
        };
        var outerRadius = 2 * bounds.radius / 3;
        var innerRadius = outerRadius / 2; 
        
        var started = false;
        
        var draw = function(vector) {
            var ctx = canvas.getContext('2d');						
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Lines
            ctx.beginPath();
            ctx.moveTo(0, bounds.center.y);
            ctx.lineTo(bounds.center.x * 2, bounds.center.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(bounds.center.x, 0);
            ctx.lineTo(bounds.center.x, bounds.center.y * 2);
            ctx.stroke();
            
            // Big circle
            ctx.beginPath();
            ctx.arc(bounds.center.x, bounds.center.y, outerRadius, 0, 2 * Math.PI);
            ctx.stroke();		
            
            // Little circle
            var relativeCoordinates = vectorToRelativeCoordinates(vector);
            var canvasCoordinates = relativeCoordinatesToCanvasCoordinates(relativeCoordinates);
            ctx.fillStyle = 'green';
            ctx.beginPath();
            ctx.arc(canvasCoordinates.x, canvasCoordinates.y, innerRadius, 0, 2 * Math.PI);
            ctx.fill();				
        };
        
        var canvasCoordinatesToRelativeCoordinates = function(canvasCoordinates){
            var relativeCoordinates = {
                x: canvasCoordinates.x - bounds.center.x, 
                y: -1.0 * (canvasCoordinates.y - bounds.center.y) 
            };
            
            return relativeCoordinates;
        };
        
        var relativeCoordinatesToVector = function(relativeCoordinates){
            var vector = {
                angle: Math.atan2(relativeCoordinates.y , relativeCoordinates.x), 
                magnitude: Math.sqrt(relativeCoordinates.x * relativeCoordinates.x + relativeCoordinates.y * relativeCoordinates.y) / outerRadius 
            };
            
            if(vector.magnitude > 1.0){
                vector.magnitude = 1.0;
            }		
            
            return vector;
        };
        
        var vectorToRelativeCoordinates = function(vector){
            var canvasMagnitude = vector.magnitude * outerRadius;
            
            var relativeCoordinates = {
                x: canvasMagnitude * Math.cos(vector.angle), 
                y: canvasMagnitude * Math.sin(vector.angle)  
            };
            
            return relativeCoordinates;
        };
        
        var relativeCoordinatesToCanvasCoordinates = function(relativeCoordinates){
            var canvasCoordinates = {
                x: relativeCoordinates.x + bounds.center.x,
                y: bounds.center.y - relativeCoordinates.y  
            };
            
            return canvasCoordinates;
        };
        
        var onVectorChange = function(vector) {
            draw(vector);
            $scope.onMove({vector: vector});		
        };
        
        $scope.onTouchStart = function() {
            started = true;
        };
        
        $scope.onTouchEnd = function() {
            started = false;
            resetVector();
        };
        
        $scope.onTouchMove = function(canvasCoordinates) {
            if(started){
                var relativeCoordinates = canvasCoordinatesToRelativeCoordinates(canvasCoordinates);
                var vector = relativeCoordinatesToVector(relativeCoordinates);
                onVectorChange(vector);
            }
        };
        
        var resetVector = function() {
            onVectorChange({
                angle: 0.0,
                magnitude: 0.0
            });		
        };
            
        resetVector();
    };

    module.controller('AngularjsHtml5JoystickController', ['$scope', '$attrs', joystickController]);
}());