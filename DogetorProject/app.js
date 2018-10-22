var mongoose = require('mongoose');
var express = require('express');
var app = express();
var body = require('body-parser');
var userData = require('./mongoSchema');
var port = 8080;

mongoose.connect('mongodb://localhost:27017/userDB', {
        useNewUrlParser: true
    },

    function (err) {
        if (err) throw err;
        console.log("connect!");
    });

app.use(body());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')


app.get('/', function (req, res) {
    res.render('Regis.ejs');

});
app.get('/home', function (req, res) {
    res.render('homepage.ejs');

});

app.post('/', function (req, res) {
    var newuser = new userData();

    
    newuser.username = req.body.username;
    newuser.email = req.body.email
    newuser.password = req.body.pwd;

    newuser.save(function (err, book) {
        if (err) {
            res.send("error register");
        } else {
            console.log(book);

        }
    })

    res.render('Regis.ejs')
});


app.listen(port);