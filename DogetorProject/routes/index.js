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
        callback(null, 'D:/SE_Dogetor/DogetorProject/public/image/user');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now()+file.originalname);
    }
});

var upload = multer({
    storage: storage
});


router.post('/', upload.single('uploaded_image'), function (req, res) {
    req.checkBody('username').notEmpty().withMessage('Username is required').isAlphanumeric().withMessage('Username contains only number and alphabet')
    req.checkBody('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email only!!')
    req.checkBody('pwd').notEmpty().withMessage('Password is required ').isAlphanumeric().withMessage('Password contains only number and alphabet')
    req.checkBody('Cpwd', 'Password  not match').equals(req.body.pwd);
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
        newuser.cache = ''

        if (req.file == undefined) {
            newuser.avatar = "defaultprofilepicturedogetoruser.jpg"
        } else {
            newuser.avatar = req.file.filename
        }

        newuser.save(function (err, book) {
            if (err) {
                console.log(err.code);

                res.render('Regis.ejs', {
                    errors: '',
                    dupli: 'Username or email is already in use'

                })
            } else {
                res.render('Regis.ejs', {
                    errors: '',
                    dupli: 'Registration Success'

                })
            }
        })
    }
});


router.get('/', function (req, res) {

    res.redirect('/index')


});


module.exports = router