# angularjs-html5-joystick
HTML5 joystick control as an Angularjs module.

## Usage
* Include module javascript file (located in the **dist** folder of this repo)
* Include this module as a dependency in your module declaration: 
```javascript 
var app = angular.module('myApp', ['angularjs-html5-joystick']);
```
* Add the control as an attribute on a `<canvas>` element. You must include the **id** and **on-move** attribute:
```html
<canvas angularjs-html5-joystick id="joystick" on-move="onJoystickMove(vector)"/>
```
* Implement callback in your controller:
```javascript 
app.controller('MyController', function($scope) {

    $scope.status = '';
    
    $scope.onJoystickMove = function(vector) {
        $scope.status = 'angle = ' + vector.angle + ', magnitude = ' + vector.magnitude;
        $scope.$apply();
    };
    
});
```
* Optionally, you can render the control yourself by including the **draw** attribute:
```html
<canvas angularjs-html5-joystick id="joystick" on-move="onJoystickMove(vector)" draw="myCustomDrawCallback(ctx, bounds, vector)"/>
```
```javascript 
// inside my controller
$scope.myCustomDrawCallback = function(ctx, bounds, vector) {
  // See example/app/app.js for an example of custom drawing
};
```
