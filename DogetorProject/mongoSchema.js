var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');



var Schema = mongoose.Schema;


var user = new Schema({

    username: { type: String },
    password: { type: String},
    email: { type: String, required: true, unique: true },
    avatar: String

});

user.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('userData', user);

