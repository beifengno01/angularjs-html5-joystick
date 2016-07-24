var app = angular.module('spa', ['angularjs-html5-joystick']);

app.controller('ExampleController', function($scope) {

    $scope.leftStatus = '';
    $scope.rightStatus = '';

    $scope.onLeftJoystickMove = function(vector) {
        $scope.leftStatus = 'angle = ' + vector.angle + ', magnitude = ' + vector.magnitude;
        $scope.$apply();
    };

    $scope.onRightJoystickMove = function(vector) {
        $scope.rightStatus = 'angle = ' + vector.angle + ', magnitude = ' + vector.magnitude;
        $scope.$apply();
    };

    $scope.drawRightJoystick = function(ctx, bounds, vector) {
            // Big circle
            ctx.beginPath();
            ctx.arc(bounds.center.x, bounds.center.y, bounds.outerRadius, 0, 2 * Math.PI);
            ctx.stroke();		
            
            // Little circle
            var cartesianCoordinates = vectorToCartesianCoordinates(bounds.outerRadius, vector);
            var canvasCoordinates = cartesianCoordinatesToCanvasCoordinates(bounds.center, cartesianCoordinates);
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(canvasCoordinates.x, canvasCoordinates.y, bounds.innerRadius, 0, 2 * Math.PI);
            ctx.fill();        
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
});
