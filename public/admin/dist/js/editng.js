/// <reference path="angular.min.js"> />
var editApp = angular.module('editApp', []);

editApp.controller('editCtrl', ($scope, $http, $location) => {
	var pd_url = new URL($location.absUrl());
	var pd_id = pd_url.searchParams.get('id');

	$scope.product = {};
	$http.get(`/api/product/view/active/${pd_id}`).then((data) => {
		$scope.product = data.data;
	});

});