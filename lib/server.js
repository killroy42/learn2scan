var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');
var fs = require('fs');

var LISTEN_PORT = 80;
var app, server;

app = express();
app.set('json spaces', 0);

function loadRoutes(app) {

	app.post('/results', function(req, res, next) {
		console.log('New results:', req.body);
		res.send(204);
	});
	
}

server = app.listen(LISTEN_PORT, function() {
	console.log('Listening on port', server.address().port);
	app.use(bodyParser());
	/*
	app.use(function(req, res, next) {
		console.log('Requesting:', req.url);
		return next();
	});
	*/
	
	loadRoutes(app);

	app.get('/', function(req, res, next) {
		console.log('Test', req.body);
		res.send(200);
	});
	
	app.use(function(req, res, next) {
		console.log('Not Found:', req.url);
		res.send(404, 'Not Found: '+req.url);
	});
	app.use(function(err, req, res, next) {
		console.error('Error:', err);
		//next(new Error('Invalid route'));
		res.send(500, {error: err});
	});
	
	
	app.server = server;
	return app;
});