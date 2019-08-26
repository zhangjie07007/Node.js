const mongoose = require('mongoose');

const productList = mongoose.Schema({
    pro_name:{type:String,required:true},
    pro_price:{type:Number,required:true},
    pro_num:{type:Number,required:true},
    pro_img:{type:String,required:true},
    pro_shelf:{type:Boolean,required:true}
});

const productModel = mongoose.model('productLists',productList);
// productModel.insertMany({
//     pro_name:'yy',
//     pro_price:56,
//     pro_num:45,
//     pro_img:'dd',
//     pro_shelf:true
// });

module.exports = productModel;