var multer = require('multer')
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var body = require('body-parser');
var userData = require('./mongoSchema');
var expressValidator = require('express-validator');
var flash = require('connect-flash')
var session = require('express-session');
var passport = require('passport')
var bcrypt = require('bcrypt-nodejs');


var LocalStrategy = require('passport-local'),
    Strategy;
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
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.set('view engine', 'ejs')

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/public/image');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
});

app.get('/', function (req, res) {
    res.render('Regis.ejs', {
        errors: ''
    });

});

app.post('/', upload.single('uploaded_image'), function (req, res) {

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('pwd', 'Password is required ').notEmpty();
    req.checkBody('Cpwd', 'Password do not match').equals(req.body.pwd);

    var errors = req.validationErrors();

    if (errors) {
        res.render('Regis.ejs', {
            errors: errors
        })
    } else {
        var salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.pwd, salt);
        newuser = new userData();
        newuser.username = req.body.username
        newuser.email = req.body.email
        newuser.password = hash
        newuser.avatar = req.file.filename


        userData.findOne({
            username: newuser.username,


        }, function (err, result) {

            if (result == null) {

                newuser.save(function (err, book) {
                    if (err) {
                        res.send("error register");
                    } else {
                        console.log(book);
                    }
                })

                res.render('Regis.ejs', {
                    errors: ''
                })
            } else {
                res.render('Regis.ejs', {
                    errors: ''
                })

            }
        })
    }

});

passport.use(new LocalStrategy(
    function (username, password, done) {
        userData.getUserByUsername(username, function (err, user) {
            if (err) throw err;

            if (!user) {
                return done(null, false, {
                    message: 'Unknown User'
                })
            }
            userData.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Unknown User'
                    })
                }
            })
        })
    }
))
app.post('/login', function (req, res) {

})

app.listen(port);