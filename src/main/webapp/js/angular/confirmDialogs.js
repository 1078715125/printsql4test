var confirmDialogs = angular.module('confirmDialogs',['ui.bootstrap']);
var normalConfirmCtrl = confirmDialogs.controller('normalConfirmCtrl', function($scope, $http, $modalInstance, data){
	$scope.info = data;
	
	$scope.ok = function() {
		$modalInstance.close('ok');
	};
	
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}
});
confirmDialogs.provider('confirmDialogs', function(){
	this.$get = ['$modal',function ($modal){
		return {
			error : function(title, info){
				return $modal.open({
					template : '<div class="modal-header"  style="background:#f5f5f5;height:50px">'+
					'				<div class="row">'+
					'					<div class="col-sm-7">'+
					'						<h4 class="modal-title">{{info.title}}</h4>'+
					'					</div>'+
					'					<div class="col-sm-5">'+
					'						<button type="button" class="close" ng-click="cancel()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
					'					</div>'+
					'				</div>'+
					'			</div>'+
					'			<div class="modal-body" >'+
					'				<div class="row" style="word-break:break-all;background:#ffffff;vertical-align:middle; text-align:left;margin:10px 10px">'+
					'					{{info.info}}'+
					'				</div>'+
					'				<div class="row" style="text-align:center;margin-top:20px">'+
					'						<button type="button" class="btn btn-sm btn-default" ng-click="cancel()">关闭</button>'+
					'					</div>'+
					'			</div>',
					controller : 'normalConfirmCtrl',
					windowClass: 'app-modal-window',
					resolve : {
						data : function(){
							return {
								title : title,
								info : info
							};
						}
					}
				});
			},
			normal : function(title, info){
				return $modal.open({
					template : '<div class="modal-header" style="background:#f5f5f5;height:50px">'+
					'				<div class="row">'+
					'					<div class="col-sm-7">'+
					'						<h4 class="modal-title">{{info.title}}</h4>'+
					'					</div>'+
					'					<div class="col-sm-5">'+
					'						<button type="button" class="close" ng-click="cancel()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
					'					</div>'+
					'				</div>'+
					'			</div>'+
					'			<div class="modal-body">'+
					'				<div class="row"  style="word-break:break-all;background:#ffffff;vertical-align:middle; text-align:left;margin:10px 10px">'+
					'					<p ng-bind-html="info.info"></p>'+
					'				</div>'+
					'				<div class="row">'+
					'					<div class="col-sm-offset-3 col-sm-4">'+
					'						<button type="submit" class="btn btn-sm btn-danger" ng-click="ok()">确定</button>'+
					'					</div>'+
					'					<div class="col-sm-4">'+
					'						<button type="button" class="btn btn-sm btn-default" ng-click="cancel()">取消</button>'+
					'					</div>'+
					'				</div>'+
					'			</div>',
					controller : 'normalConfirmCtrl',
				     windowClass: 'app-modal-window',
					resolve : {
						data : function(){
							return {
								title : title,
								info : info
							};
						}
					}
				});
			},
			infoArea : function(title, infoArea,cityName,provinceName,positionName,ideaType){
				return $modal.open({
					template : '<div class="modal-header"  style="background:#f5f5f5;height:50px">'+
					'				<div class="row">'+
					'					<div class="col-sm-7">'+
					'						<h4 class="modal-title">{{info.title}}</h4>'+
					'					</div>'+
					'					<div class="col-sm-5">'+
					'						<button type="button" class="close" ng-click="cancel()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
					'					</div>'+
					'				</div>'+
					'			</div>'+
					'			<div class="modal-body" >'+
					'				<div style="padding-left:6px;margin-bottom:10px">{{info.positionName}}<span ng-if="info.ideaType ==1">-->信息流-图文模式</span>' +
					'				<span ng-if="info.ideaType ==2">-->信息流-三图模式</span><span ng-if="info.ideaType ==3">-->信息流-大图模式</span><span ng-if="info.ideaType ==4">-->信息流-下载图文模式</span>' +
					'				<span ng-if="info.ideaType ==5">-->信息流-下载大图模式</span></div> '	+
					'				<div class="row" style="overflow-y: scroll;word-break:break-all;background:#ffffff;vertical-align:middle; text-align:left;padding-left:20px;height:100px;">'+
					'					<div style="color:#A0A0A0">{{info.infoArea}}</div>' +
					'					<span ng-repeat="item in info.cityName track by $index">' +
					'							<p ng-if=" info.provinceName[$index] != null">{{info.provinceName[$index]}} : {{item}}</p>'+											
					'					</span>' +
					'				</div>'+
					'				<div class="row" style="text-align:center;margin-top:20px">'+
					'						<button type="button" class="btn btn-sm btn-default" ng-click="cancel()">关闭</button>'+
					'					</div>'+
					'			</div>',
					controller : 'normalConfirmCtrl',
					size: 'md',
					resolve : {
						data : function(){
							return {
								title : title,
								infoArea : infoArea,
								cityName:cityName,
								provinceName:provinceName,
								positionName:positionName,
								ideaType:ideaType
							};
						}
					}
				});
			},
			infoDate:function(title, infoDate,dates,positionName,ideaType){
				return $modal.open({
					template : '<div class="modal-header"  style="background:#f5f5f5;height:50px">'+
					'				<div class="row">'+
					'					<div class="col-sm-7">'+
					'						<h4 class="modal-title">{{info.title}}</h4>'+
					'					</div>'+
					'					<div class="col-sm-5">'+
					'						<button type="button" class="close" ng-click="cancel()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
					'					</div>'+
					'				</div>'+
					'			</div>'+
					'			<div class="modal-body" >'+
					'				<div style="padding-left:6px;margin-bottom:10px">{{info.positionName}}<span ng-if="info.ideaType ==1">-->信息流-图文模式</span>' +
					'				<span ng-if="info.ideaType ==2">-->信息流-三图模式</span><span ng-if="info.ideaType ==3">-->信息流-大图模式</span><span ng-if="info.ideaType ==4">-->信息流-下载图文模式</span>' +
					'				<span ng-if="info.ideaType ==5">-->信息流-下载大图模式</span></div> '	+
					'				<div class="row" style="overflow-y: scroll;word-break:break-all;background:#ffffff;vertical-align:middle; text-align:left;padding-left:20px;height:100px;">'+
					'					<div style="color:#A0A0A0">{{info.infoDate}}</div>' +
					'					<span ng-repeat="item in info.dates track by $index">' +
					'							<span>{{item.display}}{{$last ? "" : ", "}}</span>'+											
					'					</span>' +
					'				</div>'+
					'				<div class="row" style="text-align:center;margin-top:20px">'+
					'						<button type="button" class="btn btn-sm btn-default" ng-click="cancel()">关闭</button>'+
					'					</div>'+
					'			</div>',
					controller : 'normalConfirmCtrl',
					size: 'md',
					resolve : {
						data : function(){
							return {
								title : title,
								infoDate : infoDate,
								positionName:positionName,
								dates:dates,
								ideaType:ideaType
							};
						}
					}
				});
			},
			infoTime:function(title, infoTime,time,positionName,ideaType){
				return $modal.open({
					template : '<div class="modal-header"  style="background:#f5f5f5;height:50px">'+
					'				<div class="row">'+
					'					<div class="col-sm-7">'+
					'						<h4 class="modal-title">{{info.title}}</h4>'+
					'					</div>'+
					'					<div class="col-sm-5">'+
					'						<button type="button" class="close" ng-click="cancel()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
					'					</div>'+
					'				</div>'+
					'			</div>'+
					'			<div class="modal-body" >'+
					'				<div style="padding-left:6px;margin-bottom:10px">{{info.positionName}}<span ng-if="info.ideaType ==1">-->信息流-图文模式</span>' +
					'				<span ng-if="info.ideaType ==2">-->信息流-三图模式</span><span ng-if="info.ideaType ==3">-->信息流-大图模式</span><span ng-if="info.ideaType ==4">-->信息流-下载图文模式</span>' +
					'				<span ng-if="info.ideaType ==5">-->信息流-下载大图模式</span></div> '	+
					'				<div class="row" style="width:550px;overflow-y: scroll;word-break:break-all;background:#ffffff;vertical-align:middle; text-align:left;padding-left:20px;height:100px;">'+
					'					<div style="color:#A0A0A0">{{info.infoTime}}</div>' +
					'							<span>{{info.time}}</span>'+
					'				</div>'+
					'				<div class="row" style="text-align:center;margin-top:20px">'+
					'						<button type="button" class="btn btn-sm btn-default" ng-click="cancel()">关闭</button>'+
					'					</div>'+
					'			</div>',
					controller : 'normalConfirmCtrl',
					size: 'md',
					resolve : {
						data : function(){
							return {
								title : title,
								infoTime : infoTime,
								positionName:positionName,
								time:time,
								ideaType:ideaType
							};
						}
					}
				});
			},
			infoDateCopies:function(title,dates){
				return $modal.open({
					template : '<div class="modal-header"  style="background:#f5f5f5;height:50px">'+
					'				<div class="row">'+
					'					<div class="col-sm-7">'+
					'						<h4 class="modal-title">{{info.title}}</h4>'+
					'					</div>'+
					'					<div class="col-sm-5">'+
					'						<button type="button" class="close" ng-click="cancel()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
					'					</div>'+
					'				</div>'+
					'			</div>'+
					'			<div class="modal-body" >'+
					'				<div class="row" style="overflow-x: scroll;word-break:break-all;background:#ffffff;vertical-align:middle; text-align:left;margin-right:5px;height:100px;">'+
					'					<table class="table table-striped table-bordered  nomal-font" style="width:95%;border: 1px solid #ddd;margin:0px 10px 0px 10px">'+
					'						<tr >' +
											'<th style="vertical-align:middle; text-align:center;width:50px;min-width:40px">日期</th>'+
					'							<td style="vertical-align:middle; text-align:center;width:100px;min-width:100px" ng-repeat="item in info.dates track by $index" ng-if="item.currentCopies > 0 ">{{item.invDate}}</td>'+											
					'						</tr>' +
					'						<tr >' +
											'<th style="vertical-align:middle; text-align:center;width:50px;min-width:50px">份数</th>'+
					'							<td style="vertical-align:middle; text-align:center;width:100px;min-width:100px" ng-repeat="item in info.dates track by $index" ng-if="item.currentCopies > 0 ">{{item.currentCopies}}</td>'+											
					'						</tr>' +
					'					</table>'+
					'				</div>'+
					'				<div class="row" style="text-align:center;margin-top:20px">'+
					'						<button type="button" class="btn btn-sm btn-default" ng-click="cancel()">关闭</button>'+
					'					</div>'+
					'			</div>',
					controller : 'normalConfirmCtrl',
					size: 'lg',
					resolve : {
						data : function(){
							return {
								title : title,
								dates:dates
							};
						}
					}
				});
			},
			alert : function(title, info,confirm_title){
				return $modal.open({
									   template : '<div class="modal-header"  style="background:#f5f5f5;height:50px">'+
												  '				<div class="row">'+
												  '					<div class="col-sm-7">'+
												  '						<h4 class="modal-title">{{info.title}}</h4>'+
												  '					</div>'+
												  '					<div class="col-sm-5">'+
												  '						<button type="button" class="close" ng-click="cancel()"><span aria-hidden="true">&times;</span>'
												  						+'<span class="sr-only">Close</span></button>'+
												  '					</div>'+
												  '				</div>'+
												  '			</div>'+
												  '			<div class="modal-body" >'+
												  '				<div class="row" style="word-break:break-all;background:#ffffff;vertical-align:middle; text-align:center;">'+
												  '					{{info.info}}'+
												  '				</div>'+
												  '				<div class="row" style="text-align:center;margin-top:20px">'+
												  '						<button type="button" class="btn btn-sm btn-default" ng-click="cancel()">'
												  							+ '{{info.confirm_title}}'+
												  						'</button>'+
												  '					</div>'+
												  '			</div>',
									   controller : 'normalConfirmCtrl',
									   size: 'sm',
									   resolve : {
										   data : function(){
											   if(!confirm_title){
												   confirm_title = "确定";
											   }
											   return {
												   title : title,
												   info : info,
												   confirm_title:confirm_title
											   };
										   }
									   }
								   });
			}
			
		}
	}];
});
