var express = require('express')
var router = express.Router();
var multer = require('multer')
var userData = require('./mongoSchema');
var expressValidator = require('express-validator');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var flash = require('connect-flash')

router.use(flash());
router.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

router.use(expressValidator({
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

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'D:/SE_Dogetor/DogetorProject/public/image');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
});


router.post('/', upload.single('uploaded_image'), function (req, res) {
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('pwd', 'Password is required ').notEmpty();
    req.checkBody('Cpwd', 'Password do not match').equals(req.body.pwd);
    var errors = req.validationErrors();
    if (errors) {
        res.render('Regis.ejs', {
            errors: errors,
            dupli: ''
        })
    } else {
        var salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.pwd, salt);
        newuser = new userData();
        newuser.username = req.body.username
        newuser.email = req.body.email
        newuser.password = hash
        newuser.avatar = req.file.filename

        newuser.save(function (err, book) {
            if (err) {
                console.log(err.code);

                res.render('Regis.ejs', {
                    errors: '',
                    dupli: 'Username or Email is already in use '

                })
            } else {
                console.log(book);
                res.redirect("/")
            }
        })
    }
});


router.get('/', function (req, res) {
    if (req.user != null) {
        res.redirect('/home')
    } else {
        res.render('Regis.ejs', {
            errors: '',
            dupli: '' + req.flash('log'),
        })
    };
});

module.exports = router