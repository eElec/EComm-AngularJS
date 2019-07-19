const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

//For File Uploads
const multer = require('multer');
const upload = multer({
	dest: "public/temp/img/"
});

//Parser
const parseBody = bodyParser.urlencoded({ extended: true });	
const parseJSON = bodyParser.json();

//Mongo Connect
const mongoose = require("mongoose");
const Product = require("../models/productSchema.js");
const Order = require("../models/ordersSchema.js");

router.route('/product/view/active/:id')
	.get((req, res) => {
		Product.findById({ _id: req.params.id }, (err, product) => {
			if (err) { console.log(err) }
			return res.json(product);
		})
	});

router.route('/product/view/active')
	.get((req, res) => {
		Product.find({isActive: true}, (err, product) => {
			return res.json(product);
		})
	});

//Cart
router.route('/product/view/cart')
	.post(parseJSON, (req, res) => {
		var cartItem = req.body;
		var cartItemDetails = [];

		if (cartItem.length == 0) {
			return res.statusCode(400)
		}
		cartItem.forEach((value, index) => {
			Product.find({ _id: value.id }, (err, product) => {
				if (err) {console.log(err)}
				cartItemDetails.push(product[0]);
			})
		})
		res.json(cartItemDetails)
	})

//PlaceOrder
router.route('/product/order')
	.post(parseBody, cookieParser(), (req, res) => {
		var cartItems = JSON.parse(req.cookies.cartItems)


		
		cartItems.forEach((item, index) => {
			var newOrder = new Order({
				productId: item._id,
				customerId: 1,
				customerName: req.body.name,
				orderedOn: new Date(),
				mobile: req.body.number,
				address: req.body.address,
				locationType: req.body.adrType,
				amount: item.amount,
				price: item.price * item.amount,
			});
			newOrder.save().then(result => {
				res.redirect("/account");
			}).catch(err => console.log(err));;
			Product.updateOne({ _id: item._id }, { $inc: { stock: (-1)*item.amount } }, (err, raw) => {
				if (err) { console.log("Product Update Error: " + err) }
			})
		})

	})
	.get((req, res) => {
		Order.find({ customerId: req.query.customerId }, (err, order) => {
			res.json(order);
		})
	})

//CancelOrder
router.route('/product/order/cancel')
	.post(parseJSON, (req, res) => {
		console.log(req.body);
		Order.updateOne({ _id: req.body._id }, { status: -1 }, (err, raw) => {
			if (err) { console.log(err);}
		});
		Product.updateOne({ _id: req.body.productId }, { $inc: { stock: 1 } }, (err, raw) => {
			if (err) { console.log(err); }
		});

		res.redirect('/order');
	})
//Place

module.exports = router;