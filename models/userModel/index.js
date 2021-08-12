const mongoose = require('mongoose');



const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        dropDups:true
    },
    password:{
        type:String,
        required:true,
    },
    verified:{
        type:Boolean,
        default:false
    },
    cartItems:[{
        _id:{},
        id:{
            type:mongoose.Types.ObjectId,
            ref:'products'
        },
        qty:{
            type:Number,
        },
        price:{
            type:Number,
        }
    }],
    purchasedItems:[{
            id:{
                type:mongoose.Types.ObjectId,
                ref:'products'
            },
            qty:{
                type:Number,
            },
            price:{
                type:Number,
            }
        
    
    }]
},

{
    timestamps:true
})

const userModel = mongoose.model('Users',userSchema)

module.exports=userModel