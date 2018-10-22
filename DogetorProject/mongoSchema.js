var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var user = new Schema({

    username: String,
    password: String,
    email: String,
    avatar: String

});

module.exports = mongoose.model('userData', user);

