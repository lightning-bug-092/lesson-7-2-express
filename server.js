// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const app = express();
var pug = require('pug');
var bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

app.set('view engine', 'pug');
app.set('views','./views');

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

db.defaults({ books:[] })
  .write();
app.get('/',function(req,res){
  res.render('index.pug');
})
app.get('/books',function(req,res){
  var books = db.get('books').value();
  res.render('./books.pug',{
    books: books
  })
})
app.get('/books/create',function(req,res){
  res.render('./create.pug')
})
app.post('/books/create',function(req,res){
  req.body.id = db.get('books').value().length+1;
  db.get('books').push(req.body).write();
  res.redirect('/books');
  
})
app.get('/books/:id/update',function(req,res){
  res.render('./update.pug');
})
app.post('/books/:id/update',function(req,res){
  var id = parseInt(req.params.id);
  db.get('books').find({id: id}).assign({description: req.body.description}).write();
  res.redirect('/books');
})
app.get('/books/:id/delete',function(req,res){
  var id = parseInt(req.params.id);
  var book = db.get('books').find({id: id}).value();
  res.render('./delete.pug',{
    book: book
  })
})
app.post('/books/:id/delete',function(req,res){
  var id = parseInt(req.params.id);
  db.get('books').remove({id: id}).write();
  res.redirect('/books');
})
// https://expressjs.com/en/starter/basic-routing.html
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
