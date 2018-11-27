var mongoose = require('mongoose')
var Schema = mongoose.Schema
var event = new Schema({
    title: String,
    dog: String,
    name:String,
    descr: String,
    owner: String,
    day: Number,
    month: Number,
    year :Number,
    time:String
})

module.exports = mongoose.model('eventData', event)