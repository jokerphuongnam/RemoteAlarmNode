'use_strict'

var express = require('express');
var app = express();
var url = require('url')
var fs = require('fs')
app.use(express.static(__dirname + '/'));
app.get('/', function(req, res){
    fs.readFile('Home.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
});

app.get('/AboutUs.html', function(req, res){
    fs.readFile('AboutUs.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
});

app.get('/Lost.html', function(req, res){
    fs.readFile('Lost.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
});

app.get('/SignIn.html', function(req, res){
    fs.readFile('SignIn.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
});

app.get('/SignUp.html', function(req, res){
    fs.readFile('SignUp.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
});



app.listen(process.env.PORT || 5000, () => {
    console.log('Server running')

});