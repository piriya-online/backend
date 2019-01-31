var config = require('../config.js');

exports.postData = function(req, res, next, control, action, path, postString) {
	var http = require('http');

	var options = {
		host: config.apiPostUrl,
		path: path,
		method: 'POST',
		headers: {
			referer: config.refererUrl,
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postString.length
		}
	};

	var postReq = http.request(options, function(response) {
		response.setEncoding('utf8');
		var data = '';
		response.on('data', function (chunk) {
			data += chunk;
		});
		response.on('end', function (chunk) {
			control.process(req, res, next, action, data);
		});
	});

	postReq.write(postString);
	postReq.end();


}

exports.encrypt = function(text, password) {
	var crypto = require('crypto');
	var cipher = crypto.createCipher(config.crypto.algorithm, password);
	return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

exports.decrypt = function(encrypted, password) {
	var crypto = require('crypto');
	var decipher = crypto.createDecipher(config.crypto.algorithm, password);
	return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}