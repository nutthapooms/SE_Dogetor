var multer = require('multer')
var mongoose = require('mongoose')
var express = require('express')
var app = express()
var body = require('body-parser')
var userData = require('./routes/mongoSchema')
var dogData = require('./routes/dogSchema')
var hosData = require('./routes/hospSchema')
var eventData = require('./routes/eventSchema')
var vetData = require('./routes/vetSchema')
var flash = require('connect-flash')
var session = require('express-session')
var passport = require('passport')
var index = require('./routes/index')
var expressValidator = require('express-validator')

var LocalStrategy = require('passport-local')
var port = 8080

app.use('/', index)

mongoose.connect('mongodb://localhost:27017/userDB', { //connect Database
        useNewUrlParser: true
    },
    function (err) {
        if (err) throw err
        console.log("connect!")
    })

app.use(body()) 
app.use(express.static(__dirname + '/public'))
app.use(session({                                   //use express session
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.set('view engine', 'ejs')                       //set template engine to EJS

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {  
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']'
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))


var storage = multer.diskStorage({                  //storage for dog
    destination: function (req, file, callback) {
        callback(null, __dirname + '/public/image/dog')
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    }
})

var storage2 = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,  __dirname + '/public/image/user')
    },
    filename: function (req, file, callback) {
        callback(null, Date.now()+file.originalname)
    }
})

var upload = multer({
    storage: storage

})

var upload2 = multer({
    storage: storage2

})
passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    userData.findById(id, function (err, user) {
        done(err, user)
    })
})

app.post('/editProfile', upload2.single('uploaded_image2'), function (req, res) {
    req.checkBody('username').notEmpty().withMessage('Username is required').isAlphanumeric().withMessage('Username contains only number and alphabet')
    req.checkBody('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email only!!')
   
    var errors = req.validationErrors()
    if (errors) {
        res.redirect('/home')
    } else {
        if (req.file == undefined) {
            newavatar = "defaultprofilepicturedogetoruser.jpg"
        } else {
            newavatar = req.file.filename
        }
        
        userData.findByIdAndUpdate(req.user.id,{
            username:req.body.username,
            email:req.body.email,
            avatar:newavatar
        },function(err,book){
            res.redirect('/home')
        })
        
    }
})

app.get('/delevent',loggedIn,function(req,res){

    eventData.findByIdAndDelete(req.query.topic,function(err,book){
        res.redirect('/home')

        
    })



})


app.get('/addDog', loggedIn, function (req, res) {      //go to addDog page
    dogData.find({
        owner: req.user.username
    }, function (err, book) {
        res.render('addDog', {
            info: req.user,
            dog: book,
        })
    })
})
app.get('/home', loggedIn, function (req, res) {

    userData.findOneAndUpdate({
        _id: req.user._id
    }, {
        cache: ''
    }, {
        "new": true,
        "upsert": true
    }, function (err, man) {
        // console.log(req.user.cache)
    })
    dogData.find({
        owner: req.user.username
    }, function (err, book) {
        eventData.find({
            owner: req.user.username
        }, function (err, docs) {
            var d = []
            for (x of docs) {
                d.push(x.day.toString() + "" + (x.month - 1).toString() + "" + (x.year - 1900).toString())
            }
            res.render('homepage', {
                errors: '',
                info: req.user,
                dog: book,
                dupli: '',
                events: d
            })
        })
    })
})
app.post('/home', function (req, res) {
    var try1 = req.body
    // console.log(try1)
    eventData.find({
        owner: req.user.username
    }, function (err, docs) {
        var d = []
        for (x of docs) {
            d.push(x.day.toString() + "" + (x.month - 1).toString() + "" + (x.year).toString())
        }
        // console.log(d)
        res.render('calendar', {
            date: try1.date,
            day: try1.day,
            month: try1.month,
            year: try1.year,
            limit: try1.limit,
            events: d
        })
    })
})
app.post('/addDog', upload.single('uploaded_dogimage'), function (req, res) { //add dog to database
    //////////validator///////////
    req.checkBody('dogName').isAlphanumeric().withMessage('Dog name contains only number and alphabet').notEmpty().withMessage('Dog Name is required')
    req.checkBody('dogAge').isInt({
        min: 0
    }).withMessage('Dog Age must be positive integer').notEmpty().withMessage('Dog age is required')
    req.checkBody('dogBreed', 'Dog Breed is required').notEmpty()
    req.checkBody('gender', 'Gender is required').notEmpty()
    var errors = req.validationErrors()
    
    if (errors) {
        dogData.find({
            owner: req.user.username
        }, function (err, book) {
            eventData.find({
                owner: req.user.username
            }, function (err, docs) {
                var d = []
                for (x of docs) {
                    d.push(x.day.toString() + "" + (x.month - 1).toString() + "" + (x.year - 1900).toString())
                }
                res.render('homepage', {
                    errors: '',
                    info: req.user,
                    dog: book,
                    dupli: '',
                    events: d
                })
            })
        })
    } else {
        newDog = new dogData()     //create dog object
        newDog.name = req.body.dogName
        newDog.age = req.body.dogAge
        newDog.breed = req.body.dogBreed
        newDog.owner = req.user.username
        newDog.gender = req.body.gender
        newDog.dis = ""

        if (req.file == undefined) {
            newDog.dogAvatar = 'defaultprofilepicturedogetor.png'
        } else {
            newDog.dogAvatar = req.file.filename
        }
        dogData.findOne({
            name: req.body.dogName,
            owner: req.user.username
        }, function (err, result) {
            if (result) {
                res.redirect('/addDog')
            } else {
                newDog.save(function (err, book) {
                    if (err) {
                        // console.log(err.code)
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
                        // console.log(book)
                        res.redirect('/home')
                    }
                })
            }
        })
    }
})


