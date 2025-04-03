const { librarian } = require("./../../model/teacherModel")
const asyncErrorHandler = require("./../../utils/asyncErrorHandler")
const customError = require("./../../utils/customError")

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

    let data = await librarian.find()

    res.status(200).json({
        status:"Success",
        length:data.length,
        data:{
            data
        }
    })

} )

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