const mongoose = require("mongoose")
const dotenv = require('dotenv')
dotenv.config({ path:"./config.env"})


let CS_DB;

CS_DB =  mongoose.createConnection(process.env.REMOTE_CS_DB)

CS_DB.on('connected',()=>{
    console.log("Successfully connected to CS database")
})

CS_DB.on("error",(err)=>{
    console.log("Can not connect to CS DB ",err)
})




module.exports = CS_DB