app.post('/editDog', loggedIn, function (req, res) {
    //////////validator///////////
    req.checkBody('dogName').isAlphanumeric().withMessage('Dog name contains only number and alphabet').notEmpty().withMessage('Dog Name is required')
    req.checkBody('dogAge').isInt({
        min: 0
    }).withMessage('Dog Age must be positive integer').notEmpty().withMessage('Dog age is required')
    req.checkBody('dogBreed', 'Dog Breed is required').notEmpty()
    req.checkBody('gender', 'Gender is required').notEmpty()

    console.log(req.body)

    var errors = req.validationErrors()
    if (errors) {
        dogData.find({
            owner: req.user.username
        }, function (err, book) {
            eventData.find({
                owner: req.user.username
            }, function (err, docs) {
                var d = []
                for (x of docs) {
                    d.push(x.day.toString() + "" + (x.month - 1).toString() + "" + (x.year - 1900).toString())
                }
                res.render('homepage', {
                    errors: '',
                    info: req.user,
                    dog: book,
                    dupli: '',
                    events: d
                })
            })
        })
    } else {
        dogData.findOne({
            name: req.body.dogName,
            owner: req.user.username
        }, function (err, result) {
            if (result) {
                res.redirect('/doginfo?topic=' + req.user.cache)
            } else {
                dogData.findByIdAndUpdate(req.user.cache, {
                    name: req.body.dogName,
                    age: req.body.dogAge,
                    breed: req.body.dogBreed,
                    owner: req.user.username,
                    gender: req.body.gender,                    

                }, function (err, bookuser) {
                    res.redirect('/doginfo?topic=' + req.user.cache)

                })
            }
        })
    }
})

app.get('/deletedog', function (req, res) {
    dogData.findById(req.user.cache, function (err, dog) {
        // console.log(dog)
        eventData.updateMany({
            dog: dog.name,
            owner: req.user.username,
        }, {
            dog: "",
            owner: "",
        }, function (err, dell) {
            // console.log(dell)
            userData.findByIdAndUpdate(req.user._id, {
                $pull: {
                    dog: req.user.cache
                }
            }, {
                safe: true,
                upsert: true
            }, function (err, book) {
                dogData.findByIdAndRemove(req.user.cache, function (err, books) {
                    res.redirect('/home')
                })
            })
        })
    })

})


