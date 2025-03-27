const adminDB = require("./../config/adminDB")
const mongoose = require("mongoose")
const validators = require("validator")
const bcrypt = require("bcryptjs")
const { type } = require("os")


const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required']
    },
    email:{
        type:String,
        required:[true,'Name is required'],
        unique:true,
        validate:{
            validator:function(val){
                return validators.isEmail(val)
            },
            message:"Provied valid email address"
        }
    },
    password:{
        type:String,
        minlength:[8,"Password must be contain 8 characters"],
        select:false
    },
    phoneNo:{
        type:String,
        required:[true,"Phone number is required"]
        
    },
    role:{
        type:String,
        default:"admin"
    },
    otp:{
        type:String,
    }
})

adminSchema.methods.comparePassword = async function(reqPass,dbPass){
    let isMatch = await bcrypt.compare(reqPass,dbPass)
    return isMatch
}

adminSchema.pre('save',async function(next){

    console.log(" befor save data",this.password)
    if( this.password ){
        console.log("Password existed")
        this.password = await bcrypt.hash(this.password,10)
    }
 
    next()
})


let adminModel =   adminDB.model("admin",adminSchema)

module.exports = adminModel