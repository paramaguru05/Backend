const Book = require("./../../model/bookModel")
const Apifeature = require("./../../utils/apiFeatures")
const asyncErrorHandler = require("./../../utils/asyncErrorHandler")


exports.createBook = asyncErrorHandler( async (req,res,next) =>{
    await Book.create(req.body)
    res.status(201).json({
        status:"Success",
        message:"Book was created successfully"
    })
} )

exports.getBooks = asyncErrorHandler( async (req,res,next) =>{
    
    let apiFeatures = new Apifeature( Book.find(), req.query).filter().sort().limit().limitFields()

    let data = await apiFeatures.query

    res.status(200).json({
        status:"Success",
        length: data.length,
        data:{
            data
        }
    })
} )