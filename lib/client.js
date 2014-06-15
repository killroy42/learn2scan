var express = require('express');

module.exports = function(app) {
	console.info('Starting client ...');
	
	app.use('/', express.static('./client'));
	
}
