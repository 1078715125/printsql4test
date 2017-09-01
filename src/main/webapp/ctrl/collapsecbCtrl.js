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
    $scope.cast = {};
    $scope.cast.sexSelect = 0;
    $scope.cast.ageSelect = 1;
    /**
     * 滑块初始化值
     * @type {Array}
     */
    var AGE_MIN_VALUE = 5;
    var AGE_MAX_VALUE = 60;
    // getStepsArray = function () {
    //     var array = [];
    //     array.push({value: '无限制'});
    //     array.push({value: '无限制'});
    //     array.push({value: '无限制'});
    //     array.push({value: '无限制'});
    //     for (i = AGE_MIN_VALUE; i <= AGE_MAX_VALUE; i++) {
    //         array.push({value: i});
    //     }
    //     array.push({value: '无限制'});
    //     array.push({value: '无限制'});
    //     array.push({value: '无限制'});
    //     array.push({value: '无限制'});
    //     return array;
    // };
    $scope.slider = {
        minValue: 18,
        maxValue: 50,
        options: {
            floor: 0,
            ceil: 65,
            step: 1,
            // noSwitching: true,
            // stepsArray: getStepsArray(),
            translate: function (value) {
                // if (value < AGE_MIN_VALUE || value > AGE_MAX_VALUE) {
                //     return "无限制";
                // }
                // return value + "岁";
                if (validAge(value)) {
                    return value + "岁";
                }
                return "无限制";
            }
        }
    };
    $scope.cast.ageDisplay = "18~50岁";

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

    $scope.initTree = function () {
        var zNodes = [
            {id: 1, name: "休闲娱乐", checked: true, open: true},
            {id: 11, pId: 1, name: "搞笑", checked: true},
            {id: 12, pId: 1, name: "图片", checked: true},
            {id: 13, pId: 1, name: "奇闻趣事", checked: true},
            {id: 14, pId: 1, name: "全球华人富豪榜", checked: true},
            {id: 15, pId: 1, name: "星座", checked: true},
            {id: 16, pId: 1, name: "娱乐", checked: true},
            {id: 2, pId: 0, name: "旅游", checked: true, open: true},
            {id: 21, pId: 2, name: "北京", checked: true},
            {id: 22, pId: 2, name: "天津", checked: true},
            {id: 23, pId: 2, name: "河北", checked: true},
            {id: 24, pId: 2, name: "山东", checked: true},
            {id: 25, pId: 2, name: "河南", checked: true},
            {id: 26, pId: 2, name: "山西", checked: true}
        ];
        var zNodes_area = [
            {id: 11, pId: 1, name: "搞笑", checked: true},
            {id: 12, pId: 1, name: "图片", checked: true},
            {id: 13, pId: 1, name: "奇闻趣事", checked: true},
            {id: 14, pId: 1, name: "全球华人富豪榜", checked: true},
            {id: 15, pId: 1, name: "星座", checked: true},
            {id: 16, pId: 1, name: "娱乐", checked: true},
            {id: 1,  pId: 0, name: "其他", checked: true, open: true},
            {id: 21, pId: 2, name: "北京", checked: true},
            {id: 22, pId: 2, name: "天津", checked: true},
            {id: 23, pId: 2, name: "河北", checked: true},
            {id: 24, pId: 2, name: "山东", checked: true},
            {id: 2,  pId: 0, name: "重点城市", checked: true, open: true},
            {id: 25, pId: 2, name: "河南", checked: true},
            {id: 26, pId: 2, name: "山西", checked: true}
        ];
        //构建树结构
        var setting = {
            check: {
                enable: true,
                chkDisabledInherit: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            view: {
                showIcon: false
            },
            callback: {
                onCheck: function () {
                    var zTree = $.fn.zTree.getZTreeObj("positionTree");
                    var nodes = zTree.getCheckedNodes(true);
                    $scope.selectorPosition = [];
                    var ids = new Array();
                    for (var j = 0; j < nodes.length; j++) {
                        if (!nodes[j].isParent) {
                            $scope.selectorPosition.push({
                                name: nodes[j].display_name,
                                id: nodes[j].id,
                                code: nodes[j].code,
                                base_price: nodes[j].base_price
                            });
                            ids.push(nodes[j].id);
                        }
                    }
                    console.log(ids);
                }
            }
        };
        $.fn.zTree.init($("#positionTree"), setting, zNodes);

        //构建地域树结构
        var setting_area = {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onCheck: function () {

                }
            }
        };
        $.fn.zTree.init($("#areaTree"), setting_area, zNodes_area);
    };

    $scope.searchArea = function(){
        searchNode("name",$scope.searchStr,$.fn.zTree.getZTreeObj("areaTree"));
    };

    // 模糊搜索name满足条件的节点
    function searchNode(key,value,zTree) {
        if (value === "") {
            closeAll(zTree);
            var hidden_nodes = zTree.getNodesByParam("isHidden", true);
            zTree.showNodes(hidden_nodes);
            return;
        }
        nodeList = zTree.getNodesByParamFuzzy(key, value);
        /**不查询父级
         for(var x = 0 ; x<nodeList.length ; x++){
                if(nodeList[x].isParent){
                    nodeList.splice(x--,1);
                }
            }
         */
        //zTree.cancelSelectedNode();
        nodeList = zTree.transformToArray(nodeList);
        updateNodes(true,value,key,zTree);
    }
    function updateNodes(highlight,value,keyType,zTree) {
        var allNode = zTree.transformToArray(zTree.getNodes());
        zTree.hideNodes(allNode);
        for(var n in nodeList){
            findParent(zTree,nodeList[n]);
        }
        closeAll(zTree);
        zTree.showNodes(nodeList);
        nodeList = zTree.getNodesByParamFuzzy(keyType, value);
        for( var i=0; i<nodeList.length; i++) {
            //zTree.updateNode(nodes[i]);
            zTree.selectNode(nodeList[i],true);
        }
    }

    function findParent(zTree,node){
        zTree.expandNode(node,true,false,false);
        var pNode = node.getParentNode();
        if(pNode != null){
            nodeList.push(pNode);
            findParent(zTree,pNode);
        }

    }

    function getFontCss(treeId, treeNode) {
        return (!!treeNode.highlight) ? {color:"#ffffff", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
    }

    function closeAll(zTree){
        zTree.expandAll(false); //关闭所有节点
        var nodes = zTree.getNodes();
        zTree.expandNode(nodes[0], true, false, true);  //打开根节点
    }


    /**
     * 初始化年龄slider条
     */
    $scope.initSlider = function () {
        // var snapSlider = document.getElementById('slider-age');
        // noUiSlider.create(snapSlider, {
        //     start: [$scope.snapValuesFrom, $scope.snapValuesTo],
        //     // snap: true,
        //     connect: true,
        //     step: 1,
        //     range: {
        //         'min': [0, 5],
        //         '15%': [5, 1],
        //         '80%': [60, 10],
        //         'max': 80
        //     }
        // });
        // snapSlider.noUiSlider.on('update', function (values, handle) {
        //     switch (handle){
        //         case 0:
        //             $scope.snapValuesFrom = parseInt(values[handle]);
        //             break;
        //         case 1:
        //             $scope.snapValuesTo = parseInt(values[handle]);
        //             break;
        //     }
        //     console.log("snapValuesFrom:",$scope.snapValuesFrom);
        //     console.log("snapValuesTo:",$scope.snapValuesTo);
        // });

    };

    $scope.resetAge = function () {
        $scope.slider.minValue = 18;
        $scope.slider.maxValue = 50;
        $scope.cast.ageDisplay = "18~50岁";
        if($scope.cast.ageSelect == 0){
            angular.element("#age-slider").collapse('hide');
        } else {
            angular.element("#age-slider").collapse('show');
        }

    };
    angular.element("#age-slider").collapse('show');
    $scope.toDisplayAgeMin = function () {
        if (isNaN($scope.cast.minAge) || !validAge($scope.cast.minAge) ||
            (!isNaN($scope.cast.maxAge) && $scope.cast.minAge > $scope.cast.maxAge)) {
            $scope.cast.minAge = AGE_MIN_VALUE;
        }
        $scope.slider.minValue = $scope.cast.minAge;
    };
    $scope.toDisplayAgeMax = function () {
        if (isNaN($scope.cast.maxAge) || !validAge($scope.cast.maxAge) ||
            (!isNaN($scope.cast.minAge) && $scope.cast.minAge > $scope.cast.maxAge)) {
            // if ($scope.cast.minAge > $scope.cast.maxAge) {
            $scope.cast.maxAge = AGE_MAX_VALUE;
        }
        $scope.slider.maxValue = $scope.cast.maxAge;
    };

    $scope.setAgeDisplay = function () {
        var minValue = $scope.slider.minValue;
        var maxValue = $scope.slider.maxValue + "岁";
        if ($scope.slider.minValue < 5 && validAge($scope.slider.maxValue)) {
            $scope.cast.ageDisplay = maxValue + "以下";
        } else if (validAge($scope.slider.minValue) && $scope.slider.maxValue > 60) {
            $scope.cast.ageDisplay = minValue + "岁以上";
        } else if (!validAge($scope.slider.minValue) && !validAge($scope.slider.maxValue)) {
            $scope.cast.ageSelect = 0;
        } else {
            $scope.cast.ageDisplay = minValue + "~" + maxValue;
        }
    };

    validAge = function (age) {
        if (age >= AGE_MIN_VALUE && age <= AGE_MAX_VALUE) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 添加slider的监听
     * @type {*}
     */
    var watch = $scope.$watch('slider', function (newValue, oldValue, scope) {
        var min = newValue.minValue;
        var max = newValue.maxValue;
        if (validAge(min)) {
            $scope.cast.minAge = min;
        } else {
            $scope.cast.minAge = '无限制';
        }
        if (validAge(max)) {
            $scope.cast.maxAge = max;
        } else {
            $scope.cast.maxAge = '无限制';
        }

    }, true);// true:深度监听

    /**
     * 绑定class：age的回车事件
     * @param event
     */
    $scope.ageKeyDown = function (event) {
        if (!event) {
            event = window.event;//火狐浏览器
        }
        //也可用下面的代替上面的if语句
        //document.all可以判断浏览器是否是IE
        var event = document.all ? window.event : event;
        if ((event.keyCode || event.which) == 13) {
            $scope.setAgeDisplay();
        }
    };

});