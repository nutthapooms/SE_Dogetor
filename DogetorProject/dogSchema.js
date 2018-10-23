var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var dog = new Schema({

    name: String,
    breed: String,
    owner: String,
    symtom: String

});



module.exports = mongoose.model('dogData', dog);

