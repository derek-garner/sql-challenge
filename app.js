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

var pgp = require('pg-promise')(options);

var db = pgp('postgres://localhost:5432/blog');

var routes = require('./routes/index');

app.use('/', routes);
app.set('port',process.env.PORT||3000);
app.listen(app.get('port'),function(){
    console.log("Express started press Ctrl+C to terminate");
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:false
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/',function(req,res){
    res.render(path.join(__dirname+'/views/index.html'));
});
 

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

// getting all the users
app.get('/', function(req,res,next){
  db.any('SELECT * FROM myBlogEntries')
    .then(function(data){
      return res.render('index', {data: data})
    })
    .catch(function(err){
      return next(err);
    });
});

// edit users
app.get('/users/:id/edit', function(req,res,next){
  var id = parseInt(req.params.id);
  db.one('select * from myBlogEntries where id = $1', id)
    .then(function (user) {
      res.render('edit', {user: user})
    })
    .catch(function (err) {
      return next(err);
    });
});

app.post('/users/:id/edit', function(req,res,next){
  db.none('insert into myBlogEntries (subject,msg) values ($1,$2)',
    [req.body.subject, req.body.email])
    .then(function () {
      res.redirect('/');
    })
    .catch(function (err) {
      return next(err);
    });
});

app.post('/users/:id/edit', function(req,res,next){
  db.none('update myBlogEntries set subject=$1, msg=$2',
    [req.body.subject, req.body.msg])
    .then(function () {
      res.redirect('/');
    })
    .catch(function (err) {
      return next(err);
    });
});

app.delete('/users/:id', function(req, res, next){
  var id = parseInt(req.params.id);
  db.result('delete from myBlogEntries where id = $1', id)
    .then(function (result) {
      res.redirect('/');
    })
    .catch(function (err) {
      return next(err);
    });
});

app.listen(3000, function(){
  console.log('Application running on localhost on port 3000');
});
