const express = require('express')
const router = express()

const {createAttenanceList,createStudent,getStudent,studentLogin,getStudents,updateStudent,deleteStudent,postAttendance,createMultipleStudents,getAttendance,updateFees,getStudentDataForUpdateFees,setSemesterFees} = require("./../controller/TamilController/studentController")
const {updateStaff,createTeacher,getTeachers,staffLogin,getSingleStaff,deleteStaff,forgetPassword,verifyOTP,resetPassword} = require("./../controller/TamilController/teacherController")
const {deleteAnnouncement,getAnnouncement,postAnnouncement} = require("./../controller/TamilController/announcementController")
const {productAdmin} = require("./../controller/adminController.js/adminController")
const {productStudents,productStaff} = require("./../utils/productRoute")



// route for student

router.route("/studentLogin")
      .post(studentLogin)


router.route("/students")
      .get(productAdmin,productStaff,productStudents,getStudents)
      .post(productAdmin,productStaff,createStudent)
      .patch(productAdmin,productStaff,updateStudent)

router.route("/students/:id")
      .delete(productAdmin,productStaff,deleteStudent)
      .get(productAdmin,productStaff,productStudents,getStudent)
      

// route for staff
router.route('/staff')
      .get(productAdmin,productStaff, getTeachers)
      .post(productAdmin,productStaff,createTeacher)   
      .patch(productAdmin,productStaff,updateStaff)

router.route("/staff/:id")
      .delete(productAdmin,productStaff,deleteStaff)

router.route("/single-staff")
      .get(productAdmin,productStaff,getSingleStaff)

router.route("/staffLogin")
      .post(staffLogin)

router.route("/staff/forgetPassword")
      .post(forgetPassword)

router.route("/staff/verifyOTP")
      .post(verifyOTP)

router.route("/staff/resetPassword")
      .post(resetPassword)

// route for attendance 

router.route("/attendance-students")
      .get(productStaff,createAttenanceList)

router.route("/attendance")
      .post(productStaff,postAttendance)
      .get(productAdmin,productStaff,getAttendance)


// route for announcment

router.route("/announcements")
      .get(productStaff,productStudents,getAnnouncement)
      .post(productStaff,postAnnouncement)

router.route("/announcements/:id")
      .delete(productStaff,deleteAnnouncement)


// update fees

router.route("/fees")
      .post(productAdmin,updateFees)
      .get(productAdmin,getStudentDataForUpdateFees)

router.route("/fees/set-semesterFees")
      .post(productAdmin,setSemesterFees)

module.exports = router