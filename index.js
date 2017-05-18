var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 3000

app.use(express.static('StaticPortfolio'));

app.get('/', function(req, res) {
    res.sendfile('index.html');
})

app.use(bodyParser.json({limit: '50mb'}));

app.listen(port, function() {
    console.log('Running on port 3000!');
});