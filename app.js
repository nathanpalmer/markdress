var request = require('request');
var express = require('express');
var markdown = require('markdown-js')
var app = module.exports = express.createServer();

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

app.get('/*', function(req,res) {
	request('http:/'+req.url, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			res.render("index.jade", { title: "Home", markdown: markdown, content: body });
		}
	});
});

app.listen(3000);