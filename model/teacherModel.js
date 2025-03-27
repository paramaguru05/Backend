const mongoose =  require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator")

const CS_DB = require("./../config/CS_DB")
const BCA_DB = require("./../config/BCA_DB")



const teacherSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Teacher name is reauired"]
    },
    email:{
        type:String,
        required:[true,"Email id is reauired"],
        unique:true,
        validate:{
            validator:function(val){
                return validator.isEmail(val)
            },
            message:"Provid valid email id"
        }
    },
    password:{
        type:String,
        minlength:[8,"The password must have 8 charactors"],
        select:false
    },
    department:{
        type:Array,
        required:[true,"Department name is reauired"]

    },
    highestQualification:{
        type:String,
        required:[true,"Highest qualification  is reauired"]
    },
    DOJ:{
        type:String,
        required:[true,"Date of joining is reauired"]
    },
    district:{
        type:String,
        required:[true,"District is reauired"]
    },
    streetName:{
        type:String,
        required:[true,"Street name is reauired"]
    },
    doorNumber:{
        type:String,
        required:[true,"Door number is reauired"]
    },
    phoneNo:{
        type:String,
        required:[true,"Phone number is reauired"]
    },
    gender:{
        type:String,
        required:[true,"Gender is reauired"]
    },
    DOB:{
        type:String,
        required:[true,"Date of birth is reauired"]
    },
    role:{
        type:String,
        default:"staff"
    },
    route:{
        type:String
    },
    otp:{
        type:String
    }

},{
    toJSON:{virtuals:true}
})

teacherSchema.method.verifyOTP = function (req,res,next) {
   let otp =  req.body.otp
   console.log( otp, this.otp)
   next()
}

const CS_Teacther =  CS_DB.model("cs_teacher",teacherSchema)
const BCA_Teacther =  BCA_DB.model("bca_teachers",teacherSchema) 

module.exports = { CS_Teacther, BCA_Teacther}