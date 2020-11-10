'use_strict'

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();

// resouce file 
app.use(express.static(__dirname + '/'));

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));


// include router
var router = require('./router.js');
app.use('/',router)

// chay server
app.listen(process.env.PORT || 5000, () => {
    console.log('Server running')
});