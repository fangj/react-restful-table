var path=require('path');
var express = require('express');
var expressRestResource = require('express-rest-resource');
var nedb = require('nedb');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));


var postDb = new nedb({ filename: 'postDb', autoload: true });

app.use('/api/post', expressRestResource({ db: postDb }));

app.listen("3000");