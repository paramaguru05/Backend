
const CustomError = require("./../utils/customError")

const handleDuplicateError = (err) =>{
    let data = Object.entries(err.keyValue)
    data = data.flat()
    const errror = new CustomError(`This ${data[0]} ${data[1]} already exists`,400)
    return errror
    
}

const handleJWTError = (err)  =>{
    return new CustomError(err.message,401)
}

const handleJWTExpireError = (err) =>{
    return new CustomError(err.message,403)
}

module.exports = (error,req,res,next)=>{
    console.log( "Globale error handler", error )

    if( error.code === 11000 ) error =  handleDuplicateError(error);

    if(error.name === "JsonWebTokenError") error = handleJWTError(error);

    if(error.name === "TokenExpiredError") error = handleJWTExpireError(error)

    res.status( error.statusCode || 500 ).json({
        status: error.status || "error" ,
        statusCode: error.statusCode,
        message: error.message
    })
}