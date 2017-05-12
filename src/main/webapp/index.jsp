<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" scope="session"></c:set>
<!-- 加版本号防止浏览器缓存 -->
<c:set var="sysVersion" value="${applicationScope.SysVersion}" scope="session"></c:set>

<c:set var="test" value="123456test"></c:set>
<html ng-app="myApp">
<head>
<link rel="shortcut icon" href="${ctx}/res/favicon.ico"/>
<title>myApp test</title>
<%@include file="/common.jsp"%>
<script type="text/javascript">
// 	$(function(){
		var ctx = '${ctx}';
		var sysVersion = '${sysVersion}';
// 		alert('${ctx}:--:${sysVersion} --- ${test}');
// 	});
</script>
</head>
<!-- <body ng-controller="myCtrl"> -->
<body>
	<h2>Hello World!</h2>
	<a href="${ctx}/test-search">查询数据</a>
	<a href="${ctx}/#/chart">查看报表</a>
	<a href="${ctx}/#/upload">上传XLS数据</a>
	<a href="${ctx}/#/download">下载数据</a>
	<a href="${ctx}/#/choseCheckBox">checkbox</a>
	<a href="${ctx}/#/collapse">collapse-checkbox</a>
	<a href="${ctx}/#/index">回首页</a>
	<hr style="border-top-color: red;"/>
	<div ng-view class="row col-md-12"></div>
	<toaster-container toaster-options="{'time-out': 3000, 'close-button':true, 'position-class': 'toast-bottom-right'}"></toaster-container>
	<br><br><br><br>
	<hr style="border-top-color: blue;"/>
	<h2>this is bottom!</h2>
</body>
</html>
