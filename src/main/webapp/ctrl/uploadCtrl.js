/**
 * upload的控制器
 */

myApp.config([ '$routeProvider', function($routeProvider, $routeParams) {
	$routeProvider.when('/upload', {
		templateUrl : ctx + '/uploadXLS.html?v=' + sysVersion,
		controller : 'uploadController'
	});
} ]);

myApp.controller('uploadController', function($rootScope, $scope, $interval,
		$http, $location,formDataObject,confirmDialogs) {

	$scope.init = function() {
		$scope.display = "上传文件";
		$scope.error = true;
		$scope.$root.$broadcast('notify', {
			type : 'error',
			title : '提示',
			info : '上传失败',
			timeOut : 5000
		});
	}
	$scope.upload = function() {
		var req = {
	            'method': 'POST',
	            'url': ctx + '/upload',
	            'headers': {'Content-Type': undefined},
	            'data': {"file":$scope.file,"time":new Date()},
	            'transformRequest': formDataObject
	        };
		$scope.promise = $http(req).success(function (data) {
            if (data.result == 'success') {
                $scope.$root.$broadcast('notify', {type: 'success', title: '提示', info: '保存成功', timeOut: 2000});
                $location.path("/home").search();
            } else {
            	confirmDialogs.alert('确认', data.info + "",'下载')
        		.result.then(function(){
        			alert("a");
    				var iframe = document.createElement("iframe");
    				iframe.setAttribute("src", ctx +"/downloadError");
    				iframe.setAttribute("style", "display: none");
    				document.body.appendChild(iframe);
        		},function(){
        			alert("b");
    				var iframe = document.createElement("iframe");
    				iframe.setAttribute("src", ctx +"/downloadError");
    				iframe.setAttribute("style", "display: none");
    				document.body.appendChild(iframe);
        		});
            }
        }).error(function (data,status) {
        	alert("error...,data=" + data + ",status=" + status);
        });
		
	};
	$scope.checkFile = function(element) {
		if (!element.value)
			return;// IE11下的bug
		$scope.$apply(function($scope) {
			$scope.file = element.files[0];
			if ($scope.file == undefined) {
				$scope.showMsg = true;
				$scope.error = true;
				element.value = '';
				return;
			}
			var reg = /.(csv|xlsx|xls)$/gi;
			var isXLS = reg.test($scope.file.name);
			if (!isXLS) {
				$scope.showMsg = true;
				$scope.error = true;
				element.value = '';
				return;
			}
			$scope.error = false;
			$scope.display = "重新上传";
		});
	};
});
