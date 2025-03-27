const { BCA_STUDENT } = require("./../../model/studentModel")
const ApiFeatures = require("./../../utils/apiFeatures")
const asyncErrorHandler = require("./../../utils/asyncErrorHandler")
const CustomError = require("./../../utils/customError")
const jwt = require("jsonwebtoken")
const util = require("util")



exports.createStudent = asyncErrorHandler(async (req,res,next) =>{
    let csPattern = /BCA/i

    if(req?.userData?.role != "staff" && req?.userData?.role != "HOD" ){
       throw new CustomError("Only staff or HOD can add a student",401)
    }else if( !csPattern.test(req?.userData?.route) ){
       throw new CustomError("Only BCA staff or HOD can add a student",401)
    }
        
        await BCA_STUDENT.create(req.body)
        await BCA_STUDENT.updateMany({route:{$exists:false}},{route:"BCA"})
        res.status(201).json({
            status:"Success",
            message:"Student created successfully"
        })
})

exports.getStudents = asyncErrorHandler( async(req,res) =>{
       
       if( req?.userData?.role === "staff" || req?.userData?.role === "HOD"){ 
            let feature =  new ApiFeatures(BCA_STUDENT.find(),req.query).filter().limitFields().sort().limit()
            let data = await feature.query
            res.status(200).json({
                status:"Success",
                length: data.length,
                data:{
                    data
                }
            })
       }else{
        throw new CustomError("Only BCA staff or HOD can access",401)
       }
})

exports.getStudent = asyncErrorHandler( async (req,res,next) =>{

        const id =  req.params.id
        let data = await BCA_STUDENT.findOne({$or:[ {registerNo:id}, {email:id}] })
        if( !data?._id ) throw new CustomError("Student data not found",404)
        res.status(200).json({
            status:"Success",
            data
        })
} )

exports.studentLogin = asyncErrorHandler(async (req,res,next) =>{
        const { id,DOB } = req.body

        let withoutZero = null
        let dob = DOB.split('-')
        if(dob[1].startsWith('0')){
          dob[1] = dob[1].slice(1)
        }
        if(dob[2].startsWith('0')){
          dob[2] = dob[2].slice(1)
        }
        withoutZero = dob.join("-")
        console.log( id, DOB,withoutZero )
        if( !id || !DOB) throw new CustomError("Register number or date of birth is incorected",400)

        let data =  await BCA_STUDENT.findOne({$or:[{registerNo:id},{email:id}]})
        if( data === null ) throw new CustomError("Invalid register Number or data of birth",400)
       

        if( data.DOB != DOB && data.DOB != withoutZero){
            throw new CustomError("Invalid register Number or data of birth",400)
        }
       
        const token = jwt.sign({id:data._id},process.env.SECRET_STR,{expiresIn:'1d'})
        
        res.status(200).json({
            status:"Success",
            token,
            route:data.route,
            role:data.role,
            id:data.email

        })
})



