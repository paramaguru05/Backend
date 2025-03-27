const jwt = require("jsonwebtoken")
const customError = require("./customError")
const util = require("util")

const signToken = async (id) =>{
   let token =  await util.promisify( jwt.verify )({id},process.env.SCERET_STR,{expiresIn:"1d"})
    return token
}

module.exports = signToken