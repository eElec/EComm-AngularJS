const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ProductDetail = mongoose.Schema(
	{
		name: String,
		brand: String,
		desc: String,
		uploadedOn: Date,
		isActive: Boolean,
		price: Number,
		stock: { type: Number, min: 0 },
		image: { path: String, name: String }
	}
);
ProductDetail.plugin(AutoIncrement, {inc_field: 'id'})
module.exports = mongoose.model('ProductDetail', ProductDetail)