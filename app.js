var request  = require('request');
var express  = require('express');
var markdown = require('markdown-js');
var sys      = require('util');
var config   = require('./config');
var mime     = require('mime');

var app = module.exports = express.createServer();
var port = process.env.PORT || 3000;

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

app.get('/status', function(req,res) {
  res.send({ status: "up"});
});

app.get('/*', function(req,res) {
  var url = 'http://'+config.root+req.url;
  var type = mime.lookup(url);
  var path = 'http://'+config.root+req.url.substr(0,req.url.lastIndexOf("/")+1);
  var encoding = type === "text/plain" ? "utf8" : "binary";

  sys.log("Requesting " + url + " with type " + type);

  request({url:url,encoding:encoding}, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      if (type === "text/plain") {  
        var title = body.split('\n')[0].substr(0,20);
        var content = markdown.makeHtml(body);
        content = content.replace(/<img src="\//g, "<img src=\"" + path);

	res.render("markdown.jade", { title: title || url, dropbox: path, content: content });
      } else {
        res.send(new Buffer(body, 'binary'),{'Content-Type': type}, 200);
      }
    } else if (error) {
      res.render("error.jade", { title: "Error", error: error });
    }
  });
});

app.listen(port);

sys.log("Listening on port " + port);
