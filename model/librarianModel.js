const mongoose = require("mongoose")
const libraryDB = require("./../config/libraryDB")

const librarianSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Password is required'],
    },
    phoneNo:{
        type:String,
        required:[true,'Phone number is required'],
    },
    role:{
        type:String,
        default:"librarian"
    }
})

const librarian = libraryDB.model('Librarian',librarianSchema)

module.exports = librarian