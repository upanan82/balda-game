'use strict';

var express = require('express'),
    app = express(),
    find = require('find-in-files'),
    bodyParser = require('body-parser'),
    path = require('path');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/index.html'));
});

// Word verification
app.post('/word', function(req, res) {
    find.find(' ' + req.body.word + ',', 'lib', '.txt').then(function(results) {
        var rez;
        for (var result in results) rez = results[result];
        if (rez) res.end('OK');
        else res.end('');
    });
});

// Listen port
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});