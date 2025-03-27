const {BCA_Teacther,CS_Teacther} = require("../../model/teacherModel")
const asyncErrorHandler = require("../../utils/asyncErrorHandler")
const {productStaff} = require("./../../utils/productRoute")
const CustomError = require("./../../utils/customError")
const ApiFeatures = require("./../../utils/apiFeatures")
const util = require("util")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcript = require("bcryptjs")

exports.createTeacher =  asyncErrorHandler(async ( req, res,next ) =>{
        let csPattern = /BCA/i
    
        if( req?.userData?.role != "HOD") throw new CustomError(" only HOD can add a staff",401);
        if( !csPattern.test( req?.userData?.route) ) throw new CustomError("This resourse only accessed by computer science HOD",401)
    
         req.body.route = "BCA"
        await BCA_Teacther.create(req.body)
        res.status(201).json({
            status:"Success",
            message:"BCa teacher successfuly created "
        })

})



exports.setRout = async (req,res) =>{
    await BCA_Teacther.updateMany({_id:{$exists:true}},{route:"BCA"})
    res.status(200).json({
        status:"Success",
        message:"Teacher route cs set"
    })
}

exports.getTeachers = asyncErrorHandler( async ( req, res, next ) =>{

    let bcaRoutePattern = /bca/i
    if( req?.userData?.role != "HOD") throw new CustomError("This resourse only accessed by HOD",401)

    if( !bcaRoutePattern.test( req?.userData?.route) ) throw new CustomError("This resourse only accessed by BCA HOD",401)

    let apiFeatures = new ApiFeatures(BCA_Teacther.find(),req.query).filter().sort().limit().limitFields()
    let data = await apiFeatures.query
        res.status(200).json({
            status:"Success",
            length:data.length,
            data:{
                data
            }
        })
})

exports.getSingleStaff = asyncErrorHandler( async (req,res,next) =>{
   
    let id =  req.query.id
    let email = req?.userData?.email
    let reqId = req?.userData?.id
    let role = req?.userData?.role
    
    if(!req.userData) throw new CustomError("Unauthorized access please login into access resourse",401);
 
    if(role === "staff" && email != id && reqId != id){
     throw new CustomError("Can not access other staff data",401)
    }
 
    let data;
    if( validator.isEmail(id) ){
     data = await BCA_Teacther.findOne({email:id})
    }else{
     data = await BCA_Teacther.findById(id)
    }
 
    res.status(200).json({
     message:"Success",
     data
    })
 })

exports.staffLogin = asyncErrorHandler( async(req,res,next) =>{
    
        const {email,password} = req.body

        if( !email || !password) throw new CustomError("Email and password is required",400)

        const data = await BCA_Teacther.find({email}).select("+password")

        if( !data.length ) throw new CustomError("Incorrect email or password",400)
        if( !data[0].password ) throw new CustomError("Password is not set",400)

        let isMatch = await bcript.compare(password,data[0].password )

        if( !isMatch) throw new CustomError("Incorrect email or password",400)

        data['route'] = "CS"    
        const token = jwt.sign({id:data[0]._id,role:data[0].role,route:data[0].route},process.env.SECRET_STR,{expiresIn:"1d"})

        res.status(200).json({
            status:"Success",
            token,
            route:data[0].route,
            role:data[0].role,
            id:data[0]._id
        })
})


exports.productStaff = asyncErrorHandler( async (req,res,next) =>{
     
       let decodeToken;
       if( req.headers.authorization && req.headers.authorization.startsWith('bearer') ){
        decodeToken = req.headers.authorization.split(' ')[1]
       }else{
        throw new CustomError("Unauthorized access please login into access resourse",401)
       } 

       let {id,role,route} = await util.promisify(jwt.verify)(decodeToken,process.env.SECRET_STR)
       console.log("User", role, route)
       if( role === 'staff' || role === "HOD" ){

          if( route === "CS"){
            console.log("rote to cs")
           req.userData = await productStaff(CS_Teacther,id,next)
           next()
          }
          
          if( route === 'BCA'){
            console.log("Bac route")
            req.userData = await productStaff(BCA_Teacther,id,next)
            console.log( req.userData )
            next()
          }

       }else{
         next()
       }
})


exports.forgetPassword = asyncErrorHandler( async(req,res,nex)=>{
    let {email} = req.body
    let data = await BCA_Teacther.findOne({email})
    if( !data?.email) throw new CustomError("Account not found can not change password",401)
    let otp = ""
    for(let i=1; i<=4; i++){
        otp+= Math.floor( Math.random()*9 )
    }

    data.otp = otp
    await data.save()
    res.status(200).json({
        status:"Success",
        message:"Account vrified",
        payload:{
            otp,
            email:data.email,
            route:data.route
        }
    })
})

exports.verifyOTP = asyncErrorHandler( async (req,res,next)=>{
    let otp = req.body.otp
    let email = req.body.email
    let user = await BCA_Teacther.findOne({email})
    if( otp != user.otp) throw new CustomError("OTP is invalid",400)

    user.otp = undefined;
    await user.save()
    res.status(200).json({
       status:"Success",
       message:"OTP is verifyed successfully"
    })
})

exports.resetPassword = asyncErrorHandler( async (req,res,next)=>{
   let email =  req.body.email
   let password = req.body.password
   let user = await BCA_Teacther.findOne({email})
   user.password = await bcript.hash(password,10)
   await user.save()
   res.status(200).json({
    status:"Success",
    message:"Password is changed successfully"
   })
})