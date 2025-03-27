const CustomError = require("./customError")

exports.productStaff = async (db,id,next) =>{

    try {
        let data = await db.findById(id)
        if( !data?.name || null ) throw new CustomError("Unauthorized can't access resourses",401)
        console.log( "Product staff", data.role )
        return data
    } catch (error) {
        next( error )
    }
}