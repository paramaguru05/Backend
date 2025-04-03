const Book = require("./../../model/bookModel")
const Apifeature = require("./../../utils/apiFeatures")
const CustomError = require("./../../utils/customError")
const asyncErrorHandler = require("./../../utils/asyncErrorHandler")


exports.createBook = asyncErrorHandler( async (req,res,next) =>{
    await Book.create(req.body)
    res.status(201).json({
        status:"Success",
        message:"Book was created successfully"
    })
} )

exports.getBooks = asyncErrorHandler( async (req,res,next) =>{
    
    let data = await Book.find( { name:{ $regex: `^${req.query.name}` , $options: 'im' } } )

    if( !data.length ) throw new CustomError("Book not found",404) 

    res.status(200).json({
        status:"Success",
        length: data.length,
        data:{
            data
        }
    })
} )

exports.getBooksByCategory = asyncErrorHandler( async ( req,res,next) =>{

 
    let data = await Book.find({category:req.query.category})

    if( !data.length ) throw new CustomError("Book not found",404) 

    res.status(200).json({
        status:"Success",
        length:data.length,
        data:{
            data
        }
    })
})