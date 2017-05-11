/**
 * Created by bjguoyaxin on 2017/05/11.
 */
myApp.config(['$routeProvider', function ($routeProvider, $routeParams) {
    $routeProvider.when('/collapse', {
        templateUrl: ctx + '/collapseCheckBox.html',
        controller: 'collapseCheckBox'
    });
}]);

myApp.controller('collapseCheckBox', function ($rootScope, $scope, $interval, $http,
                                               $modal, $log, toaster, $location, $anchorScroll) {

    $scope.data = [{
        id: 1,
        name: "休闲娱乐",
        child: [{id: 10, name: "搞笑"}, {id: 11, name: "图片"}, {id: 12, name: "奇闻趣事"}, {id: 13, name: "情感"}, {
            id: 14,
            name: "星座"
        }, {id: 15, name: "娱乐"}]
    }, {
        id: 2,
        name: "旅游",
        child: [{id: 20, name: "北京"}, {id: 21, name: "天津"}, {id: 22, name: "河北"}, {id: 23, name: "山东"}, {
            id: 24,
            name: "河南"
        }, {id: 25, name: "山西"}]
    }, {
        id: 3,
        name: "IT",
        child: [{id: 30, name: "java"}, {id: 31, name: "c"}, {id: 32, name: "js"}, {id: 33, name: "sql"}, {
            id: 34,
            name: "python"
        }, {id: 35, name: "golang"}]
    }, {
        id: 4,
        name: "44"
    }, {
        id: 5,
        name: "55"
    }, {
        id: 6,
        name: "66"
    }, {
        id: 7,
        name: "77"
    }, {
        id: 8,
        name: "88"
    }, {
        id: 9,
        name: "99"
    }];

    $scope.interestTab = 1;

    $scope.initInterest = function () {
        var data = $scope.data;
        $scope.allChecked = true;
        for (i = 0; i < data.length; i++) {
            var one = data[i];
            one.checked = true;
            if (one.child) {
                for (j = 0; j < one.child.length; j++) {
                    var two = one.child[j];
                    two.checked = true;
                }
            }
        }
    };

    $scope.initInterest();

    $scope.isAllChecked = function () {
        var data = $scope.data;
        for (i = 0; i < data.length; i++) {
            data[i].checked = $scope.allChecked;
        }
    };
    $scope.noChecked = function () {
        var data = $scope.data;
        for (i = 0; i < data.length; i++) {
            if (!data[i].checked) {
                $scope.allChecked = false;
                break;
            }
            if (i == data.length - 1) {
                $scope.allChecked = true;
            }
        }
    };

    $scope.groupChecked = function (group) {
        var data = group.child;
        if (!data) {
            return;
        }
        for (i = 0; i < data.length; i++) {
            data[i].checked = group.checked;
        }
    };
    $scope.noGroupChecked = function (group) {
        var data = group.child;
        if (!data) {
            return;
        }
        for (i = 0; i < data.length; i++) {
            if (!data[i].checked) {
                group.checked = false;
                break;
            }
            if (i == data.length - 1) {
                group.checked = true;
            }
        }
    };

    $scope.toCollapsed = function (one) {
        one.isCollapsed = !one.isCollapsed;
        var eleId = "#collapse-" + one.id;
        angular.element(eleId).toggleClass("glyphicon-plus-sign glyphicon-minus-sign");
    };

});