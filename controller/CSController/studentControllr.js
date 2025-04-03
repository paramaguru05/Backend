const { CS_STUDENT } = require("./../../model/studentModel")
const ApiFeatures = require("./../../utils/apiFeatures")
const asyncErrorHandler = require("./../../utils/asyncErrorHandler")
const CustomError = require("./../../utils/customError")
const jwt = require("jsonwebtoken")


exports.test = asyncErrorHandler ( async (req,res,next) =>{
    res.status(200).json({
        message:"test route"
    })
})

exports.createStudent = asyncErrorHandler(async (req,res,next) =>{

    if( req?.userData?.role === "admin" ){
        console.log(req.userData.role)
    }else{
        let csPattern = /computer science/i
        if(req?.userData?.role != "staff" && req?.userData?.role != "HOD" ){
            throw new CustomError("Only staff or HOD can add a student",401)
        }else if( !csPattern.test(req?.userData?.department[0]) ){
            throw new CustomError("Only computer science staff or HOD can add a student",401)
        }
    }
    
      req.body.route = "CS"
        await CS_STUDENT.create(req.body)
        res.status(201).json({
            status:"Success",
            message:"Student created successfully"
        })
})

exports.getStudents = asyncErrorHandler( async(req,res) =>{
       
       if( req?.userData?.role === "staff" || req?.userData?.role === "HOD" || req?.userData?.role === "admin"){ 

        if( req?.userData?.role != "admin" && req?.userData?.route != "CS"  ) throw new CustomError("Only compute science staff or admin can access",401);

            let feature =  new ApiFeatures(CS_STUDENT.find(),req.query).filter().limitFields().sort().limit()
            let data = await feature.query
            res.status(200).json({
                status:"Success",
                length: data.length,
                data:{
                    data
                }
            })
       }else{
        throw new CustomError("Only staff can access",401)
       }
})
exports.createAttenanceList = asyncErrorHandler( async(req,res) =>{
       
       if( req?.userData?.role === "staff" || req?.userData?.role === "HOD" || req?.userData?.role === "admin"){ 

            
            let currentDay = new Date
            currentDay = currentDay.toLocaleDateString()

            let singleData = await CS_STUDENT.findOne({currentYear:req.query.currentYear,degree:req.query.degree})
            console.log(singleData)
            
            if(singleData.attendance[ singleData.attendance.length - 1 ].date === currentDay){
                throw new CustomError("Attendance was already posted",400)
            }


            let feature =  new ApiFeatures(CS_STUDENT.find(),req.query).filter().limitFields().sort().limit()
            let data = await feature.query

            res.status(200).json({
                status:"Success",
                length: data.length,
                data:{
                    data
                }
            })
       }else{
        throw new CustomError("Only staff can access",401)
       }
})

exports.getStudent = asyncErrorHandler( async (req,res,next) =>{

        if( req.userData.route != "CS") throw new CustomError("Only computer science department staff or HOD can access",401)

        const id =  req.params.id
        let data = await CS_STUDENT.findOne({$or:[ {registerNo:id}, {email:id}] })
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
  
        
        if( !id || !DOB) throw new CustomError("Register number or date of birth is incorected",400)

        let data =  await CS_STUDENT.findOne({$or:[{registerNo:id},{email:id}]})
        if( data === null ) throw new CustomError("Invalid register Number or data of birth",400)
       

        if( data.DOB != DOB && data.DOB != withoutZero){
            throw new CustomError("Invalid register Number or data of birth",400)
        }
       
        const token = jwt.sign({id:data._id,role:data.role,route:data.route},process.env.SECRET_STR,{expiresIn:'1d'})
        
        res.status(200).json({
            status:"Success",
            token,
            route:data.route,
            role:data.role,
            id:data.email

        })
})



