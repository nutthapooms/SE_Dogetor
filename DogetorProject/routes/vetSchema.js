var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var vet = new Schema({
    name: String,
    hos: String,
    phone: String,    
    pic: String
    
});

module.exports = mongoose.model('vetData', vet);