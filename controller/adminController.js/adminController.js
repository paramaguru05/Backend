const asyncErrorHandler = require("./../../utils/asyncErrorHandler")
const CustomError = require("./../../utils/customError")
const ApiFeatuer = require("./../../utils/apiFeatures")
const sentMail = require("./../../utils/sentMail")
const adminModel = require("./../../model/adminModel")
const jwt = require("jsonwebtoken")

exports.getAdmins = asyncErrorHandler( async (req,res,next)=>{
    
    if( !req.userData || req.userData.role != "admin" ) throw new CustomError("Only admin can access",403)

    let id = req.query.id 

    let data;

    if(id){
        data = await adminModel.findById(id)
        if( !data._id ) throw new CustomError("data not found",404)
    }else{
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

    let id = req.params.id
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

exports.getSingleAdmin = asyncErrorHandler( async (req,res,next)=>{
    res.status(200).json({
        message:"Test single admin"
    })
})

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