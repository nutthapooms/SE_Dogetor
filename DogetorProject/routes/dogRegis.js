var express = require('express')
var router = express.Router();
var multer = require('multer')
var dogData = require('./dogSchema');
var userData = require('./mongoSchema');
var expressValidator = require('express-validator');

router.get('/addDog', loggedIn, function (req, res) {
    res.render("addDog", {
        name: req.user.username,
        pic: req.user.avatar
    });
});

router.post('/addDog',function(req,res){

    newDog = new dogData();
    newDog.name = req.body.dogName
    newDog.age = req.body.dogAge
    newDog.breed = req.body.dogBreed
    newDog.owner = req.user.username
    newDog.gender = req.user.gender
    newDog.dogAvatar = '/default.jpg'

    newDog.save(function(err,book){
        if(err){
            console.log(err.code)
        }else{
            userData.findByIdAndUpdate(req.user._id,{"$push":{"dog":book._id}})
        }
    })




})

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = router