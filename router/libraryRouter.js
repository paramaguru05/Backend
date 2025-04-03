const {createBook,getBooks,getBooksByCategory} = require("./../controller/LibraryController/bookController")
const {createLibrarian,deleteLibrarian,getLibrarian,updateLibrarian} = require("./../controller/LibraryController/librarianController")
const {productStaff,productStudents} = require("./../utils/productRoute")
const {productAdmin} = require("./../controller/adminController.js/adminController")
const express = require("express")
const router = express.Router()

router.route("/books")
      .get( productStaff,productStudents,getBooks)
      .post(createBook)

router.route("/book-category")
      .get(getBooksByCategory)

router.route("/librarian")
      .get(getLibrarian)
      .post(productAdmin,createLibrarian)
      .patch(productAdmin,updateLibrarian)

router.route("/librarian/:id")
      .delete(productAdmin,deleteLibrarian)


module.exports = router