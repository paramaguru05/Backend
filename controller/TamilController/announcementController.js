const {tamilAnnounce} =  require("./../../model/announceMode")
const asyncErrorHandler = require("./../../utils/asyncErrorHandler")
const CustomError = require("./../../utils/customError")

exports.postAnnouncement = asyncErrorHandler(async (req,res,next) =>{

    if( !req.userData || req.userData.role != "HOD"|| req.userData.route != "tamil" ) throw new CustomError("Only tamil HOD can post announcemnet",401)

        await tamilAnnounce.create(req.body)
        
        res.status(201).json({
            status:"Success",
            message:"Announcement posted successfully"
        })

})

exports.getAnnouncement = asyncErrorHandler(async (req,res,next) =>{

    if( req.userData.route != "tamil") throw new CustomError("Only tamil department staff or student can access",401)

     let query = tamilAnnounce.find()
     query = query.sort('-createdAt')
     let data = await query
     res.status(200).json({
         status:"Success announce",
         length:data.length,
         data:{
             data
         }
     })
})

exports.deleteAnnouncement = asyncErrorHandler(async (req,res,next) =>{


    if( !req.userData || req.userData.role != "HOD"|| req.userData.route != "tamil" ) throw new CustomError("Only tamil HOD can delete announcemnet",401)
    let id = req.params.id

    await tamilAnnounce.deleteOne({_id:id})
        res.status(200).json({
        status:"Success",
        message:"Successfully tamil announcement deleted"
    })

})