var mongoose = require('mongoose');



var Schema = mongoose.Schema;


var dog = new Schema({

    name: String,
    age: String,
    breed: String,
    owner: String,
    gender: String

});




module.exports = mongoose.model('dogData', dog);

