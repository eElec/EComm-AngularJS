const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

//For File Uploads
const multer = require('multer');
const upload = multer({
	dest: "public/temp/img/"
});

//Parser
const parseBody = bodyParser.urlencoded({ extended: true });	
const parseJson = bodyParser.json();
//Mongo Connect
const mongoose = require("mongoose");
const Product = require("../models/productSchema.js");
const Order = require("../models/ordersSchema.js");
const mongoUrl = "mongodb+srv://elec:elec@maymay-b5q4y.mongodb.net/eComm?retryWrites=true";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });

//View Product
router.route('/admin/product/view')
	.get((req, res) => {
		Product.find({}, (err, product) => {
			return res.json(product);
		})
	});

//Add product
router.route('/admin/product/add/')
	.post(upload.single('image'), (req, res) => {
		var imageType = "";
		if (req.file.mimetype == "image/png") {
			imageType = '.png';
		}
		else if (req.file.mimetype == "image/jpeg") {
			imageType = '.jpeg';
		}
		fs.rename(req.file.path, req.file.path + imageType, (err) => {
			if (err) console.log('Error Uploading file')
		})
		var newProduct = new Product({
			name: req.body.model,
			brand: req.body.brand,
			desc: req.body.desc,
			uploadedOn: new Date(),
			isActive: true,
			price: req.body.price,
			stock: req.body.stock,
			image: { path: (req.file.destination).slice(7), name: req.file.filename + imageType },
		});

		newProduct.save().then(result => {
			res.redirect("/admin/page/Product/Add/ProductAdd.html");
		}).catch(err => console.log(err));
	});

//Edit product
router.route('/admin/product/update/')
	.post(parseBody, (req, res) => {
		Product.findByIdAndUpdate({ _id: req.body.PID },
		{
			name: req.body.model,
			brand: req.body.brand,
			desc: req.body.desc,
			uploadedOn: new Date(),
			price: req.body.price,
			stock: req.body.stock
		},
		(err, prod) => {
			if (err) { console.log(err) }
			res.redirect('/admin/page/Product/View/ProductView.html')
		})
	});

router.route('/admin/product/update/activeState')
	.post(parseJson, (req, res) => {
		Product.updateOne({ _id: req.body.id }, { isActive: req.body.state }, (err) => {
			if (err) { console.log(err) }
		}).then(() => {
			res.sendStatus(200);
		})
	})

// Order
router.route('/admin/product/order/place')
	.post(parseJson, (req, res) => {
		console.log(req.body);
		Order.updateOne({ _id: req.body._id }, { status: 0 }, (err, raw) => {
			if (err) { console.log(err); }
		});
		Product.updateOne({ _id: req.body.productId }, { $inc: { stock: -1 } }, (err, raw) => {
			if (err) { console.log(err); }
		});

		res.redirect('/admin/page/OrderView/order.html');
	})

router.route('/admin/product/order/cancel')
	.post(parseJson, (req, res) => {
		console.log(req.body);
		Order.updateOne({ _id: req.body._id }, { status: -1 }, (err, raw) => {
			if (err) { console.log(err); }
		});
		Product.updateOne({ _id: req.body.productId }, { $inc: { stock: 1 } }, (err, raw) => {
			if (err) { console.log(err); }
		});

		res.redirect('/admin/page/OrderView/order.html');
	})

router.route('/admin/product/order/done')
	.post(parseJson, (req, res) => {
		console.log(req.body);
		Order.updateOne({ _id: req.body._id }, { status: 1 }, (err, raw) => {
			if (err) { console.log(err); }
		});

		res.redirect('/admin/page/OrderView/order.html');
	})

module.exports = router;