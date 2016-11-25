var express= require('express');
var app=express();
var path=require("path");
var htmlparser=require("htmlparser2");
var request=require('request');
var bodyParser = require('body-parser');
var request=require('superagent');
var promise=require('bluebird');

var options={
  promiseLib: promise
};

var pgp = require('pg-promise')();

var db = pgp('postgres://postgres:postgres@localhost:5432/blog');



app.set('port',process.env.PORT||3000);
app.listen(app.get('port'),function(){
    console.log("Express started press Ctrl+C to terminate");
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:false
}));

app.set('view engine','ejs');

app.set('views', __dirname+'/views');
/*
app.get('/',function(req,res){
    res.render(path.join(__dirname+'/views/index.ejs'));
});*/
 

// for your routes to know where to know if there is param _method DELETE
// it will change the req.method to DELETE and know where to go by setting
// your req.url path to the regular path without the parameters

app.use( function( req, res, next ) {
  if (req.query._method == 'DELETE') {
    req.method = 'DELETE';
    req.url = req.path;
  }
  next();
});




// getting all the blog entries
app.get('/', function(req,res,next){
  
  db.any('SELECT * FROM blogEntries')
    .then(function(data){
      return res.render('index', {data: data})
    })
    .catch(function(err){
      return next(err);
    });
});

// edit blog entry
app.get('/data/:id/edit', function(req,res,next){
// console.log("select post");
  var id = parseInt(req.params.id);
  db.one('select * from blogEntries where id = $1', id)
    .then(function (data) {
      res.render('edit', {data: data})
    })
    .catch(function (err) {
      return next(err);
    });
});

app.post('/data/:id/edit', function(req,res,next){
//  console.log("inside edit post function");
  
  db.none('update blogEntries set subject=$1, message=$2 where id=$3',
    [req.body.subjectLine, req.body.messageTxt, parseInt(req.params.id)])
    .then(function () {
      res.redirect('/');
    })
    .catch(function (err) {
      return next(err);
    });
});

app.get('/data/new', function(req,res,next){
      res.render('new');
});

app.post('/data/new', function(req,res,next){
  db.none('insert into blogEntries (subject,message) values ($1,$2)',
    [req.body.subjectLine, req.body.messageTxt])
    .then(function () {
      res.redirect('/');
    })
    .catch(function (err) {
      return next(err);
    });
});

app.get('/data/:id/show', function(req,res,next){
 //console.log("select post");
  var id = parseInt(req.params.id);
  db.one('select * from blogEntries where id = $1', id)
    .then(function (data) {
      res.render('show', {data: data})
    })
    .catch(function (err) {
      return next(err);
    });
});

app.get('/data/:id/delete', function(req, res, next){
 // console.log("DELETE POST");
  var id = parseInt(req.params.id);
  db.result('delete from blogEntries where id = $1', id)
    .then(function (result) {
      res.redirect('/');
    })
    .catch(function (err) {
      return next(err);
    });
});



