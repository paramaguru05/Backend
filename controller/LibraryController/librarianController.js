const librarian = require("./../../model/librarianModel")
const asyncErrorHandler = require("./../../utils/asyncErrorHandler")


exports.createLibrarian = asyncErrorHandler( async (req,res,next) =>{

    await librarian.create(req.body)

    req.status(201).json({
        status:"Success",
        message:"Librarian successfully created"
    })

} )

exports.getLibrarian = asyncErrorHandler(async (req,res,next) =>{

    let data = await librarian.find()

    req.status(201).json({
        status:"Success",
        length:data.length,
        data:{
            data
        }
    })

} )

exports.deleteLibrarian = asyncErrorHandler(async (req,res,next) =>{

    let id =  req.librarianId

    await librarian.deleteOne({_id:id})

    req.status(201).json({
        status:"Success",
        message:"Successdfully librarian deleted"
    })

})