var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');
var fs = require('fs');

var LISTEN_PORT = 80;
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

app.use(allowCrossDomain);

function loadRoutes(app) {

	app.post('/results', function(req, res, next) {
		console.log('New results for:', req.body.time);
		
		var results = req.body;

		if(results.time && results.hits.length > 0) {
			results.hits = results.hits.map(function(item) {
				item.x = item.x|0;
				item.y = item.y|0;
				return item;
			});
			var fileName = results.time.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2}).*$/, '$1$2$3_$4$5$6.json');
			fileName = DATA_FOLDER + fileName;
			var writeData = JSON.stringify(results);
			fs.writeFile(fileName, writeData, {encoding: 'utf8'}, function(err, written, buffer) {
				if(err) return console.error(err);
				console.log('File '+fileName+' written.');
			});
		}
		
		res.send(204);
	});
	
}

server = app.listen(LISTEN_PORT, function() {
	console.log('Listening on port', server.address().port);
	app.use(bodyParser());
	
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
		console.error('Error:', err, err.stack);
		res.send(500, {error: err});
	});
	
	
	app.server = server;
	return app;
});