const { createConnection } = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path:"./config.env"})

const BCA_DB = createConnection(process.env.LOCAL_DB+"BCA_DB")

BCA_DB.on('connected',()=>{
    console.log("Successfully connected to BCA database")
})

BCA_DB.on("error",(err)=>{
    console.log("Can not connect to BCA DB ",err)
})

module.exports = BCA_DB;