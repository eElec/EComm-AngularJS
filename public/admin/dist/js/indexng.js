/// <reference path="angular.min.js"> />
var orderApp = angular.module('orderApp', []);

orderApp.controller('orderCtrl', ($scope, $http, $location) => {
	$scope.orders = [];

	$http({
		url: '/api/product/order',
		method: "GET",
		params: { customerId: '1' }
	}).then((data) => {
		data.data.forEach((value, index) => {
			if (value.status == 0) {
				value.statusValue = "On the way";
			}
			else if (value.status < 0) {
				value.statusValue = "Canceled";
			}
			else {
				value.statusValue = "Successful";
			}
			$scope.orders.push(value);
		})
	})

	$scope.cancelOrder = (order) => {
		$http.post('/api/product/order/cancel', order);
		location.reload();
	}
	$scope.placeOrder = (order) => {
		$http.post('/api/admin/product/order/place', order);
		location.reload();
	}
	$scope.orderDone = (order) => {
		$http.post('/api/admin/product/order/done', order);
		location.reload();
	}
});