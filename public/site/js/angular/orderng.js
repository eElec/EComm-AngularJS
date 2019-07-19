// <reference path="angular.min.js"/>

var orderApp = angular.module("orderApp", [])

orderApp.controller("orderCtrl", ($scope, $http, $location) => {
	removeCookie("cartItems");
	$scope.Products = [];
	$scope.ProductInfo = [];
	$http({
		url: '/api/product/order',
		method: "GET",
		params: { customerId: '1'}
	}).then((data) => {
		data.data.forEach((value, index) => {
			if (value.status == 0) {
				value.statusValue = "On the way";
			}
			else if (value.status < 0) {
				value.statusValue = "Canceled";
			}
			else{
				value.statusValue = "Successful";
			}
			$scope.Products.push(value);
			
			})
		}).then(() => {
			$scope.Products.forEach((value, index) => {
				$http.get(`/api/product/view/active/${value.productId}`).then((data) => {
					$scope.ProductInfo.push(data.data);
				})
			})
		})

	$scope.cancelOrder = (order) => {
		$http.post('/api/product/order/cancel', order);
		location.reload();
	}
})


//Cookie Functions
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function removeCookie(cname) {
	document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}
