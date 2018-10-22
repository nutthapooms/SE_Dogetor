var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var user = new Schema({

    username: String,
    password: String,
    email: String,
    avatar: String

});

var userData =module.exports = mongoose.model('userData', user);