app.post('/dogInfo', function (req, res) {
    var try2 = req.body
    // console.log(try2)
    dogData.findById(req.user.cache, function (err, dogg) {
        eventData.find({
            owner: req.user.username,
            dog: dogg.name
        }, function (err, docs) {
            var d = []
            for (x of docs) {
                d.push(x.day.toString() + "" + (x.month - 1).toString() + "" + (x.year).toString())
            }
            // console.log(d)
            res.render('calendar', {
                date: try2.date,
                day: try2.day,
                month: try2.month,
                year: try2.year,
                limit: try2.limit,
                events: d
            })
        })
    })
})
app.get('/dogInfo', loggedIn, function (req, res) {
    var topic = req.query.topic
    userData.findOneAndUpdate({
        _id: req.user._id
    }, {
        cache: topic
    }, {
        "new": true,
        "upsert": true
    }, function (err, man) {
        // console.log(req.user.cache)


    })
    if (req.user.dog.includes(topic)) {
        dogData.findById(topic, function (err, book) {
            dogData.find({
                owner: req.user.username
            }, function (err, bookuser) {
                eventData.find({
                    owner: req.user.username,
                    dog: book.name
                }, function (err, docs) {
                    var d = []
                    for (x of docs) {

                        d.push(x.day.toString() + "" + (x.month - 1).toString() + "" + (x.year - 1900).toString())
                    }
                    // console.log(d)
                    res.render("doginfo", {
                        dogObj: book,
                        info: req.user,
                        dog: bookuser,
                        events: d
                    })
                })
            })
        })
    } else {
        res.redirect('/home')
    }
})
app.post('/eventD', loggedIn, function (req, res) {
    dogData.find({
        owner: req.user.username,
    }, function (err, book) {
        day = req.body.date
        month = req.body.month
        year = req.body.year
        dogData.findById(
            req.user.cache,
            function (err, result) {
                // console.log(result)
                eventData.find({
                    day: day,
                    month: month,
                    year: year,
                    owner: req.user.username,
                    dog: result.name
                }).sort({
                    time: +1
                }).exec(function (err, docs) {

                    res.render('addEvent', {
                        info: req.user,
                        dog: book,
                        select: result.name,

                        date: {
                            day: day,
                            month: month,
                            year: year
                        },
                        event: docs
                    })
                })
            })
    })
})
app.post('/event', loggedIn, function (req, res) {
    dogData.find({
        owner: req.user.username
    }, function (err, book) {
        day = req.body.date
        month = req.body.month
        year = req.body.year

        eventData.find({
            day: day,
            month: month,
            year: year,
            owner: req.user.username

        }).sort({
            time: +1
        }).exec(function (err, docs) {
            res.render('addEvent', {
                info: req.user,
                dog: book,
                select: '',
                date: {
                    day: day,
                    month: month,
                    year: year
                },
                event: docs
            })
        })
    })
})

app.post('/addEvent', loggedIn, function (req, res) {
    req.checkBody('title').notEmpty().withMessage('Title is required')
    req.checkBody('dog').notEmpty().withMessage('Dog name is required').isAlpha().withMessage('')
    req.checkBody('descr').notEmpty().withMessage('Description is required')
    var errors = req.validationErrors()

    if (errors) {
        res.redirect('home')
    } else {
        title = req.body.title
        dog = req.body.dog
        descr = req.body.descr
        time = req.body.time
        day = req.body.day
        month = req.body.month
        year = req.body.year
        newEvent = new eventData()
        newEvent.title = title
        newEvent.dog = dog
        newEvent.owner = req.user.username
        newEvent.descr = descr
        newEvent.time = time
        newEvent.day = day
        newEvent.month = month
        newEvent.year = year
        newEvent.save(function (err, docs) {
            res.redirect('home')
        })
    }
})



app.get('/hosp', loggedIn, function (req, res) {

    // newhos = new hosData()
    // newhos.name = 'test'
    // newhos.location = 'test'
    // newhos.phone = 'test'
    // newhos.open = 'test'
    // newhos.pic = 'ThonglorPet.jpg'

    // newhos.save(function(err,docs){
    //     console.log(docs)
    // })
    dogData.find({
        owner: req.user.username
    }, function (err, book) {
        hosData.find({}, function (err, hos) {
            res.render('hospitalinfo', {
                info: req.user,
                dog: book,
                hos: hos
            })
        })

    })
})

app.get('/hosinfo', loggedIn, function (req, res) {
    hosname = req.query.topic

    dogData.find({
        owner: req.user.username
    }, function (err, book) {
        hosData.find({
            name: hosname
        }, function (err, hos) {
            res.render('hospitalinfo', {
                info: req.user,
                dog: book,
                hos: hos
            })
        })

    })
})

app.get('/hoslike', loggedIn, function (req, res) {
    hosid = req.query.id

    userData.findByIdAndUpdate(
        req.user._id, {
            $addToSet: {
                hos: hosid
            }
        }, {
            "new": true,
            "upsert": true
        },
        function (err) {
            res.redirect('/hosp')
        })
})

app.get('/hosunlike', loggedIn, function (req, res) {
    hosid = req.query.id
    userData.findByIdAndUpdate(
        req.user._id, {
            $pull: {
                hos: hosid
            }
        }, {
            "safe": true,
            "upsert": true
        },
        function (err) {
            res.redirect('/hosp')
        })
})
app.get('/vet', loggedIn, function (req, res) {
    dogData.find({
        owner: req.user.username
    }, function (err, book) {
        vetData.find({}, function (err, vet) {
            res.render('vetInfo', {
                info: req.user,
                dog: book,
                vet: vet
            })
        })
    })
})

