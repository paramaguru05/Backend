const CustomError = require("./customError")
const {BCA_STUDENT,CS_STUDENT,TAMIL_STUDENT} = require("./../model/studentModel")
const {BCA_Teacther,CS_Teacther,tamil_teacher, librarian} = require("./../model/teacherModel")

const jwt = require("jsonwebtoken")
const asyncErrorHandler = require("./asyncErrorHandler")



exports.productLibrarian = asyncErrorHandler ( async (req,res,next) =>{
    
    if( req?.userData?.role === "admin"){
        
        return next()
    }
   
    let token = req.headers['authorization']

    if( token && token.startsWith('bearer') ){
       token =  token.split(' ')[1]
    }else{
        throw new CustomError("Unauthorized access",401)
    }

    let {id,route,role} = jwt.verify(token,process.env.SECRET_STR)

    

    if( !id ) throw new CustomError("Unauthorized access",401);

    let data = await librarian.findOne({_id:id})


    req.userData = data
    next()
})

exports.productStaff = asyncErrorHandler ( async (req,res,next) =>{


    if( req?.userData?.role === "admin" || req?.userData?.role === "librarian"){
        
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

    if( role === "student"){
       
        return next()
    }

    if( route === "CS"){
        let data = await CS_Teacther.findById(id)
        
        if( !data._id ) throw new CustomError("Unauthorized access",401);
        req.userData = data
        
        next()
    }else if( route === "BCA"){
        
        let data = await BCA_Teacther.findById(id)
        if( !data._id ) throw new CustomError("Unauthorized access",401);
        req.userData = data
        next()
    }else if( route === "tamil"){
        
        let data = await tamil_teacher.findById(id)
        if( !data._id ) throw new CustomError("Unauthorized access",401);
        req.userData = data
        next()
    }
})

exports.productStudents = async ( db,id,next) =>{
    let data = await db.findById(id)
    
    return data
}

exports.productStudents = asyncErrorHandler( async (req,res,next)=>{

        if( req?.userData?.role === "staff" || req?.userData?.role === "HOD" || req?.userData?.role === "admin" || req?.userData?.role === "librarian"){
            
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