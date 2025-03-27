const {createBook,getBooks} = require("./../controller/LibraryController/bookController")

const express = require("express")
const router = express.Router()


router.route("/books")
      .get(getBooks)
      .post(createBook)


module.exports = router