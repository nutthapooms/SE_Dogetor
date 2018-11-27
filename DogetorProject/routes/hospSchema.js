var mongoose = require('mongoose')
var Schema = mongoose.Schema
var hos = new Schema({
    name: String,
    location: String,
    phone: String,
    open: String,
    pic: String
    
})

module.exports = mongoose.model('hosData', hos)