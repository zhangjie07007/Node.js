const productModel = require('./productModel');
const mongoose = require('mongoose');

let addProductInfo = obj =>{
    return productModel.insertMany(obj)
    .then(()=>{
        return {err:0,msg:true};
    }).catch(err=>{
        return {err:1,msg:false};
    });
}
let getProductInfo = (body) =>{
    let {pagesize,page} = body;
    return productModel.find().limit(pagesize).skip(pagesize*page)
    .then(data=>{
        return {err:0,msg:data};
    }).catch(err=>{
        return {err:2,msg:false};
    })
}
let updateProInfo =obj=>{
    let {flag,_id} = obj;
    let id = mongoose.Types.ObjectId(_id);
    console.log(flag,id)
    return productModel.updateOne({_id:id},{$set:{pro_shelf:flag}})
    .then(()=>{
        return {err:0,msg:true};
    }).catch(err=>{
        return {err:3,msg:false};
    })
}
let delProInfo = id=>{
    let _id = mongoose.Types.ObjectId(id)
    return productModel.deleteOne({_id:_id})
    .then(()=>{
        return {err:0,msg:true};
    }).catch(err=>{
        return {err:0,msg:false};
    })
}
let searchInfo =obj =>{
    console.log(obj);
    let reg = new RegExp(obj.msg);
    return productModel.find({pro_name:reg})
    .then(data=>{
        return {err:0,msg:data};
    }).catch(err=>{
        return {err:0,msg:false}
    })
}

module.exports = {
    addProductInfo,getProductInfo,updateProInfo,delProInfo,searchInfo
}