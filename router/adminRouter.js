const {getAdmins,getSingleAdmin,adminLogin,createAdmin,deleteAdmin,updateAdmin,forgetPassword,verifyOTP,resetPassword,productAdmin,postStudentResults} = require("./../controller/adminController.js/adminController")
const {getAnnounce,postAnnounce,deleteAnnounce,test} = require("./../controller/adminController.js/announcementController")
const express = require("express")
const fs = require("fs")
const path = require("path")
const multer = require("multer")
const router = express.Router()

router.route("/")
      .get(productAdmin,getAdmins)
      .post(productAdmin,createAdmin)
      .patch(productAdmin,updateAdmin)
      .delete(productAdmin,deleteAdmin)


router.route("/single-admins")
      .get(productAdmin,getSingleAdmin)

// route for authentication

router.route("/login")
      .post(adminLogin)

router.route("/forget-password")
      .post(forgetPassword)

router.route("/verify-opt")
      .post(verifyOTP)

router.route("/reset-password")
      .post(resetPassword)

// route for announcemnet

// router.route("/test")
//       .get(test)

router.route("/test")
      .get(getAnnounce)

router.route('/announcements')
      .get(getAnnounce)
      .post(productAdmin,postAnnounce)

router.route('/announcements/:id')
      .delete(productAdmin,deleteAnnounce)

// route for exam result


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./devData")
    },
    filename:(req,file,cb)=>{
        cb(null,`examResult.json`)
    }
})

const uploads = multer({
    storage
})


router.route("/exam-results")
      .post(uploads.single('file'),postStudentResults)

module.exports = router