exports.getAttendance = asyncErrorHandler( async ( req, res, next )=>{
    console.log( req.userData )
    if( !req.userData ) throw new CustomError("Unauthorized access",401)

    if(req?.userData?.role != "admin"){
        if( req.userData.route != "BCA" )  throw new CustomError("Only andmin or BCA staff can access",403)
        if(  req?.userData?.role != "staff" && req?.userData?.role != "HOD" && req?.userData?.role != "admin") throw new CustomError("Only andmin or BCA staff can access",403)
    }

    let {date,year,degree,present} = req.query    

    let data = await BCA_STUDENT.aggregate([
        {
            $unwind:"$attendance"
        },
        {
            $match:{
                'attendance.date':date
            }
        },{
            $project:{
                registerNo:1,
                name:1,
                email:1,
                degree:1,
                currentYear:1,
                attendance:1,
                _id:0

            }
        }
    ])

    const departmentAttendance = {
        UG:{
            firstYear:{
                present:[],
                absent:[]
            },
            secondYear:{
                present:[],
                absent:[] 
            },
            thiredYear:{
                present:[],
                absent:[]
            }
        },
        PG:{
            firstYear:{
                present:[],
                absent:[]
            },
            secondYear:{
                present:[],
                absent:[] 
            } 
        }
    }
    
    data.forEach((val)=>{

        if(val.degree === "UG"){
            if( val.currentYear === "1" ){

                if( val.attendance.present ){
                    departmentAttendance.UG.firstYear.present.push( val )
                }else{
                    departmentAttendance.UG.firstYear.absent.push( val )
                }

            }else if( val.currentYear === "2" ){

                if( val.attendance.present ){
                    departmentAttendance.UG.secondYear.present.push( val )
                }else{
                    departmentAttendance.UG.secondYear.absent.push( val )
                }

            }else if(val.currentYear === "3") {
                if( val.attendance.present ){
                    departmentAttendance.UG.thiredYear.present.push( val )
                }else{
                    departmentAttendance.UG.thiredYear.absent.push( val )
                }
            }
        }else if(val.degree === "PG"){
            if( val.currentYear === "1" ){

                if( val.attendance.present ){
                    departmentAttendance.PG.firstYear.present.push( val )
                }else{
                    departmentAttendance.PG.firstYear.absent.push( val )
                }

            }else if( val.currentYear === "2" ){

                if( val.attendance.present ){
                    departmentAttendance.PG.secondYear.present.push( val )
                }else{
                    departmentAttendance.PG.secondYear.absent.push( val )
                }

            }
        }
    })


    if( degree && degree === "UG" ){
        delete departmentAttendance.PG
    }else if(degree && degree === "PG"){
        delete departmentAttendance.UG    
    }

    if( year ){
        if( year === "1"){
           delete departmentAttendance[degree].secondYear
           delete departmentAttendance[degree].thiredYear
        }else if( year === "2"){
            delete departmentAttendance[degree].firstYear
            delete departmentAttendance[degree].thiredYear
        }else if(year === "3"){
            delete departmentAttendance[degree].firstYear
            delete departmentAttendance[degree].secondYear
        }
    }

    res.status(200).json({
        departmentAttendance
    })

})


exports.updateStudent = asyncErrorHandler(async (req, res, next) =>{

    if(!req.userData) throw new CustomError("Unauthorized access",401)

    if(req.userData.route != "BCA"  && req.userData.role != "staff" && req.userData.role != "HOD"  ) throw new CustomError("Only BCA staff or HOD can update a student",401)

    const {registerNo} = req.body
    await BCA_STUDENT.updateOne({registerNo},req.body)

    res.status(200).json({
        message:"Student updated successfully"
    })

})

exports.deleteStudent = asyncErrorHandler(async (req,res,next) =>{

    if( !req.userData ) throw new CustomError("Unauthorized access",401)

    if(req.userData.route != "BCA" && req.userData.role != "staff" && req.userData.role != "HOD" ) throw new CustomError("Only BCA staff or HOD can delet a student",401)
    const {id} =  req.params 
    console.log( id )
    await BCA_STUDENT.deleteOne({registerNo:id})

        res.status(200).json({
            message:"Successfully student deleted"
        })
})


exports.postAttendance = asyncErrorHandler(async (req,res,next) =>{
    let data =  req.body 
    for(let i = 0 ; i < data.length ; i++ ){
        await BCA_STUDENT.updateOne({_id:data[i]._id},{ $push:{ attendance : data[i].attendance } })
    }
    res.status(201).json({
            message:"Attendance posted successfully"
    })

})


exports.createMultipleStudents = asyncErrorHandler( async (req,res,next)=>{
    await BCA_STUDENT.insertMany(req.body)
    await BCA_STUDENT.updateMany({route:{$exists:false}},{$set:{route:"CS"}})
    res.status(200).json({
        status:"Success",
        message:"Multiple CS student created successfully"
    })
})

exports.productStudent = asyncErrorHandler( async (req,res,next) =>{

    if( req?.userData?.role === "staff" || req?.userData?.role === "HOD" ){
        return next()
    }

    let decodeToken;
    if( req.headers.authorization && req.headers.authorization.startsWith('bearer') ){
     decodeToken = req.headers.authorization.split(' ')[1]
    }else{
     throw new CustomError("Unauthorized access please login into access resourse",401)
    }    
    let {id} = jwt.verify(decodeToken,process.env.SECRET_STR)
    console.log("Student id is",id)
    let data = await BCA_STUDENT.findById(id)

    if( !data ){
        throw new CustomError("Unauthorized can not access resourses",401)
    }else if( req.params.id && data.email != req.params.id && data.registerNo != req.params.id){
        throw new CustomError("Unauthorized  can not access resourses",401)
    }
 
    console.log( data)

    req.userRole = data.role
    req.userData = data
    console.log(req.userData.route)
    next()
})