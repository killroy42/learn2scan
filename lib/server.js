var fs = require('fs');


var DATA_FOLDER = './data/';

module.exports = function(app) {
	console.info('Starting server ...');

	app.post('/results', function(req, res, next) {
		var results = req.body;
		console.log('New results for:', results.time);

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
