const mongosse = require("mongoose")
const CS_DB = require("./../config/CS_DB")

const attendanceSchema = new mongosse.Schema({
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    registerNo:{
        type:String,
    },
    year:{
        type:String,
        required:[true,"Year is required"]
    },
    attendance:{
        type:Array,
        default:[]
    }
})

const StudentAttendanceModel =   CS_DB.model("student_attendance",attendanceSchema)

module.exports = StudentAttendanceModel