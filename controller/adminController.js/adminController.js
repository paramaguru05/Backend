const EventEmitter = require("events")

const eventEmiiter = new EventEmitter

const asyncErrorHandler = require("./../../utils/asyncErrorHandler")
const CustomError = require("./../../utils/customError")

const {BCA_Teacther,CS_Teacther,librarian,tamil_teacher} = require("./../../model/teacherModel")
const {BCA_STUDENT,CS_STUDENT,TAMIL_STUDENT} = require("./../../model/studentModel")

const sentMail = require("./../../utils/sentMail")
const adminModel = require("./../../model/adminModel")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")

exports.getAdmins = asyncErrorHandler( async (req,res,next)=>{
    
    if( !req.userData || req.userData.role != "admin" ) throw new CustomError("Only admin can access",403)

    let id = req.query.id 

    let data;

    if(id){
        data = await adminModel.findById(id)
        if( !data._id ) throw new CustomError("data not found",404)
    }else{
        delete req.query.id 
        data = await adminModel.find()
        if( !data.length ) throw new CustomError("data not found",404)
    }

    res.status(200).json({
        status:"Success",
        length:data.length,
        data:{
            data
        }
    })

})

exports.getSingleAdmin = asyncErrorHandler( async (req,res,next) =>{

    if( req?.userData?.role != "admin" ) throw new CustomError("Only admin can handle",401)

    let id =  req.query.id 
    if( !id ) throw new CustomError("Can't get without admin id",400)
    
    let data = await adminModel.findById(id)

    if(!data._id) throw new CustomError("Data not found",404)

    // student database
    
    let cs_students_count = await CS_STUDENT.countDocuments()
    let bca_students_count = await BCA_STUDENT.countDocuments()
    let tamil_students_count = await TAMIL_STUDENT.countDocuments()

    let totalStudents = cs_students_count + bca_students_count + tamil_students_count

    // staff database 

    let tamil_staff_count = await tamil_teacher.countDocuments()
    let bca_staff_count = await BCA_Teacther.countDocuments()
    let cs_staff_count = await CS_Teacther.countDocuments()
    let librarian_staff_count = await librarian.countDocuments()

    let totalStaff = tamil_staff_count + bca_staff_count + cs_staff_count
    
    let mergedData = {
        _id:data._id,
        name:data.name,
        role:data.role,
        phoneNo:data.phoneNo,
        totalStudents,
        totalStaff,
        librarianCount:librarian_staff_count

    }

    res.status(200).json({
        status:"Success",
        data:{
            mergedData
        }
    })
})

exports.createAdmin = asyncErrorHandler( async (req,res,next) =>{

    console.log( req.userData )

    if( !req.userData || req.userData.role != "admin") throw new CustomError("Only admin can access",403)

    await adminModel.insertMany(req.body)
    res.status(201).json({
        status:"Success",
        message:"Admin created successfully"
    })
})

exports.deleteAdmin = asyncErrorHandler( async (req,res,next) =>{

    if( !req.userData || req.userData.role != "admin") throw new CustomError("Only admin can access",403)

    let id = req.query.id
    await adminModel.deleteOne({email:id})
    res.status(200).json({
        status:"Success",
        message:"Admin deleted successfully"
    })
})

exports.updateAdmin = asyncErrorHandler( async (req,res,next) =>{

    if( !req.userData || req.userData.role != "admin") throw new CustomError("Only admin can access",403)

    await adminModel.updateOne({email:req.body.email},{...req.body})
    res.status(200).json({
        status:"Success",
        message:"Admin update successfully"
    })
} )

exports.adminLogin = asyncErrorHandler( async (req,res,next) =>{

    let {email,password} = req.body
    console.log( email, password )

    if( !email || !password) throw new CustomError("Email id & password is required",400)

    let data = await adminModel.findOne({email}).select("+password")

    if( !data ) throw new CustomError("Invalid email id or password",400)
    
    if( !data.password ) throw new CustomError("Invalid email id or password",400)

    let isMatch = await data.comparePassword(password,data.password)

    if( !isMatch) throw new CustomError("Invalid email id or password",400)


    let token = jwt.sign({id:data._id,role:data.role},process.env.SECRET_STR,{expiresIn:"1d"})

    res.status(200).json({
        status:"Success",
        token,
        role:data.role,
        id:data._id
    })

} )

