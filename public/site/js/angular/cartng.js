// <reference path="angular.min.js"/>

var cartApp = angular.module("cartApp", [])

cartApp.controller("cartCtrl", ($scope, $http) => {
	var cartCookie = getCookie("cartItems");
	$scope.cartItems = [];
	if (cartCookie != "") {
		$scope.cartItems = JSON.parse(cartCookie);
	}
	document.getElementById('cartItemNo').innerText = $scope.cartItems.length;
	$scope.itemAmount = $scope.cartItems.length;

	$scope.totalPrice = 0;
	$scope.cartItems.forEach((value) => {
		$scope.totalPrice += value.price;
	})

	//Remove from cart
	$scope.removeFromCart = (item) => {
		$scope.cartItems.forEach((value, index) => {
			if (value == item) {
				$scope.cartItems.splice(index, 1);
				found = true;
				console.log($scope.cartItems);

				$scope.totalPrice -= value.price;
				$scope.itemAmount-=1;
				document.getElementById('cartItemNo').innerText = $scope.cartItems.length;

				setCookie("cartItems", JSON.stringify($scope.cartItems), 3);
				return;
			}
		});
	}
});

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

