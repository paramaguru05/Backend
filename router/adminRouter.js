const {getAdmins,adminLogin,createAdmin,deleteAdmin,updateAdmin,getSingleAdmin,forgetPassword,verifyOTP,resetPassword,productAdmin} = require("./../controller/adminController.js/adminController")
const {getAnnounce,postAnnounce,deleteAnnounce,test} = require("./../controller/adminController.js/announcementController")
const express = require("express")

const router = express.Router()

router.route("/")
      .get(productAdmin,getAdmins)
      .post(productAdmin,createAdmin)
      .patch(productAdmin,updateAdmin)

router.route("/:id")
      .delete(productAdmin,deleteAdmin)


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

router.route('/announcements')
      .get(getAnnounce)
      .post(productAdmin,postAnnounce)

router.route('/announcements/:id')
      .delete(productAdmin,deleteAnnounce)

module.exports = router