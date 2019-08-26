const mongoose = require('mongoose');

let student = mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    age:{type:Number,required:true},
    img:{type:String,required:false},
    nickname:{type:String,required:true}
});

let userModel = mongoose.model('students',student);

module.exports = userModel;