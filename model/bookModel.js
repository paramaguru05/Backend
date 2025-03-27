const mongoose = require('mongoose')
const libraryDb = require("./../config/libraryDB")

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
    description:{
        type:String,
        required:[true,"Description is required"]
    }
})

const book = libraryDb.model("Books",bookSchema)

module.exports = book