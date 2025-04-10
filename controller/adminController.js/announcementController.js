const CustomError = require("../../utils/customError")
const {admin_announce} = require("./../../model/announceMode")
const asyncErrorHandler = require("./../../utils/asyncErrorHandler")


exports.postAnnounce = asyncErrorHandler( async (req,res,next) =>{
    if( req?.userData?.role != "admin") throw new CustomError("Only admin can post announcement",403)
    await admin_announce.create(req.body)
    let data = await admin_announce.find().sort({createdAt:-1})
    res.status(201).json({
        status:"Success",
        message:"announcement posted successfully",
        data:{
            data
        }
    })
})

exports.getAnnounce = asyncErrorHandler( async (req,res,next)=>{

    console.log("Test announdement")

    let data = await admin_announce.find().sort({createdAt:-1})
    if(!data.length) throw new CustomError("Data not found",404)
    res.status(200).json({
        status:"Success",
        length:data.length,
        data
    })
})

exports.deleteAnnounce = asyncErrorHandler( async (req,res,next) =>{
    if( req?.userData?.role != "admin") throw new CustomError("Only admin can delete announcement",403)
        let id = req.params.id
        await admin_announce.deleteOne({_id:id})
        res.status(204).json({
            status:"Success",
            message:"announcement deleted successfully"
        })
})

exports.test = asyncErrorHandler ( async (req,res,next) =>{


    res.status(201).json({
        status:"Success",
        message:"announcement test successfully"
    })
})