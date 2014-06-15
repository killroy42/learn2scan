var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var async = require('async');
var fs = require('fs');

var LISTEN_PORT = 8000;
var DATA_FOLDER = './data/';
var app, server;


var allowCrossDomain = function() {
	return function(err, req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		// intercept OPTIONS method
		if ('OPTIONS' != req.method) return next();
		res.send(200);
	};
}

app = express();
app.set('json spaces', 0);
app.use(allowCrossDomain());
app.use(logger());
app.use(bodyParser.json());

server = app.listen(LISTEN_PORT, function() {
	console.log('Listening on port', server.address().port);
	
	require('./server')(app);
	require('./client')(app);
	
	app.use(function(req, res, next) {
		console.log('Not Found:', req.url);
		res.send(404, 'Not Found: '+req.url);
	});
	
	app.use(function(err, req, res, next) {
		console.error('Error:', err, err.stack);
		res.send(500, {error: err});
	});
	
	app.server = server;
	return app;
});