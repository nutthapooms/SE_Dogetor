var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dog = new Schema({
    name: String,
    age: Number,
    breed: String,
    owner: String,
    gender: String,
    dogAvatar: String,
    dis:String
});

module.exports = mongoose.model('dogData', dog);