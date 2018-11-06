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
var expressValidator = require('express-validator');



var LocalStrategy = require('passport-local')
   

var port = 8080;

app.use('/', index);

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

// imageFilter = function (req, file, cb) {
    
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/public/image/dog');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
    // fileFilter: imageFilter
});



app.get('/addDog', loggedIn, function (req, res) {

    dogData.find({
        owner: req.user.username
    }, function (err, book) {
        res.render('addDog.ejs', {
            username: req.user.username,
            pic: req.user.avatar,
            dog: book,
            amount: book.length
        });
    })
});

app.get('/index', function (req, res) {

    if (req.user) {
        console.log('ogged in')
        res.redirect('/home')
    } else {
        console.log('not logged in')
        res.render('Regis.ejs', {
            errors: '',
            dupli: '' 
        })
    }

});

app.post('/addDog', upload.single('uploaded_dogimage'), function (req, res) {

    req.checkBody('dogName', 'Dog Name is required ').notEmpty()
    req.checkBody('dogAge', 'Dog Age is required ').notEmpty()
    req.checkBody('dogAge', 'Dog Age must be number ').isNumeric();
    req.checkBody('dogBreed', 'Dog Breed is required').notEmpty()
    req.checkBody('gender', 'Gender is required').notEmpty()
    

    var errors = req.validationErrors()

    if (errors  ) {
        dogData.find({
            owner: req.user.username
        }, function (err, book) {
            res.render('homepage', {
                errors: errors,
                username: req.user.username,
                pic: req.user.avatar,
                dog: book,
                amount: book.length
            });
        })
    } else {

        newDog = new dogData();
        newDog.name = req.body.dogName
        newDog.age = req.body.dogAge
        newDog.breed = req.body.dogBreed
        newDog.owner = req.user.username
        newDog.gender = req.body.gender


        if (req.file == undefined) {
            newDog.dogAvatar = 'defaultprofilepicturedogetor.png'
        } else {
            newDog.dogAvatar = req.file.filename
            console.log(req.file.mimetype)
            
        }

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
                        "new": true,
                        "upsert": true
                    },
                    function (err, newBook) {
                        if (err) {
                            console.log('error')
                        } else {
                            console.log('newBook')
                        }
                    })

                console.log(book)
                res.redirect('/home')
            }
        })
    }
})
app.get('/home', loggedIn, function (req, res) {
    dogData.find({
        owner: req.user.username
    }, function (err, book) {
        res.render('homepage.ejs', {
            errors: '',
            username: req.user.username,
            pic: req.user.avatar,
            dog: book,
            amount: book.length
        });
    })
    


});
app.post('/home',function(req,res){
    var try1 = req.body;
    console.log(try1);
    res.render('calendar',{
        date : try1.date,
        day : try1.day,
        month : try1.month,
        year : try1.year,
        limit:try1.limit
    });
    res.end();
})


app.get('/dogInfo', loggedIn, function (req, res) {
    var topic = req.query.topic

    if (req.user.dog.includes(topic)) {

        dogData.findById(topic, function (err, book) {
            dogData.find({
                owner: req.user.username
            }, function (err, bookuser) {
                res.render("doginfo", {
                    dogName: book.name,
                    breed: book.breed,
                    gender: book.gender,
                    age: book.age,
                    dogPic: book.dogAvatar,
                    username: req.user.username,
                    pic: req.user.avatar,
                    dog: bookuser,
                    amount: bookuser.length
                });
            })

        })
    } else {
        res.redirect('/home')
    }


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