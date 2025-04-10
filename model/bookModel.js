const mongoose = require('mongoose')
const libraryDb = require("./../config/libraryDB")
const { type } = require('os')

const bookSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Book name is required"]
    },
    author:{
        type:String,
        required:[true,"Author name is required"]
    },
    category:{
        type:String,
        required:[true,"Category is required"]
    },
    stack:{
        type:Number,
        required:[true,"Stack is required"]
    },
    currentStack:{
        type:Number,
        default:0
    },
    description:{
        type:String,
        required:[true,"Description is required"]
    },
    studentsData:{
        type:Array,
        default:[]
    }
})

const book = libraryDb.model("Books",bookSchema)

module.exports = book