var multer = require('multer')
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var body = require('body-parser');
var userData = require('./routes/mongoSchema');
var dogData = require('./routes/dogSchema');
var flash = require('connect-flash')
var session = require('express-session');
var passport = require('passport')
var index = require('./routes/index');
//var dogRegis = require('./routes/dogRegis');


var LocalStrategy = require('passport-local'),
    Strategy;

var port = 8080;

app.use('/', index);
//app.use('/addDog', dogRegis);



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



app.use(passport.initialize())
app.use(passport.session())

app.use(flash());
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
    if (req.user != null) {
        res.redirect('/home')
    } else {
        res.render('Regis.ejs', {
            errors: '',
            dupli: '' + req.flash('log'),
        })
    }
})

app.get('/addDog', loggedIn, function (req, res) {
    res.render("addDog.ejs", {
        name: req.user.username,
        pic: req.user.avatar
    });
});

app.post('/addDog', function (req, res) {

    newDog = new dogData();
    newDog.name = req.body.dogName
    newDog.age = req.body.dogAge
    newDog.breed = req.body.dogBreed
    newDog.owner = req.user.username
    newDog.gender = req.user.gender
    newDog.dogAvatar = '/default.jpg'

    newDog.save(function (err, book) {
        if (err) {
            console.log(err.code)
        } else {
            userData.findByIdAndUpdate(
                req.user._id, {
                $push: {
                    dog: book._id
                }
            }, {
                "new":true,"upsert": true
            }, function (err, newBook) {
                    if(err){
                        console.log('error')
                    }else{
                        console.log('newBook')
                    }
            })

            console.log(book)
            res.redirect('/addDog')
        }
    })

})
app.get('/home', loggedIn, function (req, res) {
    res.render('homepage.ejs', {
        name: req.user.username,
        pic: req.user.avatar
    });

});


app.get('/dogInfo', loggedIn, function (req, res) {
    res.render("doginfo.ejs");
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        userData.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (!(user.validPassword(password))) {
                console.log('not match')
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    userData.findById(id, function (err, user) {
        done(err, user);
    });
});

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/error',
        failureFlash: true
    })


);

app.get('/error', function (req, res) {
    req.flash('log', "Username or Password is invalid")
    res.redirect('/')

})

app.get('/profile', function (req, res) {
    res.send(req.user)
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/')
})

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

app.listen(port, function () {
    console.log("ready to launch")
});