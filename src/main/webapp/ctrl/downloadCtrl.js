/**
 * upload的控制器
 */

myApp.config([ '$routeProvider', function($routeProvider, $routeParams) {
	$routeProvider.when('/download', {
		templateUrl : ctx + '/downloadXLS.html?v=' + sysVersion,
		controller : 'downloadController'
	});
} ]);

myApp.controller('downloadController', function($rootScope, $scope, $interval,
		$http, $location,formDataObject) {

	$scope.init = function() {
//		alert("hello！！！");
	}
	$scope.downLoad = function(num){
		var iframe = document.createElement("iframe");
		iframe.setAttribute("src", ctx +"/download?num="+num);
		iframe.setAttribute("style", "display: none");
		document.body.appendChild(iframe);
//		$scope.promise = $http.post( ctx +"/download?num="+num).success(function(data){
//			alert(data);
//		}).error(function(err){
//			alert(err);
//		});
	}
});
