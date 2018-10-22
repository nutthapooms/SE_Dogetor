var multer = require('multer')
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
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/public/image');
    },
    filename: function (req, file, callback) {
        callback(null,file.originalname);
    }
});

var upload = multer({
    storage: storage
});



app.post('/', upload.single('uploaded_image'), function (req, res) {

    
var newuser = new userData();
    newuser.username = req.body.username;
    newuser.email = req.body.email;
    newuser.password = req.body.pwd;
    newuser.avatar = req.file.filename;  

    newuser.save(function (err, book) {
        if (err) {
            res.send("error register");
        } else {
            console.log(book);

        }
    });


    res.render('Regis.ejs')
});




app.listen(port);