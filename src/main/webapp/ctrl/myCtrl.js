/**
 * angulaJS 根配置
 */

var myApp = angular.module('myApp', [ 'ngRoute', 'ui.bootstrap', 'toaster','confirmDialogs','cgBusy',
		'angular.chosen', 'ngAnimate','rzModule' ]);


myApp.factory('formDataObject', function() {// 用于form file upload
	return function(data) {
		var fd = new FormData();
		angular.forEach(data, function(value, key) {
			fd.append(key, value);
		});
		return fd;
	};
});

myApp.config([ '$routeProvider', function($routeProvider, $routeParams) {
	$routeProvider.when('/home', {
		templateUrl : ctx + '/home.html',
		controller : 'myCtrl'
	}).when('/choseCheckBox', {
		templateUrl : ctx + '/choseCheckBox.html',
		controller : 'checkCtrl'
	}).otherwise({
		redirectTo : '/chart'
	});
} ]);

myApp.controller('myCtrl', function($rootScope, $scope, $interval, $http,
		$modal, $log, toaster,$location, $anchorScroll) {
	// alert('欢迎回家！' + moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
	$scope.$on('notify', function(event, toastData) { // 事件通信-接受
		 toaster.pop(toastData.type, toastData.title, toastData.info,
				toastData.timeOut);
	});

	$scope.msg = function() {
		toaster.pop("info", "hello", "wohaha");
		alert("aaa");
	};

	$scope.cors = function() {
		// var url = "http://test.business.ka.163.com/omp/priceVersion/importPrice?id=1&platform=1&token=8d8fh4az3434hjkklsf9";
		var url = "http://test.business.ka.163.com/omp/priceVersion/search?id=1&platform=1&token=8d8fh4az3434hjkklsf9";
        $.post(url, {
            "str" : $scope.str
        }, function(data) {
            alert(data);
        }, "html");
	};

	$scope.query = function() {
		// $http.post('/query', {"str":$scope.str}).success(function(data){
		// alert(data);
		// });
		$('.box').hide();
		$.post('/query', {
			"str" : $scope.str
		}, function(data) {
			$scope.$root.$broadcast('notify', {
				type : 'success',
				title : '提示',
				info : '操作成功',
				timeOut : 2000
			}); // 事件通信-发送
		}, "json");
	};

	$scope.items = [ '张三', '李四', '王五' ];
	$scope.open = function(size) { // 打开模态
		var modalInstance = $modal.open({
			templateUrl : 'myModelContent.html', // 指向上面创建的视图
			controller : 'ModalInstanceCtrl',// 初始化模态范围
			animation : true,
			backdrop : 'static', // 背景是存在的，但点击模态窗口之外时，模态窗口不关闭
			size : size, // 大小配置
			resolve : {
				items : function() {
					return $scope.items;
				},
				selected : function() {
					return $scope.selected;
				}
			}
		})
		modalInstance.result.then(function(selectedItem) {
			$scope.selected = selectedItem;
			$scope.$root.$broadcast('notify', {
				type : 'success',
				title : '提示',
				info : '操作成功,选择了' + selectedItem,
				timeOut : 5000
			}); // 事件通信-发送
		}, function(reason) {
			$log.info(reason);
			$log.info('Modal dismissed at: '
					+ moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
		});
	};
	$scope.numbers = {
		"自然数" : [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15",
				"16", "17", "18", "19", "" ],
		"质数" : [ "2", "3", "5", "7", "11", "13", "17", "19", "23", "29" ]
	};
	$scope.jumper = function(key) {
		$location.hash(key);
		$anchorScroll();
	}

});

myApp.controller('ModalInstanceCtrl', function($scope, $modalInstance, items,
		selected) { // 依赖于modalInstance
	$scope.items = items;
	$scope.selected = {
		item : selected ? selected : $scope.items[0]
	};
	$scope.ok = function() {
		$modalInstance.close($scope.selected.item); // 关闭并返回当前选项
	};
	$scope.cancel = function() {
		$modalInstance.dismiss('点击了cancel按钮'); // 退出
	}
	$scope.close = function() {
		$modalInstance.dismiss('点击了close按钮'); // 退出
	}
});

myApp.controller('checkCtrl', function($scope, $modalInstance, items,
		selected) { // 依赖于modalInstance
	$("#submit").click(function(){
		var checked = $("input:checked");
		if(checked.size()==0){
			alert("error!");
		}
	});
});

