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
});
