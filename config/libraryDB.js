const mongoose = require("mongoose")

const dotenv = require('dotenv')
dotenv.config({ path:"./config.env"})

const libraryDb = mongoose.createConnection(process.env.LOCAL_DB+"libraryDB")

libraryDb.on("connected",()=> console.log("Successfully connected to library database"))
libraryDb.on("error",(err)=>console.log("Can not connect to liberary DB ",err))

module.exports = libraryDb