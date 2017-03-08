var express = require('express');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var app = express();
app.set('view engine', 'jade');

// DB settings for model
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = mongoose.model('User', new Schema({
    id: ObjectId,
    firstName: String,
    lastName: String,
    email: { type: String, unique: true},
    password: String
}));

// Connection to mongoDB
mongoose.connect('mongodb://localhost/newauth');

// Middleware
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', function(req, res) {
    res.render('index.jade');
});

app.get('/register', function(req, res) {
    res.render('register.jade')
});

app.post('/register', function(req, res) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });
    user.save(function(err) {
        if(err) {
            var error = 'Aya, Carramba! Try again!';
            if(err.status === 11000) {
                error = 'That email is already taken, try another.';
            }

            res.render('register.jade', {error: error});
        } else {
            res.redirect('/dashboard');
        }
    });
});

app.get('/login', function(req, res) {
    res.render('login.jade')
});

app.post('/login', function (req, res) {
   User.findOne({ email: req.body.email }, function (err, user) {
       if(!user) {
           res.render('login.jade', { error: 'Invalid email or password'});
       } else {
           if(req.body.password === user.password) {
               res.redirect('/dashboard');
           } else {
               res.render('login.jade', { error: 'Invalid email or password'});
           }
       }
   });
});

app.get('/dashboard', function(req, res) {
    res.render('dashboard.jade')
});

app.get('/logout', function(req, res) {
    res.redirect('/')
});


app.listen(3000, function () {
    console.log('Server is listening on port 3000.');
});