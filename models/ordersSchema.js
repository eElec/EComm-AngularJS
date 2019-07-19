const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

/*
 *	Status
 *	-1 = Canceled
 *	 0 = Pending
 *	 1 = Successful
 */

const orderDetail = mongoose.Schema(
	{
		productId: String,
		customerId: String,
		customerName: String,
		orderedOn: Date,
		mobile: Number,
		address: String,
		locationType: String,
		amount: Number,
		price: Number,
		status: { type: Number, default: 0 } 
	}
);
orderDetail.plugin(AutoIncrement, { inc_field: 'orderNumber' })
module.exports = mongoose.model('orderDetail', orderDetail)