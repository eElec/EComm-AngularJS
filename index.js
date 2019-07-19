const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

//Render
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

// Static Files
app.use(express.static("public"));
app.use(express.static("public/site"));
app.use(express.static("public/admin"));

// [API]
const api = require('./routes/AdminApi');
const customerapi = require('./routes/CustomerApi');
app.use('/api', api);
app.use('/api', customerapi);
// [//API]


// [Main]
app.get('/', (req,res)=>{
	res.sendFile(__dirname + '/site/index.html')
});

app.get('/product', (req, res) => {
	res.sendFile(__dirname + '/public/site/product.html');
});

app.get('/cart', (req, res) => {
	res.sendFile(__dirname + '/public/site/cart.html');
});

app.get('/account', (req, res) => {
	res.sendFile(__dirname + '/public/site/account.html');
});

app.get('/order', (req, res) => {
	res.sendFile(__dirname + '/public/site/orders.html');
})

// [//Main]


// [Admin]
app.get('/admin', (req, res)=>{
	res.sendFile(__dirname + '/admin/index.html')
});
app.get('/admin/page/Product/edit', (req, res) => {
	res.sendFile(__dirname + '/public/admin/page/Product/Edit/edit.html')
})
// [//Admin]
	

// Server Listen
var PORT = process.env.PORT || 3000
 app.listen(PORT, ()=>{
	 console.log(`Listening on Port ${PORT}.`);
 });