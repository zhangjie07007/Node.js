const mongoose = require('mongoose');
const db = mongoose.connection;

let dbfind = mongoose.connect('mongodb://localhost:27017/myDemo',{useNewUrlParser: true});
db.on('connected',()=>{
    console.log('连接成功!');
});
db.on('error',err=>{
    if(err){
        console.log('连接失败!');
    }
});

module.exports = {
    db:db,
    dbfind:dbfind
};