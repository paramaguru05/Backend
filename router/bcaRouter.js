const {createStudent,getStudent,studentLogin,getStudents,updateStudent,deleteStudent,postAttendance,getAttendance,createMultipleStudents,productStudent} = require("./../controller/BCAController/studentController")
const {createTeacher,getTeachers,staffLogin,productStaff,getSingleStaff,forgetPassword,verifyOTP,resetPassword,setRout} = require("./../controller/BCAController/teacherController")
const {deleteAnnouncement,getAnnouncement,postAnnouncement} = require("./../controller/BCAController/announcementController")
const {productAdmin} = require("./../controller/adminController.js/adminController")
const express = require("express")
const router = express.Router()

// route for student

router.route("/studentLogin")
      .post(studentLogin)

router.route("/students")
      .get(productStaff,getStudents)
      .post(productStaff,createStudent)
      .patch(productStaff,updateStudent)

router.route("/students/:id")
      .delete(productStaff,deleteStudent) 
      .get(productStaff,productStudent,getStudent)     
            

router.route('/multi-students')
      .post(productStaff,createMultipleStudents)

// route for staff
router.route('/staff')
      .get(productStaff,getTeachers)
      .post(productStaff,createTeacher)   

router.route("/single-staff")
      .get(productStaff,getSingleStaff)

router.route("/staffLogin")
      .post(staffLogin)

router.route("/staff/forgetPassword")
      .post(forgetPassword)

router.route("/staff/setRoute")
      .patch(setRout)

router.route("/staff/verifyOTP")
      .post(verifyOTP)

router.route("/staff/resetPassword")
      .post(resetPassword)


// route for attendance 

router.route("/attendance")
      .post(productStaff,postAttendance)
      .get(productAdmin,productStaff,getAttendance)


// route for announcment

router.route("/announcements")
      .get(productStaff,productStudent,getAnnouncement)
      .post(productStaff,postAnnouncement)

router.route("/announcements/:id")
      .delete(productStaff,deleteAnnouncement)



module.exports = router