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

app.use(index)
mongoose.connect('mongodb://localhost:27017/userDB', { //connect Database
        useNewUrlParser: true
    },
    function (err) {
        if (err) throw err
        console.log("connect!")
    })

app.use(body())
app.use(express.static(__dirname + '/public'))
app.use(session({ //use express session
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.set('view engine', 'ejs') //set template engine to EJS

app.use(function (req, res, next) {
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    res.locals.edit = req.session.edit
    res.locals.session = req.session
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


var storage = multer.diskStorage({ //storage for dog
    destination: function (req, file, callback) {
        callback(null, __dirname + '/public/image/dog')
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    }
})

var storage2 = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/public/image/user')
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
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
app.post('/editProfile', upload2.single('uploaded_image2'), function (req, res) {
    req.checkBody('username').notEmpty().withMessage('Username is required').isAlphanumeric().withMessage('Username contains only number and alphabet')
    req.checkBody('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email only!!')

    var errors = req.validationErrors()
    if (errors) {
        res.redirect('/home')
    } else {
        if (req.file == undefined) {
            newavatar = req.user.avatar
        } else {
            newavatar = req.file.filename
        }  
        userData.findByIdAndUpdate(req.user.id, {
            username: req.body.username,
            email: req.body.email,
            avatar: newavatar
        }, function (err, book) {

            res.redirect('/home')
        })
    }
})

app.get('/delevent', loggedIn, function (req, res) {
    eventData.findByIdAndDelete(req.query.topic, function (err, book) {
        res.redirect('/home')
    })
})

app.get('/addDog', loggedIn, function (req, res) { //go to addDog page
    dogData.find({
        owner: req.user.id
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
        dogData.find({
            owner: req.user.id
        }, function (err, book) {
            eventData.find({
                owner: req.user.id
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

})
app.post('/home', function (req, res) {
    var try1 = req.body
    eventData.find({
        owner: req.user.id
    }, function (err, docs) {
        var d = []
        for (x of docs) {
            d.push(x.day.toString() + "" + (x.month - 1).toString() + "" + (x.year).toString())
        }
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
            owner: req.user.id
        }, function (err, book) {
            eventData.find({
                owner: req.user.id
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
        newDog = new dogData() //create dog object
        newDog.name = req.body.dogName
        newDog.age = req.body.dogAge
        newDog.breed = req.body.dogBreed
        newDog.owner = req.user.id
        newDog.gender = req.body.gender
        newDog.dis = ""

        if (req.file == undefined) {
            newDog.dogAvatar = 'defaultprofilepicturedogetor.png'
        } else {
            newDog.dogAvatar = req.file.filename
        }
        dogData.findOne({
            name: req.body.dogName,
            owner: req.user.id
        }, function (err, result) {
            if (result) {
                res.redirect('/addDog')
            } else {
                newDog.save(function (err, book) {
                    if (err) {} else {
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


    var tmp = req.body.oldName
    console.log(tmp)
    var errors = req.validationErrors()
    if (errors) {
        dogData.find({
            owner: req.user.id
        }, function (err, book) {
            eventData.find({
                owner: req.user.id
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
            owner: req.user.id
        }, function (err, result) {
            console.log('meet')

            if (!result) {
                console.log(req.body.oldname)
                eventData.updateMany({
                    name: req.body.oldName
                }, {
                    $set: {
                        name: req.body.dogName
                    }
                }, function (err, oo) {
                    dogData.findByIdAndUpdate(req.user.cache, {
                        name: req.body.dogName,
                        age: req.body.dogAge,
                        breed: req.body.dogBreed,
                        owner: req.user.id,
                        gender: req.body.gender,

                    }, function (err, bookuser) {
                        res.redirect('/doginfo?topic=' + req.user.cache)

                    })
                })
            } else if (result.id != req.user.cache) {
                if (result.name == req.body.dogName) {
                    res.redirect('/doginfo?topic=' + req.user.cache)

                } else if (result.name != req.body.dogName) {
                    // eventData.updateMany({name:result.name}, {$set: {name:req.body.dogName }})
                    dogData.findByIdAndUpdate(req.user.cache, {
                        name: req.body.dogName,
                        age: req.body.dogAge,
                        breed: req.body.dogBreed,
                        owner: req.user.id,
                        gender: req.body.gender,

                    }, function (err, bookuser) {
                        res.redirect('/doginfo?topic=' + req.user.cache)
                    })
                }

            } else {
                eventData.updateMany({
                    name: result.name
                }, {
                    $set: {
                        name: req.body.dogName
                    }
                })
                dogData.findByIdAndUpdate(req.user.cache, {
                    name: req.body.dogName,
                    age: req.body.dogAge,
                    breed: req.body.dogBreed,
                    owner: req.user.id,
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
        eventData.updateMany({
            dog: dog.name,
            owner: req.user.id,
        }, {
            dog: "",
            owner: "",
        }, function (err, dell) {

            userData.findByIdAndUpdate(req.user._id, {
                $pull: {
                    dog: req.user.cache
                }
            }, {
                safe: true,
                upsert: true
            }, function (err, book) {
                dogData.findByIdAndUpdate(req.user.cache, {
                    owner: ''
                }, function (err, books) {
                    res.redirect('/home')
                })
            })
        })
    })
})


app.post('/dogInfo', function (req, res) {
    var try2 = req.body
    dogData.findById(req.user.cache, function (err, dogg) {
        eventData.find({
            owner: req.user.id,
            dog: dogg.id
        }, function (err, docs) {
            var d = []
            for (x of docs) {
                d.push(x.day.toString() + "" + (x.month - 1).toString() + "" + (x.year).toString())
            }
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
    })
    if (req.user.dog.includes(topic)) {
        dogData.findById(topic, function (err, book) {
            dogData.find({
                owner: req.user.id
            }, function (err, bookuser) {
                eventData.find({
                    owner: req.user.id,
                    dog: book.id
                }, function (err, docs) {
                    var d = []
                    for (x of docs) {

                        d.push(x.day.toString() + "" + (x.month - 1).toString() + "" + (x.year - 1900).toString())
                    }
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
        owner: req.user.id,
    }, function (err, book) {
        day = req.body.date
        month = req.body.month
        year = req.body.year
        dogData.findById(
            req.user.cache,
            function (err, result) {

                eventData.find({
                    day: day,
                    month: month,
                    year: year,
                    owner: req.user.id,
                    dog: result.id
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
        owner: req.user.id
    }, function (err, book) {
        day = req.body.date
        month = req.body.month
        year = req.body.year
        eventData.find({
            day: day,
            month: month,
            year: year,
            owner: req.user.id

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
    req.checkBody('title').notEmpty().withMessage('Title is required').isAlphanumeric().withMessage('Title contains only number and alphabet')
    req.checkBody('dog').notEmpty().withMessage('Dog name is required')
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

        dogData.findOne({
            name: dog,
            owner: req.user.id
        }, function (err, temp) {
            console.log(title)
            newEvent = new eventData()
            newEvent.title = title
            newEvent.dog = temp.id
            newEvent.name = req.body.dog
            newEvent.owner = req.user.id
            newEvent.descr = descr
            newEvent.time = time
            newEvent.day = day
            newEvent.month = month
            newEvent.year = year
            newEvent.save(function (err, docs) {
                res.redirect('home')
            })
        })
    }
})



app.get('/hosp', loggedIn, function (req, res) {
    // newhos = new hosData()
    // newhos.name = 'test'    
    // newhos.location = 'test'    
    // newhos.open = 'test'
    // newhos.phone = 'test'
    // newhos.pic = 'ThonglorPet.jpg'
    // newhos.save(function(err,docs){
    // console.log(docs)})

    dogData.find({
        owner: req.user.id
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
        owner: req.user.id
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
//     newvet = new vetData()
//     newvet.name = 'test'
//     newvet.surname = 'test'
//     newvet.hos = 'test'
//     newvet.experience = 'test'
//     newvet.pic = 'ThonglorPet.jpg'
//     newvet.save(function(err,docs){
//         console.log(docs)
// })

    dogData.find({
        owner: req.user.id
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
        owner: req.user.id
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
    dogData.findOne({
        name: req.body.dog,
        owner: req.user.id
    }, function (err, ana) {
        dogData.find({
            owner: req.user.id
        }, function (err, book) {            
            res.render('AnalyzeRegOne', {
                info: req.user,
                dog: book,
                ana: ana
            })
        })
    })
})

app.post('/ananymous2', loggedIn, function (req, res) {    
    dogData.find({
        owner: req.user.id
    }, function (err, book) {
        eventData.find({
            owner: req.user.id
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

app.post('/ananymous3', loggedIn, function (req, res) {    
    dogData.findOneAndUpdate({
        name: req.body.info.name,
        owner: req.user.id
    }, {
        dis: req.body.result
    }, function (err, sym) {
        dogData.find({
            owner: req.user.id
        }, function (err, book) {
            eventData.find({
                owner: req.user.id
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




app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/error',
        failureFlash: true
    })
)
app.get('/index', function (req, res) {
    if (req.user) {
        res.redirect('/home')
    } else {
        res.render('Regis', {
            errors: '',
            dupli: ''
        })
    }
})

app.get('/error', function (req, res) {
    res.render('Regis', {
        errors: '',
        dupli: 'Username not found'
    })
})

app.get('/profile', function (req, res) {
    res.send(req.user)
})
app.get('/aboutus', loggedIn, function (req, res) {
    dogData.find({
        owner: req.user.id
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
    res.render('resultUserOne', {
        info: req.body.info,
        sym: req.body.sym,
        result: req.body.result
    })
})

app.listen(port, '161.246.6.34', function () {
    console.log("ready to launch")
})
