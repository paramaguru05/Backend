const mongoose = require("mongoose")
const adminDB = require("./../config/adminDB")
const CS_DB = require("./../config/CS_DB")
const BCA_DB = require("./../config/BCA_DB")


const announceSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    subject:{
        type:String,
        required:[true,"Subject is required true"]
    },
    body:{
        type:String,
        required:[true,"Body is required true"]
    },
    createdAt :{
        type:Date,
        default:Date.now()
    }
})

const csAnnouncement = CS_DB.model("cs_announcement",announceSchema)
const bcaAnnouncement = BCA_DB.model("bca_announcemnet",announceSchema)
const admin_announce = adminDB.model('admin_announce',announceSchema)


module.exports = { csAnnouncement, bcaAnnouncement, admin_announce}