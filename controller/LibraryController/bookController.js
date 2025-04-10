const Book = require("./../../model/bookModel")
const Apifeature = require("./../../utils/apiFeatures")
const CustomError = require("./../../utils/customError")
const asyncErrorHandler = require("./../../utils/asyncErrorHandler")



exports.createBook = asyncErrorHandler( async (req,res,next) =>{

    if(!req.userData) throw new CustomError("Only admin or libraian can add book",401)
        
    if( req.userData.role != "admin" && req.userData.role != "librarian" ) throw new CustomError("Only admin or libraian can add book",401)
    
    await Book.create(req.body)
    res.status(201).json({
        status:"Success",
        message:"Book was created successfully"
    })
} )


exports.getBooks = asyncErrorHandler( async (req,res,next) =>{

    if(!req.userData) throw new CustomError("Only student portal user can access",401)


    let apiFeatures = new Apifeature( Book.find(),req.query ).filter().skip().limit().sort().limitFields()
    let data = await apiFeatures.query
   
    let totalBooks = await Book.countDocuments()


    if( !data.length) throw new CustomError("Book not found",404) 

    res.status(200).json({
        status:"Success",
        length:data.length,
        totalBooks,
        data:{
            data
        }
    })

})


exports.getBooksByName = asyncErrorHandler( async (req,res,next) =>{
    
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

exports.deleteBook = asyncErrorHandler( async (req,res,next) =>{
    if(!req.userData) throw new CustomError("Unauthorized access",401)
    console.log( req.userData )
    if( req.userData.role != "librarian" && req.userData.role != "librarian" ) throw new CustomError("Only admin or libraian can delete",403)

    let id = req.params.id

    await Book.deleteOne({_id:id})

    res.status(204).json({
        status:"Success",
        message:"Book successfully deleted"
    })
    
})

exports.updateBook = asyncErrorHandler( async (req,res,next) =>{

    if(!req.userData) throw new CustomError("Unauthorized access",401)
    if( req.userData.role != "librarian" && req.userData.role != "admin" ) throw new CustomError("Only admin or libraian can update",403)
    

    const { id  } = req.body 

    if( !id ) throw new CustomError("Can't update without book id",400)

    delete req.body.id

    await Book.updateOne({_id:id},req.body)

    res.status(200).json({
        status:"Success",
        message:"Book successfully updated"
    })

})

exports.issuedBook = asyncErrorHandler( async (req,res,next) =>{

    if(!req.userData) throw new CustomError("Unauthorized access",401)
    if( req.userData.role != "librarian" && req.userData.role != "admin" ) throw new CustomError("Only admin or libraian can update",403)
         
    let {id} = req.body 
    delete req.body.id
    let data =  await Book.findOne({_id:id})

    if( data.currentStack === 0) throw new CustomError("Book is not available",400)

    await Book.updateOne({_id:id},{ $push:{ studentsData: req.body } })

    await Book.updateOne({_id:id},{ $inc:{ currentStack: -1 } })

    res.status(201).json({
        status:"Success",
        message:"Test issued book"
    })

})

exports.retriveBook = asyncErrorHandler ( async (req,res,next) =>{
    if(!req.userData) throw new CustomError("Unauthorized access",401)
    if( req.userData.role != "librarian" && req.userData.role != "admin" ) throw new CustomError("Only admin or libraian can update",403)
    let {id,registerNo} = req.body  

    await Book.updateOne({_id:id},{$pull:{ studentsData:{ registerNo: registerNo } } })
    
    await Book.updateOne({_id:id},{$inc:{ currentStack: 1 } })
    
    res.status(201).json({
        status:"Success",
        message:"Book successfully retrived"
    })

})