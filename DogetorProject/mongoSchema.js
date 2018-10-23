var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


var Schema = mongoose.Schema;

var user = new Schema({

    username: String,
    password: String,
    email: String,
    avatar: String

});

user.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var userData =module.exports = mongoose.model('userData', user);

