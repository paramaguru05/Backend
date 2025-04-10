const {createBook,getBooksByName,getBooksByCategory,getBooks,deleteBook,updateBook,issuedBook,retriveBook} = require("./../controller/LibraryController/bookController")
const {createLibrarian,deleteLibrarian,getLibrarian,updateLibrarian,forgetPassword,verifyOTP,librarianLogin,resetPassword,singleLibrarian} = require("./../controller/LibraryController/librarianController")
const {productStaff,productStudents,productLibrarian} = require("./../utils/productRoute")
const {productAdmin} = require("./../controller/adminController.js/adminController")
const express = require("express")
const router = express.Router()

router.route("/books")
      .get(productAdmin,productLibrarian,productStaff,productStudents,getBooks)
      .post(productAdmin,productLibrarian,createBook)
      .patch(productAdmin,productLibrarian,updateBook)

router.route("/books/:id")
      .delete(productAdmin,productLibrarian,deleteBook)


router.route("/books-name")
      .get(productAdmin,productLibrarian,productStaff,productStudents,getBooksByName)

router.route("/book-category")
      .get(getBooksByCategory)

router.route("/issu-book")
      .post(productAdmin,productLibrarian,issuedBook)

router.route("/retrive-book")
      .post(productAdmin,productLibrarian,retriveBook)

router.route("/librarian")
      .get(productAdmin,productLibrarian,getLibrarian)
      .post(productAdmin,createLibrarian)
      .patch(productAdmin,updateLibrarian)

router.route("/single-libaraian")
      .get(productAdmin,productLibrarian, singleLibrarian)

router.route("/librarian-login")
      .post(librarianLogin)

router.route("/forgetPassword")
      .post(forgetPassword)

router.route("/verifyOTP")
      .post(verifyOTP)

router.route("/resetPassword")
      .post(resetPassword)

router.route("/librarian/:id")
      .delete(productAdmin,deleteLibrarian)




module.exports = router