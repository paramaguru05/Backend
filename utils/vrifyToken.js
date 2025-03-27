const jwt = require("jsonwebtoken")
const util = require("util")

const verify = async (req,res,next) =>{
    try{
     let decode ;
     if(req.headers.authorization && req.headers.authorization.startsWith('bearer')){
        decode = req.headers.authorization.split(' ')[1]
        console.log( decode )
     }

     let isAuth = await util.promisify(jwt.verify)(decode,process.env.SECRET_STR)
     console.log( isAuth.id ) 

    next()
    }catch(error){
        res.status(400).json({
            status:"Fail",
            message:"Unothrisze please login into access"
        })
    }
}

module.exports = verify