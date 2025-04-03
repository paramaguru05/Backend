const asyncErrorHandler = require("../../utils/asyncErrorHandler")
const CustomError = require("./../../utils/customError")
const {BCA_Teacther} = require("./../../model/teacherModel")
const ApiFeatures = require("./../../utils/apiFeatures")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcript = require("bcryptjs")
const {sendEmail} = require("./../../utils/sentMail")

exports.createTeacher = asyncErrorHandler(async ( req, res, next ) =>{


    if( req?.userData?.role != "HOD" && req?.userData?.role != "admin" ) throw new CustomError(" only HOD or admin can add a staff",401);
    if(req?.userData?.role != "admin"){
        if( req?.userData?.route != "BCA" ) throw new CustomError("This resourse only accessed by BCA HOD",401)
    }

    req.body.route = "BCA"    
    await BCA_Teacther.create( req.body )
    res.status(201).json({
        status:"Success",
        message:"BCA staff successfuly created "
    })
})




exports.setRout = async (req,res) =>{
    await BCA_Teacther.updateMany({_id:{$exists:true}},{route:"CS"})
    res.status(200).json({
        status:"Success",
        message:"Teacher route cs set"
    })
}

exports.getTeachers = asyncErrorHandler( async ( req, res,next ) =>{

    if( req?.userData?.role != "HOD" && req?.userData?.role != "admin") throw new CustomError("This resourse only accessed by HOD or admin",401)

    if(req?.userData?.role != "admin" ){
       if( req?.userData?.route != "BCA" ) throw new CustomError("This resourse only accessed by BCA HOD",401)
    }

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
   
   if(!req.userData) throw new CustomError("Unauthorized access please login into access resourse",401);
   
   if( req.userData.route != "BCA") throw new CustomError("Can not access other department staff",401)

   let id =  req.query.id
   let email = req?.userData?.email
   let reqId = req?.userData?.id
   let role = req?.userData?.role
   

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

exports.deleteStaff = asyncErrorHandler( async (req,res,next) =>{

    if(!req.userData) throw new CustomError("Unauthorized can not access",401)
    
    if( req.userData.role != "HOD" && req.userData.role != "admin" ) throw new CustomError("Can not access resorse",403)
    
    if( req.userData.role != "admin" ){
        if( req.userData.route != "BCA" ) throw new CustomError("Only BCA HOD can delete a staff")
    }

    let id =  req.params.id 
    await BCA_Teacther.deleteOne({_id:id})
    res.status(204).json({
        status:"Success",
        message:"BCA staff deleted successfully"
    })
})

exports.staffLogin = asyncErrorHandler( async(req,res) =>{
    
        const {email,password} = req.body

        if( !email || !password) throw new CustomError("Email and password is required",400)

        const data = await BCA_Teacther.find({email}).select("+password")

        if( !data.length ) throw new CustomError("Incorrect email or password",400)
        if( !data[0].password ) throw new CustomError("Password is not set",400)

        let isMatch = await bcript.compare(password,data[0].password )

        if( !isMatch) throw new CustomError("Incorrect email or password",400)


        const token = jwt.sign({id:data[0]._id,role:data[0].role,route:data[0].route},process.env.SECRET_STR,{expiresIn:"1d"})

        res.status(200).json({
            status:"Success",
            token,
            route:data[0].route,
            role:data[0].role,
            id:data[0]._id
        })
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

    sendEmail(data.email,otp)

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


exports.updateStaff = asyncErrorHandler ( async (req,res,next) =>{
    if( !req.userData ) throw new CustomError("Unauthorized access",401)
   
    if( req.userData.role != "admin" && req.userData.role != "HOD") throw new CustomError("Unauthorized access",401)
    
    if( req.userData.role === "HOD" && req.userData.route != "CS") throw new CustomError("Only BCA HOD can access",401)

    if( !req.body.id ) throw new CustomError("Can not update without id",400)
    
    await BCA_Teacther.updateOne({_id:req.body.id},req.body)

    res.status(201).json({
        message:"Successfully BCA staff updated"
    })

})