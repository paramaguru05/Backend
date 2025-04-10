const { librarian } = require("./../../model/teacherModel")
const Book = require("./../../model/bookModel")
const asyncErrorHandler = require("./../../utils/asyncErrorHandler")
const customError = require("./../../utils/customError")
const {sendEmail} = require("./../../utils/sentMail")
const bcript = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.createLibrarian = asyncErrorHandler( async (req,res,next) =>{

    if( req?.userData?.role != "admin") throw new customError("Only admin can created a librarian")
    req.body.route = "library"
    req.body.role = "librarian"

    await librarian.create( req.body )

    res.status(201).json({
        status:"Success",
        message:"Librarian successfully created"
    })

} )



exports.getLibrarian = asyncErrorHandler(async (req,res,next) =>{

    if( !req.userData ) throw new customError("Only admin and libraian can accesss",401)

    if( req.userData.role != "librarian" && req.userData.role != "admin" ) throw new customError("Only admin and libraian can accesss",401);

    let data = await librarian.find()

    res.status(200).json({
        status:"Success",
        length:data.length,
        data:{
            data
        }
    })

} )


exports.singleLibrarian = asyncErrorHandler( async (req,res,next) =>{

    if( !req.userData ) throw new customError("Unauthorized access",401)
    
    if( req.userData.role != "librarian" && req.userData.role != "admin" ) throw new customError("Only admin and libraian can accesss",403);

    const {id} = req.query

    console.log( id )

    if( !id ) throw new customError("Can't find librarian data without id",400)

    let data = await librarian.findById(id)
    const bookData = await Book.find()
    let totalBooks = 0;
    let issuedBookCount = 0

    bookData.forEach( val =>  {
        issuedBookCount += (val.stack - val.currentStack )
        totalBooks++
    } )

    const mergeData = {
        totalBooks,
        name:data.name,
        department:data.department,
        DOB:data.DOB,
        gender:data.gender,
        issuedBookCount
    }

    console.log( mergeData )

    res.status(200).json({
        status:"Success",
        data:{
           data:mergeData
        }
    })
    
})

exports.deleteLibrarian = asyncErrorHandler(async (req,res,next) =>{

    if( req?.userData?.role != "admin") throw new customError("Only admin can created a librarian")

    let id =  req.params.id

    await librarian.deleteOne({_id:id})

    res.status(204).json({
        status:"Success",
        message:"Successdfully librarian deleted"
    })

})

exports.updateLibrarian = asyncErrorHandler(async (req,res,next) =>{

    if( req?.userData?.role != "admin") throw new customError("Only admin can created a librarian")

    let {id} =  req.body

    await librarian.updateOne({_id:id},req.body)

    res.status(201).json({
        status:"Success",
        message:"Successdfully librarian was updated"
    })

})

exports.forgetPassword = asyncErrorHandler( async(req,res,nex)=>{

    let {email} = req.body
    let data = await librarian.findOne({email})
    if( !data?.email) throw new customError("Account not found can not change password",401)
    let otp = ""
    for(let i=1; i<=4; i++){
        otp+= Math.floor( Math.random()*9 )
    }

    data.otp = otp
    data.optExpires = Date.now() + ( 1000 * 60 * 2)
    await data.save()
   
    let response = await  sendEmail(data.email,otp)

    res.status(200).json({
        status:"Success",
        message:"OTP sent success",
        payload:{
            email:data.email,
            route:data.route,
            role:data.role
        }
    })
})

exports.verifyOTP = asyncErrorHandler( async (req,res,next)=>{
    let otp = req.body.otp
    let email = req.body.email
    let user = await librarian.findOne({email})
    if( otp != user.otp) throw new customError("OTP is invalid",400)

    if( user.optExpires < Date.now()){
        throw new customError("OTP was expired",400)
    }

    user.otp = undefined;
    user.optExpires = undefined
    await user.save()
    res.status(200).json({
       status:"Success",
       message:"OTP is verifyed successfully"
    })
})

exports.resetPassword = asyncErrorHandler( async (req,res,next)=>{
   let email =  req.body.email
   let password = req.body.password
   let user = await librarian.findOne({email})
   user.password = await bcript.hash(password,10)
   await user.save()
   res.status(200).json({
    status:"Success",
    message:"Password is changed successfully"
   })
})

exports.librarianLogin = asyncErrorHandler( async(req,res) =>{
    
        const {email,password} = req.body

        if( !email || !password) throw new customError("Email and password is required",400)

        const data = await librarian.find({email}).select("+password")

        if( !data.length ) throw new customError("Incorrect email or password",400)
        if( !data[0].password ) throw new customError("Password is not set",400)

        let isMatch = await bcript.compare(password,data[0].password )

        if( !isMatch) throw new customError("Incorrect email or password",400)


        const token = jwt.sign({id:data[0]._id,role:data[0].role,route:data[0].route},process.env.SECRET_STR,{expiresIn:"1d"})

        res.status(200).json({
            status:"Success",
            token,
            route:data[0].route,
            role:data[0].role,
            id:data[0]._id
        })
})