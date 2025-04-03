const CustomError = require("./customError")
const {BCA_STUDENT,CS_STUDENT,TAMIL_STUDENT} = require("./../model/studentModel")
const {BCA_Teacther,CS_Teacther,tamil_teacher} = require("./../model/teacherModel")
const jwt = require("jsonwebtoken")
const asyncErrorHandler = require("./asyncErrorHandler")

exports.productStaff = asyncErrorHandler ( async (req,res,next) =>{


    if( req?.userData?.role === "admin"){
        console.log("Staff product not working")
        return next()
    }
    console.log("Starting produt new Staff product")


    let token = req.headers['authorization']

    if( token && token.startsWith('bearer') ){
       token =  token.split(' ')[1]
    }else{
        throw new CustomError("Unauthorized access",401)
    }

    let {id,route,role} = jwt.verify(token,process.env.SECRET_STR)

    console.log( role )

    if( !id || !route ) throw new CustomError("Unauthorized access",401);

    if( role === "student"){
        console.log("Staff product not working")
        return next()
    }

    if( route === "CS"){
        let data = await CS_Teacther.findById(id)
        console.log( "After fext data", data._id)
        if( !data._id ) throw new CustomError("Unauthorized access",401);
        req.userData = data
        console.log("Successfully executed cs student product")
        next()
    }else if( route === "BCA"){
        console.log("BCA staff product working")
        let data = await BCA_Teacther.findById(id)
        if( !data._id ) throw new CustomError("Unauthorized access",401);
        req.userData = data
        next()
    }else if( route === "tamil"){
        console.log("tamil staff product working")
        let data = await tamil_teacher.findById(id)
        if( !data._id ) throw new CustomError("Unauthorized access",401);
        req.userData = data
        next()
    }
})

exports.productStudents = async ( db,id,next) =>{
    let data = await db.findById(id)
    console.log( "From student product", data )
    return data
}

exports.productStudents = asyncErrorHandler( async (req,res,next)=>{

       console.log("Starting produt new student product")


        if( req?.userData?.role === "staff" || req?.userData?.role === "HOD" || req?.userData?.role === "admin"){
            console.log("Student product not working")
            return next()
        }
    
        let token = req.headers['authorization']
    
        if( token && token.startsWith('bearer') ){
           token =  token.split(' ')[1]
        }else{
            throw new CustomError("Unauthorized access",401)
        }
    
        let {id,route,role} = jwt.verify(token,process.env.SECRET_STR)

        if( !id || !route ) throw new CustomError("Unauthorized access",401);

        if( route === "CS"){
            let data = await CS_STUDENT.findById(id)
            if( !data._id ) throw new CustomError("Unauthorized access",401);
            req.userData = data
            console.log("Successfully executed cs student product")
            next()
        }else if( route === "BCA"){
            let data = await BCA_STUDENT.findById(id)
            if( !data._id ) throw new CustomError("Unauthorized access",401);
            req.userData = data
            next()
        }else if( route === "tamil"){
            let data = await TAMIL_STUDENT.findById(id)
            if( !data._id ) throw new CustomError("Unauthorized access",401);
            req.userData = data
            next()
        }
    
})