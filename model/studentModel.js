const mongoosh = require("mongoose")
const Validator = require("validator")
const CS_DB = require("./../config/CS_DB")
const BCA_DB = require("./../config/BCA_DB")


const studentSchema = new mongoosh.Schema({
    registerNo:{
        type:String,
        unique:true
    },
    name:{
       type: String,
       required:[true,"Student name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        validate:{
            validator:function(val){
                return Validator.isEmail(val)
            },
            message:"Please provid valid email id"
        }
    },
    phoneNo:{
        type:String,
        required:[true,"Phone number is required"]
    },
    DOB:{
        type:String,
        required:[true,"Date of birth is required"]
    },
    gender:{
        type:String,
        required:[true,"Gender is required"]
    },
    degree:{
        type:String,
        required:[true,"Degree is required"]
    },
    department:{
        type:String,
        required:[true,"Department name is required"]
    },
    currentYear:{
        type:String,
        required:[true,"Year is required"]
    },
    currentSemaster:{
        type:String,
        required:[true,"Semaster is required"]
    },
    bloodGroup:{
        type:String,
        required:[true,"Blood group is required"]
    },
    country:{
        type:String,
        required:[true,"Country is required"]
    },
    state:{
        type:String,
        required:[true,"State is required"]
    },
    district:{
        type:String,
        required:[true,"District is required"]
    },
    area:{
        type:String,
        required:[true,"Area is required"]
    },
    streetName:{
        type:String,
        required:[true,"Street name is required"]
    },
    doorNumber:{
        type:String
    },
    fatherName:{
        type:String,
        required:[true,"Father name is required"]
    },
    fPhoneNumber:{
        type:String,
        required:[true,"Father's phone number is required"]
    },
    motherName:{
        type:String,
        required:[true,"Mother name is required"]
    },
    mPhoneNumber:{
        type:String,
        required:[true,"mothers's phone number is required"]
    },
    fees: {
        tution: Number,
        bus: Number,
        tutionFeesBalance: Number,
        busFeesBalance: Number,
       
    },
    attendance:{
        type:Array,
        default:[],
        
    },
    result:{
        type:Array,
        default:[],
        
    },
    role:{
        type:String,
        default:"student"
    },
    route:{
        type:String
    }
})


const CS_STUDENT =  CS_DB.model("CS_students",studentSchema)
const BCA_STUDENT =  BCA_DB.model("BCA_students",studentSchema)


module.exports = { CS_STUDENT, BCA_STUDENT }