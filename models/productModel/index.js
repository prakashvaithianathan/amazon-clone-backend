const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
   price:{
       type:Number,
       required:true,
   },
   qty:{
       type:Number,
       default:1
   },
   keywords:[{
       type:String,
       required:true,
   }],
   ratings:{
       type:String,
   }
},{
    timestamps:true
})

const productModel = mongoose.model('products',productSchema)

module.exports = productModel