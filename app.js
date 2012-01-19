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

  sys.log("Requesting " + url);
  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      if (type === "text/plain") {  
        res.render("markdown.jade", { title: "Home", markdown: markdown, 
content: body });
      } else {
         res.writeHead(200, {'Content-Type': type});
         res.end(body);
      }
    } else if (error) {
      res.render("error.jade", { title: "Error", error: error });
    }
  });
});

app.listen(port);

sys.log("Listening on port " + port);
