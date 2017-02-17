/**
 * chart的控制器
 */

myApp.config([ '$routeProvider', function($routeProvider, $routeParams) {
	$routeProvider.when('/chart', {
		templateUrl : ctx + '/myEcharts.html?v=' + sysVersion,
		controller : 'chartController'
	}).otherwise({
		redirectTo : '/home' //会覆盖之前的otherwise。。。
	});
} ]);

myApp.controller(
				'chartController',
				function($rootScope, $scope, $interval, $http, $location) {
					// 基于准备好的dom，初始化echarts图表
					var myChart = echarts.init(document.getElementById('main'));

					var option = {
						title : {
							text : '我哈哈'
						},
						toolbox : {
							show : true,
							x : '500', // 水平安放位置，默认为全图右对齐，可选为：
							// 'center' ¦ 'left' ¦ 'right'
							// ¦ {number}（x坐标，单位px）
							y : 'top', // 'top' ¦ 'bottom' ¦ 'center'
							// ¦ {number}（y坐标，单位px）
							feature : {
								dataView : {
									show : true,
									title : '数据视图',
									readOnly : true,
									lang : [ '数据视图', '关闭', '刷新' ],
									optionToContent : function(opt) {
										var axisData = opt.xAxis[0].data;
										var series = opt.series;
										var table = '<table style="width:100%;text-align:center"><tbody><tr>'
												+ '<td>样式</td>'
												+ '<td>'
												+ series[0].name
												+ '</td>'
												+ '<td>'
												+ series[1].name
												+ '</td>' + '</tr>';
										for (var i = 0, l = axisData.length; i < l; i++) {
											table += '<tr>' + '<td>'
													+ axisData[i] + '</td>'
													+ '<td>'
													+ series[0].data[i]
													+ '</td>' + '<td>'
													+ series[1].data[i]
													+ '</td>' + '</tr>';
										}
										table += '</tbody></table>';
										return table;
									}
								},
								magicType : {
									show : true,
									title : {
										stack : '动态类型切换-堆积',
										bar : '动态类型切换-柱形图',
										a : "aa",
										tiled : '动态类型切换-平铺',
										line : '动态类型切换-折线图'
									},
									type : [ 'bar', 'line', 'tiled', 'stack',
											'a' ]
								},
								myTool : {
									show : true,
									title : '自定义扩展方法',
									icon : '/res/1.jpg',
									onclick : function() {
										alert(f1);
									}
								}
							}
						},
						tooltip : {
							show : true,
							trigger : 'axis' // 切换提示框横纵name展示（item/axis）
						},
						legend : {
							data : [ '销量', 'wohaha' ]
						},
						// grid: {
						// left: '3%',
						// right: '4%',
						// bottom: '3%',
						// containLabel: true
						// },
						xAxis : [ {
							type : 'category',
							data : [ "衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子" ]
						} ],
						yAxis : [ {
							type : 'value'
						} ],
						series : [ {
							"name" : "销量",
							"type" : "line",
							"data" : [ 5, 20, 40, 10, 10, 20 ]
						}, {
							"name" : "wohaha",
							"type" : "line",
							"data" : [ 15, 120, 140, 10, 10, 20 ]
						} ]
					};

					// 为echarts对象加载数据
					myChart.setOption(option);

					var f1 = 'wohaha!';
				});