exports.getAttendance = asyncErrorHandler( async ( req, res, next )=>{

    if( !req.userData ) throw new CustomError("Unauthorized access",401)

    if(req?.userData?.role != "admin"){
        if( req.userData.route != "CS" )  throw new CustomError("Only andmin or computer science staff can access",403)
        if(  req?.userData?.role != "staff" && req?.userData?.role != "HOD" && req?.userData?.role != "admin") throw new CustomError("Only andmin or computer science staff can access",403)
    }

    let {date,year,degree,present} = req.query    

    let currentDay = new Date

    if( !date) date = currentDay.toLocaleDateString() 

    if( date ) date = date.replace(/\b(-)\b/g, (match)=> `/`)
   

    let data = await CS_STUDENT.aggregate([
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
    

    if( req?.userData?.role === "admin" ){
        console.log(req.userData.role)
    }else{
        let csPattern = /computer science/i
        if(req?.userData?.role != "staff" && req?.userData?.role != "HOD" ){
            throw new CustomError("Only staff or HOD can update a student",401)
        }else if( !csPattern.test(req?.userData?.department[0]) ){
            throw new CustomError("Only computer science staff or HOD can update a student",401)
        }
    }

    const {registerNo} = req.body

    if(!registerNo) throw new CustomError("Register number is required",400)

    await CS_STUDENT.updateOne({registerNo},req.body,{runValidators:true})

    res.status(200).json({
        message:"Student updated successfully"
    })

})

exports.deleteStudent = asyncErrorHandler(async (req,res,next) =>{

    if( !req.userData) throw new CustomError("Unauthorized access",401)
        
    let csPattern = /computer science/i
    if(req?.userData?.role != "staff" && req?.userData?.role != "HOD" ){
       throw new CustomError("Only computer science staff or HOD can delete a student",401)
    }else if( !csPattern.test(req?.userData?.department[0]) ){
       throw new CustomError("Only computer science staff or HOD can delete a student",401)
    }

    const {id} =  req.params 

    await CS_STUDENT.deleteOne({registerNo:id})
    

    res.status(200).json({
        message:"Successfully student deleted"
    })
})


exports.postAttendance = asyncErrorHandler(async (req,res,next) =>{
    let data =  req.body 
    for(let i = 0 ; i < data.length ; i++ ){
        await CS_STUDENT.updateOne({_id:data[i]._id},{ $push:{ attendance : data[i].attendance } })
    }
    res.status(201).json({
            message:"Attendance posted successfully"
    })

})


exports.createMultipleStudents = asyncErrorHandler( async (req,res,next)=>{
    await CS_STUDENT.insertMany(req.body)
    await CS_STUDENT.updateMany({route:{$exists:false}},{$set:{route:"CS"}})
    res.status(200).json({
        status:"Success",
        message:"Multiple CS student created successfully"
    })
})

exports.updateFees = asyncErrorHandler( async (req,res,next) =>{

     if( !req.userData ) throw new CustomError("Unauthorized access",401)

     if( req.userData.role != "admin" ) throw new CustomError("Only admin can access",403)
    
    let {registerNo,tution,bus} = req.body
    console.log( registerNo,tution,bus )
    if( !tution ) tution = 0;
    if(!bus) bus = 0;
    console.log( registerNo,tution,bus )

    let data =  await CS_STUDENT.findOne({registerNo},{name:1,fees:1,registerNo:1,email:1,degree:1,currentYear:1})
    
    if( tution > 0 && data.fees.tutionFeesBalance === 0 ) throw new CustomError("All ready tution fees fully payed ",400)
    
     if( bus > 0 && data.fees.busFeesBalance === 0 ) throw new CustomError("All ready bus fees fully  payed ",400)

    if( tution >= data.fees.tutionFeesBalance + 1 ) throw new CustomError("Can not pay more then blance tution fees ammount",400)
    
   

    if( bus >= data.fees.busFeesBalance + 1 ) throw new CustomError("Can not pay more then blance bus fees ammount",400)
    

     await CS_STUDENT.updateOne({registerNo}, {$inc:{ 'fees.tutionFeesBalance':-tution,'fees.busFeesBalance':-bus,  } })
     
     let updateData = await CS_STUDENT.findOne({registerNo},{name:1,fees:1,registerNo:1,email:1,degree:1,currentYear:1})

    res.status(200).json({
        status:"Success",
        message:"Test fees update",
        updateData
    })
})

exports.getStudentDataForUpdateFees = asyncErrorHandler( async (req,res,next) =>{

    if( !req.userData ) throw new CustomError("Unauthorized access",401)

    if( req.userData.role != "admin" ) throw new CustomError("Only admin can access",403)

    let data = await CS_STUDENT.find({name: { $regex: `^${req.query.name}` , $options: 'im' }},{name:1,fees:1,registerNo:1,email:1,degree:1,currentYear:1}).sort({degree:-1,currentYear:1})
    res.status(200).json({
        status:"Success",
        message:"Test data for update fees",
        length:data.length,
        data
    })
})

exports.setSemesterFees = asyncErrorHandler( async (req,res,next) =>{
    
    const {registerNo,tution,bus} = req.body

    if( !tution || !bus ) throw new CustomError("Tution and bus fees required",400) 

    if( !req.userData ) throw new CustomError("Unauthorized access",401)
    if( req.userData.role != "admin" ) throw new CustomError("Only admin can access",403)

    let data = await CS_STUDENT.findOne({registerNo},{fees:1})

    if( data.fees.tution && data.fees.bus )  throw new CustomError("All ready tution and bus fees was set",400)

    if( !data.fees.tution && !data.fees.bus){

        await CS_STUDENT.updateOne({registerNo},{ 'fees.tution':tution,'fees.tutionFeesBalance':tution, 'fees.bus':bus, 'fees.busFeesBalance':bus })
        let updateData = await CS_STUDENT.findOne({registerNo},{name:1,fees:1,registerNo:1,email:1,degree:1,currentYear:1})
        res.status(201).json({
            status:"Success",
            message:"Successfully updated",
            updateData
        })   
    }else{
        throw new CustomError("Can not set fees",400)
    }
    
})