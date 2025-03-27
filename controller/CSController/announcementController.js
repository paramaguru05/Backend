const {csAnnouncement} =  require("./../../model/announceMode")
const CustomError = require("./../../utils/customError")
const asyncErrorHandler = require("./../../utils/asyncErrorHandler")

exports.postAnnouncement = asyncErrorHandler(async (req,res,next) =>{

    if( req.userData.role != "HOD"|| req.userData.route != "CS" ) throw new CustomError("Only computer science HOD can post announcemnet",401)

        await csAnnouncement.create(req.body)
        res.status(201).json({
            status:"Success",
            message:"Announcement posted successfully"
        })

})

exports.getAnnouncement = asyncErrorHandler(async (req,res,next) =>{

       if( req.userData.route != "CS") throw new CustomError("Only computer science department staff or student can access",401)

        let query = csAnnouncement.find()
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
    if( req.userData.role != "HOD"|| req.userData.route != "CS" ) throw new CustomError("Only computer science HOD can delete announcemnet",401)
    let id = req.params.id
    
    await csAnnouncement.deleteOne({_id:id})
        res.status(200).json({
        status:"Success",
        message:"Successfully announcement deleted"
    })

})