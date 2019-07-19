// <reference path="angular.min.js"/>

var productApp = angular.module("productApp", [])

productApp.controller("productCtrl", ($scope, $http, $location) => {
	var pd_url = new URL($location.absUrl());
	var pd_id = pd_url.searchParams.get('id');

	$scope.product = {};
	$http.get(`/api/product/view/active/${pd_id}`).then((data) => {
		$scope.product = data.data;
	});

	//Populate the cart
	var cartCookie = getCookie("cartItems");
	var cartItems = [];
	if (cartCookie != "") {
		cartItems = JSON.parse(cartCookie);
	}
	
	document.getElementById('cartItemNo').innerText = cartItems.length;

	$scope.addToCart = (product) => {
		console.log(`Adding to Cart id: ${product._id}`)
		var found = false;

		cartItems.forEach((value, index) => {
			if (value._id == product._id) {
				cartItems[index].amount += 1;
				found = true;
				setCookie("cartItems", JSON.stringify(cartItems), 3);
				document.getElementById('cartItemNo').innerText = cartItems.length;
				alert(`Another ${product.name} has been added to cart`)
				return;
			}
		});

		if (!found) {
			product.amount = 1;
			cartItems.push(product);
			setCookie("cartItems", JSON.stringify(cartItems), 3);
			document.getElementById('cartItemNo').innerText = cartItems.length;
			alert(`${product.name} has been added to cart`)
		}
		return
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

