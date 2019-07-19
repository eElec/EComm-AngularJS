/// <reference path="angular.min.js"> />
var viewApp = angular.module('viewApp', []);

viewApp.controller('viewController', ($scope, $http) => {
	$scope.productList = [{}];
	$http.get("/api/admin/product/view").then((data) => {
		$scope.productList = data.data;
		console.log(data.data);
	})

	//Bugged vv
	$scope.toggleActive = function (product) {
		$http.post("/api/admin/product/update/activeState", JSON.stringify({
			id: product._id,
			state: !product.isActive
		}))
	}
});