exports.forgetPassword = asyncErrorHandler ( async (req,res,next) =>{
    let email = req.body.email
    let data = await adminModel.findOne({email})
    if( !data ) throw new CustomError("Data not found",404)
    
    let otp = ""
    for(let i=1; i<=4; i++){
        otp+= Math.floor( Math.random()*9 )
    }

    data.otp = otp
    data.optExpires = Date.now() + ( 1000 * 60 * 2)
    await data.save()
    
    sentMail(data.email,"test mail",`Your otp is: ${otp} and expires 2 minits`)
    
    res.status(200).json({
        status:"Success",
        payload:{
            email,
            role: data.role
        }
    })
})

exports.verifyOTP = asyncErrorHandler ( async (req,res,next) =>{
    
    let {otp,email} = req.body

    if( !otp || !email ) throw new CustomError("OTP and email is required",400)
    
    if( otp.length != 4 ) throw new CustomError("Invalid OTP",400)

    let data = await adminModel.findOne({email})
    
    if( !data ) throw new CustomError("Account not found",404)

    if( otp != data.otp ) throw new CustomError("OTP invalid",400)

    res.status(200).json({
        status:"Success",
        message:"Test verify otp"
    })

} )

exports.resetPassword = asyncErrorHandler( async (req,res,next) =>{
    let {email,password} = req.body
    if( !email || !password ) throw CustomError("Email and password is required",400)
    let data = await adminModel.findOne({email})

    if( !data ) throw new CustomError("Account not fountd",404)

    data.otp = undefined;
    data.password = password
    data.save()

    res.status(200).json({
        message:"Password changed successfully"
    })
    
})

exports.productAdmin = asyncErrorHandler ( async (req,res,next) =>{
    
    let decodeToken;
    if( req.headers.authorization && req.headers.authorization.startsWith('bearer') ){
        decodeToken = req.headers.authorization.split(' ')[1]
    }else{
        throw new CustomError("Unauthorized access please login into access resourse",401)
    }

    let {id,role} = jwt.verify(decodeToken,process.env.SECRET_STR,)


    if( role === "admin"){
        console.log("Admin product working")
        let data = await adminModel.findById(id)
        if( !data ) throw new CustomError("Data not found",404)
        req.userData = data
        next()
    }else{
        console.log("Admin product not working")
        next()
    }
    

})


exports.postStudentResults = asyncErrorHandler( async (req,res,next) =>{
    

    if( !fs.existsSync(path.join(__dirname,"..","..","devData","examResult.json")) ) throw new CustomError("File not found",404);

    let resultData = JSON.parse(fs.readFileSync( path.join(__dirname,"..","..","devData","examResult.json") ,'utf-8') )

   
    let departments = {
        cs:[],
        bca:[],
        tamil:[]
    }


    resultData.forEach( val =>{
        if( val.department === "computer science" ){
            departments.cs.push( val )
        }else if( val.department === "BCA"){
            departments.bca.push( val )
        }else if( val.department === "Tamil"){
            departments.tamil.push( val )
        }
    })
    
    eventEmiiter.emit("update_result",departments)

    res.status(200).json({
        status:"Success",
        message: resultData[0]
    })
})

eventEmiiter.on("update_result", async (departments)=>{
    let cs_results = departments.cs 
    let bca_results = departments.bca
    let tamil_results = departments.tamil

    
    for( let result of cs_results ){
       await CS_STUDENT.updateOne( { registerNo: result.registerNo}, { $push:{ result: result } } )
    }

    for( let result of bca_results ){
       await BCA_STUDENT.updateOne( { registerNo: result.registerNo}, { $push:{ result: result } } )
    }

    for( let result of tamil_results ){
       await TAMIL_STUDENT.updateOne( { registerNo: result.registerNo}, { $push:{ result: result } } )
    }
})