app.get('/vetinfo', loggedIn, function (req, res) {
    vetname = req.query.topic
    dogData.find({
        owner: req.user.username
    }, function (err, book) {
        vetData.find({
            name: vetname
        }, function (err, vet) {
            res.render('vetinfo', {
                info: req.user,
                dog: book,
                vet: vet
            })
        })
    })
})

app.get('/vetlike', loggedIn, function (req, res) {
    vetid = req.query.id

    userData.findByIdAndUpdate(
        req.user._id, {
            $addToSet: {
                vet: vetid
            }
        }, {
            "new": true,
            "upsert": true
        },
        function (err) {
            res.redirect('/vet')
        })
})

app.get('/vetunlike', loggedIn, function (req, res) {
    vetid = req.query.id
    userData.findByIdAndUpdate(
        req.user._id, {
            $pull: {
                vet: vetid
            }
        }, {
            "safe": true,
            "upsert": true
        },
        function (err) {
            res.redirect('/vet')
        })
})


app.post('/analyzeReg', loggedIn, function (req, res) {
    // console.log(req.body.dog)
    dogData.findOne({
        name: req.body.dog,
        owner: req.user.username
    }, function (err, ana) {
        dogData.find({
            owner: req.user.username
        }, function (err, book) {
            // console.log(ana)
            res.render('AnalyzeRegOne', {
                info: req.user,
                dog: book,
                ana: ana
            })
        })
    })
})

app.post('/ananymous2',loggedIn, function (req, res) {
    // console.log(req.body.info)
    dogData.find({
        owner: req.user.username
    }, function (err, book) {
        eventData.find({
            owner: req.user.username
        }, function (err, docs) {
            var d = []
            for (x of docs) {
                d.push(x.day.toString() + "" + (x.month - 1).toString() + "" + (x.year - 1900).toString())
            }
            res.render('resultReg', {
                errors: '',
                info: req.user,
                dog: book,
                dupli: '',
                events: d,
                infodog: req.body.info,
                sym: req.body.sym,
                result: req.body.result
            })
        })
    })
})

app.post('/ananymous3',loggedIn, function (req, res) {
    // console.log(req.body.info)
    dogData.findOneAndUpdate({
        name: req.body.info.name,
        owner: req.user.username
    }, {
        dis: req.body.result
    }, function (err, sym) {
        dogData.find({
            owner: req.user.username
        }, function (err, book) {
            eventData.find({
                owner: req.user.username
            }, function (err, docs) {
                var d = []
                for (x of docs) {
                    d.push(x.day.toString() + "" + (x.month - 1).toString() + "" + (x.year - 1900).toString())
                }
                res.render('resultReg', {
                    errors: '',
                    info: req.user,
                    dog: book,
                    dupli: '',
                    events: d,
                    infodog: req.body.info,
                    sym: req.body.sym,
                    result: req.body.result
                })
            })
        })
    })
})

passport.use(new LocalStrategy(
    function (username, password, done) {
        userData.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false)
            }
            if (!(user.validPassword(password))) {
                console.log('not match')
                return done(null, false)
            }
            return done(null, user)
        })
    }
))


app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/error',
        failureFlash: true
    })
)
app.get('/index', function (req, res) {
    // console.log('meet')

    if (req.user) {
        // console.log('logged in')
        res.redirect('/home')
    } else {
        // console.log('not logged in')
        res.render('Regis', {
            errors: '',
            dupli: ''
        })
    }
})

app.get('/error', function (req, res) {
    req.flash('log', "Username or Password is invalid")
    res.redirect('/')

})

app.get('/profile', function (req, res) {
    res.send(req.user)
})
app.get('/aboutus', loggedIn, function (req, res) {
    dogData.find({
        owner: req.user.username
    }, function (err, book) {
        res.render('aboutus', {
            info: req.user,
            dog: book,
        })
    })
})
app.get('/logout', function (req, res) {

    req.logout()
    res.redirect('/')
})

function loggedIn(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.redirect('/')
    }
}

app.get('/analyzeUser', function (req, res) {
    res.render('AnalyzeUserOne')
})

app.get('/dogetor', function (req, res) {
    res.render('Regis', {
        errors: '',
        dupli: ''
    })
})

app.post('/ananymous', function (req, res) {
    // console.log(req.body)
    res.render('resultUserOne', {
        info: req.body.info,
        sym: req.body.sym,
        result: req.body.result
    })
})

app.listen(port,'161.246.6.34', function () {
    console.log("ready to launch")
})