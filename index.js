const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_DB);
const db = mongoose.connection;

db.once('open', function(){
  console.log('db connected');
});

db.on('error', function(err){
  console.log('db error : ', err);
});

const contactSchema = mongoose.Schema({
  name:{type:String, required:true, unique: true},
  age:{type:Number},
  email:{type:String},
  address:{type:String}
});

const Contact = mongoose.model('contact', contactSchema);

app.get('/', function(req, res){
  res.redirect('/contacts');
});

app.get('/contacts', function(req, res){
  Contact.find({}, function(err, contacts){
    if(err) return res.json(err);
    res.render('contacts/index', {contacts:contacts});
  });
});

app.get('/contacts/new', function(req, res){
  res.render('contacts/new');
});

app.post('/contacts', function(req, res){
  Contact.create(req.body, function(err, contacts){
    if(err) return res.json(err);
    res.redirect('/contacts')
  });
});

const port = 3000;
app.listen(port, function(){
  console.log('server on');
});