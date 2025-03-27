const {bcaAnnouncement} =  require("./../../model/announceMode")
const asyncErrorHandler = require("./../../utils/asyncErrorHandler")
const CustomError = require("./../../utils/customError")

exports.postAnnouncement = asyncErrorHandler(async (req,res,next) =>{

    if( !req.userData || req.userData.role != "HOD"|| req.userData.route != "BCA" ) throw new CustomError("Only BCA HOD can post announcemnet",401)

        await bcaAnnouncement.create(req.body)
        
        res.status(201).json({
            status:"Success",
            message:"Announcement posted successfully"
        })

})

exports.getAnnouncement = asyncErrorHandler(async (req,res,next) =>{

    if( req.userData.route != "BCA") throw new CustomError("Only BCA department staff or student can access",401)

     let query = bcaAnnouncement.find()
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


    if( !req.userData || req.userData.role != "HOD"|| req.userData.route != "BCA" ) throw new CustomError("Only BCA HOD can delete announcemnet",401)
    let id = req.params.id

    await bcaAnnouncement.deleteOne({_id:id})
        res.status(200).json({
        status:"Success",
        message:"Successfully BCA announcement deleted"
    })

})