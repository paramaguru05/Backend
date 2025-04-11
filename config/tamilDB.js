const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config({path:"./config.env"})

const tamilDB = mongoose.createConnection(process.env.REMOTE_TAMIL_DB)

tamilDB.on('connected',()=> console.log("Successfully connected to tamil database"))

tamilDB.on("error",(err)=>console.log("Can not connect to tamil DB ",err))


module.exports = tamilDB