const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({path:"./config.env"})

const adminDB = mongoose.createConnection(process.env.REMOTE_ADMIN_DB)

adminDB.on("connected",()=>console.log("Successfully connected to admin database"))

adminDB.on("error",(err)=>console.log("Can not connect to admin DB ",err))

module.exports = adminDB